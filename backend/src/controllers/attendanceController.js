const Attendance = require('../models/Attendance');
const AttendanceSession = require('../models/AttendanceSession');
const Student = require('../models/Student');
const Class = require('../models/Class');
const { validateLocation, determineStatus, generateCode } = require('../utils/geolocation');
const logger = require('../utils/logger');

// @desc    Create attendance session
// @route   POST /api/attendance/sessions
// @access  Private/Teacher
exports.createSession = async (req, res) => {
  try {
    const { classId, duration, notes } = req.body;

    // Verify class belongs to teacher
    const classObj = await Class.findOne({
      _id: classId,
      teacherId: req.user._id,
    });

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    // Check if there's already an active session
    const existingSession = await AttendanceSession.findOne({
      classId,
      active: true,
      expiresAt: { $gt: new Date() },
    });

    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: 'There is already an active session for this class',
        session: {
          code: existingSession.code,
          expiresAt: existingSession.expiresAt,
        },
      });
    }

    // Get student count
    const studentCount = await Student.countDocuments({ 
      classId, 
      isActive: true 
    });

    // Generate code
    const code = generateCode(parseInt(process.env.ATTENDANCE_CODE_LENGTH) || 6);
    const durationMinutes = duration || parseInt(process.env.ATTENDANCE_CODE_EXPIRE_MINUTES) || 10;
    
    // Calculate expiration
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    const session = await AttendanceSession.create({
      classId,
      code,
      expiresAt,
      startedBy: req.user._id,
      startTime: new Date(),
      duration: durationMinutes,
      presentMinutes: classObj.presentMinutes,
      lateMinutes: classObj.lateMinutes,
      totalStudents: studentCount,
      notes,
    });

    logger.info(`Attendance session created: ${session._id} for class ${classId}`);

    res.status(201).json({
      success: true,
      message: 'Attendance session created',
      session: {
        id: session._id,
        code: session.code,
        expiresAt: session.expiresAt,
        duration: session.duration,
        totalStudents: session.totalStudents,
      },
    });
  } catch (error) {
    logger.error(`Create session error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error creating session',
    });
  }
};

// @desc    End attendance session
// @route   PUT /api/attendance/sessions/:id/end
// @access  Private/Teacher
exports.endSession = async (req, res) => {
  try {
    const session = await AttendanceSession.findOne({
      _id: req.params.id,
      active: true,
    }).populate('classId', 'teacherId');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or already ended',
      });
    }

    // Verify teacher owns the class
    if (session.classId.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    session.active = false;
    session.endTime = new Date();
    await session.save();

    logger.info(`Attendance session ended: ${session._id}`);

    res.json({
      success: true,
      message: 'Session ended successfully',
      session,
    });
  } catch (error) {
    logger.error(`End session error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error ending session',
    });
  }
};

