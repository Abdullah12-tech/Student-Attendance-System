const User = require('../models/User');
const Class = require('../models/Class');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const AttendanceSession = require('../models/AttendanceSession');
const logger = require('../utils/logger');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    // Get counts
    const [teacherCount, classCount, studentCount, sessionCount] = await Promise.all([
      User.countDocuments({ role: 'teacher', isActive: true }),
      Class.countDocuments({ isActive: true }),
      Student.countDocuments({ isActive: true }),
      AttendanceSession.countDocuments(),
    ]);

    // Get today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendance = await Attendance.aggregate([
      { $match: { date: { $gte: today, $lt: tomorrow } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const attendanceStats = {
      present: 0,
      late: 0,
      absent: 0,
    };
    todayAttendance.forEach(s => {
      attendanceStats[s._id] = s.count;
    });

    const totalToday = attendanceStats.present + attendanceStats.late + attendanceStats.absent;
    const attendanceRate = totalToday > 0 
      ? ((attendanceStats.present + attendanceStats.late) / totalToday * 100).toFixed(1)
      : 0;

    // Get weekly trend
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyAttendance = await Attendance.aggregate([
      { $match: { date: { $gte: weekAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
          late: { $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        teachers: teacherCount,
        classes: classCount,
        students: studentCount,
        sessions: sessionCount,
        today: {
          ...attendanceStats,
          total: totalToday,
          attendanceRate: parseFloat(attendanceRate),
        },
        weeklyTrend: weeklyAttendance,
      },
    });
  } catch (error) {
    logger.error(`Admin stats error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching stats',
    });
  }
};

// @desc    Get all teachers
// @route   GET /api/admin/teachers
// @access  Private/Admin
exports.getTeachers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', isActive } = req.query;

    const query = { role: 'teacher' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const teachers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    // Get class and student counts for each teacher
    const teachersWithCounts = await Promise.all(
      teachers.map(async (teacher) => {
        const classCount = await Class.countDocuments({ teacherId: teacher._id, isActive: true });
        const studentCount = await Student.countDocuments({ 
          classId: { $in: await Class.find({ teacherId: teacher._id }).distinct('_id') },
          isActive: true 
        });
        
        return {
          ...teacher.toObject(),
          classCount,
          studentCount,
        };
      })
    );

    res.json({
      success: true,
      teachers: teachersWithCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Get teachers error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching teachers',
    });
  }
};

// @desc    Create teacher
// @route   POST /api/admin/teachers
// @access  Private/Admin
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const teacher = await User.create({
      name,
      email,
      password,
      role: 'teacher',
    });

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
      },
    });
  } catch (error) {
    logger.error(`Create teacher error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error creating teacher',
    });
  }
};

// @desc    Update teacher
// @route   PUT /api/admin/teachers/:id
// @access  Private/Admin
exports.updateTeacher = async (req, res) => {
  try {
    const { name, email, isActive } = req.body;

    const teacher = await User.findOne({ _id: req.params.id, role: 'teacher' });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }

    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (isActive !== undefined) teacher.isActive = isActive;

    await teacher.save();

    res.json({
      success: true,
      message: 'Teacher updated successfully',
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        isActive: teacher.isActive,
      },
    });
  } catch (error) {
    logger.error(`Update teacher error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error updating teacher',
    });
  }
};

// @desc    Delete teacher
// @route   DELETE /api/admin/teachers/:id
// @access  Private/Admin
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await User.findOne({ _id: req.params.id, role: 'teacher' });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }

    // Soft delete
    teacher.isActive = false;
    await teacher.save();

    res.json({
      success: true,
      message: 'Teacher deactivated successfully',
    });
  } catch (error) {
    logger.error(`Delete teacher error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error deleting teacher',
    });
  }
};

// @desc    Get system logs
// @route   GET /api/admin/logs
// @access  Private/Admin
exports.getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    // In production, you'd fetch from actual log storage
    // For now, return empty
    res.json({
      success: true,
      logs: [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
        pages: 0,
      },
    });
  } catch (error) {
    logger.error(`Get logs error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