// @desc    Get active session for class
// @route   GET /api/attendance/sessions/active/:classId
// @access  Private/Teacher
exports.getActiveSession = async (req, res) => {
  try {
    const { classId } = req.params;

    // Verify class belongs to teacher
    const classObj = await Class.findOne({
      _id: classId,
      teacherId: req.user._id,
    });

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    const session = await AttendanceSession.findOne({
      classId,
      active: true,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return res.json({
        success: true,
        session: null,
      });
    }

    // Get attendance count
    const attendanceCount = await Attendance.countDocuments({
      sessionId: session._id,
    });

    res.json({
      success: true,
      session: {
        ...session.toObject(),
        checkedInCount: attendanceCount,
      },
    });
  } catch (error) {
    logger.error(`Get active session error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get session by code (for verification)
// @route   GET /api/attendance/sessions/code/:code
// @access  Public (student check-in)
exports.getSessionByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const session = await AttendanceSession.findOne({
      code: code.toUpperCase(),
      active: true,
      expiresAt: { $gt: new Date() },
    }).populate('classId', 'name subject presentMinutes lateMinutes');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired session code',
      });
    }

    res.json({
      success: true,
      session: {
        id: session._id,
        className: session.classId.name,
        subject: session.classId.subject,
        expiresAt: session.expiresAt,
        presentMinutes: session.classId.presentMinutes,
        lateMinutes: session.classId.lateMinutes,
      },
    });
  } catch (error) {
    logger.error(`Get session by code error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Student check-in
// @route   POST /api/attendance/checkin
// @access  Public (student check-in)
exports.checkIn = async (req, res) => {
  try {
    const { uid, code, latitude, longitude } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Find active session with this code
    const session = await AttendanceSession.findOne({
      code: code.toUpperCase(),
      active: true,
      expiresAt: { $gt: new Date() },
    }).populate('classId');

    if (!session) {
      logger.warn(`Check-in failed: Invalid/expired code ${code}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired attendance code',
        code: 'INVALID_CODE',
      });
    }

    // Find student by UID
    const student = await Student.findOne({
      uid: uid.toUpperCase(),
      classId: session.classId._id,
      isActive: true,
    });

    if (!student) {
      logger.warn(`Check-in failed: Student not found with UID ${uid}`);
      return res.status(404).json({
        success: false,
        message: 'Student not found with this UID',
        code: 'INVALID_STUDENT',
      });
    }

    // Check if already marked attendance today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await Attendance.findOne({
      studentId: student._id,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (existingAttendance) {
      logger.warn(`Check-in failed: Duplicate attendance for student ${student.uid}`);
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for today',
        code: 'DUPLICATE',
      });
    }

    // Validate location
    const locationValidation = validateLocation(
      latitude,
      longitude,
      session.classId.schoolLatitude,
      session.classId.schoolLongitude,
      session.classId.allowedRadius
    );

    // Determine attendance status
    const status = determineStatus(
      new Date(),
      session.startTime,
      session.presentMinutes,
      session.lateMinutes
    );

    // Create attendance record
    const attendance = await Attendance.create({
      studentId: student._id,
      classId: session.classId._id,
      sessionId: session._id,
      date: new Date(),
      status: locationValidation.valid ? status : 'absent',
      timestamp: new Date(),
      latitude,
      longitude,
      ipAddress,
      userAgent,
      locationValid: locationValidation.valid,
      distanceFromSchool: locationValidation.distance,
      markedBy: 'self',
    });

    // Update session checked in count
    session.checkedInCount += 1;
    await session.save();

    logger.info(`Check-in successful: Student ${student.uid} marked ${status} at ${session.classId.name}`);

    res.status(201).json({
      success: true,
      message: locationValidation.valid 
        ? `Attendance marked as ${status}` 
        : 'Attendance marked but location was outside allowed area',
      attendance: {
        id: attendance._id,
        status: attendance.status,
        timestamp: attendance.timestamp,
        locationValid: attendance.locationValid,
        distanceFromSchool: attendance.distanceFromSchool,
      },
      student: {
        name: student.name,
        uid: student.uid,
      },
    });
  } catch (error) {
    logger.error(`Check-in error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error during check-in',
    });
  }
};

// @desc    Get class attendance records
// @route   GET /api/attendance
// @access  Private/Teacher
exports.getAttendance = async (req, res) => {
  try {
    const { classId, date, status, page = 1, limit = 20 } = req.query;

    // Verify class belongs to teacher
    const classObj = await Class.findOne({
      _id: classId,
      teacherId: req.user._id,
    });

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    const query = { classId };

    if (date) {
      const searchDate = new Date(date);
      const nextDate = new Date(searchDate);
      nextDate.setDate(nextDate.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDate };
    }

    if (status) {
      query.status = status;
    }

    const attendance = await Attendance.find(query)
      .populate('studentId', 'name uid')
      .populate('sessionId', 'code startTime')
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Attendance.countDocuments(query);

    // Get summary stats
    const summary = await Attendance.aggregate([
      { $match: { classId: classObj._id } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 },
      }},
    ]);

    const summaryObj = {
      present: 0,
      late: 0,
      absent: 0,
    };
    summary.forEach(s => {
      summaryObj[s._id] = s.count;
    });

    res.json({
      success: true,
      attendance,
      summary: summaryObj,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Get attendance error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching attendance',
    });
  }
};

// @desc    Get attendance statistics
// @route   GET /api/attendance/stats/:classId
// @access  Private/Teacher
exports.getStats = async (req, res) => {
  try {
    const { classId } = req.params;
    const { startDate, endDate } = req.query;

    // Verify class belongs to teacher
    const classObj = await Class.findOne({
      _id: classId,
      teacherId: req.user._id,
    });

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    const matchQuery = { classId };

    if (startDate && endDate) {
      matchQuery.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Overall stats
    const overallStats = await Attendance.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          present: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
          },
          late: {
            $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] },
          },
          absent: {
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] },
          },
        },
      },
    ]);

    // Daily stats
    const dailyStats = await Attendance.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          present: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
          },
          late: {
            $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] },
          },
          absent: {
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 30 },
    ]);

    res.json({
      success: true,
      overall: overallStats[0] || { total: 0, present: 0, late: 0, absent: 0 },
      daily: dailyStats,
    });
  } catch (error) {
    logger.error(`Get stats error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics',
    });
  }
};

// @desc    Export attendance to CSV
// @route   GET /api/attendance/export/:classId
// @access  Private/Teacher
exports.exportAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { date } = req.query;

    // Verify class belongs to teacher
    const classObj = await Class.findOne({
      _id: classId,
      teacherId: req.user._id,
    });

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    const query = { classId };

    if (date) {
      const searchDate = new Date(date);
      const nextDate = new Date(searchDate);
      nextDate.setDate(nextDate.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDate };
    }

    const attendance = await Attendance.find(query)
      .populate('studentId', 'name uid')
      .sort({ timestamp: -1 });

    // Create CSV
    const headers = ['Date', 'Student Name', 'UID', 'Status', 'Time', 'Location Valid', 'Distance (m)'];
    const rows = attendance.map(a => [
      a.date.toISOString().split('T')[0],
      a.studentId.name,
      a.studentId.uid,
      a.status,
      a.timestamp.toISOString(),
      a.locationValid ? 'Yes' : 'No',
      a.distanceFromSchool || '',
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=attendance-${classId}-${date || 'all'}.csv`);
    res.send(csv);
  } catch (error) {
    logger.error(`Export attendance error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error exporting attendance',
    });
  }
};

// @desc    Manually mark attendance
// @route   POST /api/attendance/manual
// @access  Private/Teacher
exports.manualMark = async (req, res) => {
  try {
    const { studentId, classId, status, date, notes } = req.body;

    // Verify class belongs to teacher
    const classObj = await Class.findOne({
      _id: classId,
      teacherId: req.user._id,
    });

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    // Check if attendance already exists
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(searchDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const existing = await Attendance.findOne({
      studentId,
      classId,
      date: { $gte: searchDate, $lt: nextDate },
    });

    if (existing) {
      // Update existing
      existing.status = status;
      existing.markedBy = 'teacher';
      existing.notes = notes;
      await existing.save();

      return res.json({
        success: true,
        message: 'Attendance updated',
        attendance: existing,
      });
    }

    // Create new
    const attendance = await Attendance.create({
      studentId,
      classId,
      date: searchDate,
      status,
      timestamp: new Date(),
      markedBy: 'teacher',
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked',
      attendance,
    });
  } catch (error) {
    logger.error(`Manual mark error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
