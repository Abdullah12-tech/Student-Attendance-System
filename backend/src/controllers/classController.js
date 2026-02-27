const Class = require('../models/Class');
const Student = require('../models/Student');
const AttendanceSession = require('../models/AttendanceSession');
const logger = require('../utils/logger');

// @desc    Create new class
// @route   POST /api/classes
// @access  Private/Teacher
exports.createClass = async (req, res) => {
  try {
    const classData = {
      ...req.body,
      teacherId: req.user._id,
    };

    const classObj = await Class.create(classData);

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      class: classObj,
    });
  } catch (error) {
    logger.error(`Create class error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error creating class',
    });
  }
};

// @desc    Get all classes for teacher
// @route   GET /api/classes
// @access  Private/Teacher
exports.getClasses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = { teacherId: req.user._id };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    const classes = await Class.find(query)
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Class.countDocuments(query);

    res.json({
      success: true,
      classes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Get classes error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching classes',
    });
  }
};

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Private/Teacher
exports.getClass = async (req, res) => {
  try {
    const classObj = await Class.findOne({
      _id: req.params.id,
      teacherId: req.user._id,
    }).populate('teacherId', 'name email');

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    // Get student count
    const studentCount = await Student.countDocuments({ 
      classId: classObj._id, 
      isActive: true 
    });

    // Get active session
    const activeSession = await AttendanceSession.findOne({
      classId: classObj._id,
      active: true,
      expiresAt: { $gt: new Date() },
    });

    res.json({
      success: true,
      class: {
        ...classObj.toObject(),
        studentCount,
        activeSession: activeSession ? {
          code: activeSession.code,
          expiresAt: activeSession.expiresAt,
          checkedInCount: activeSession.checkedInCount,
        } : null,
      },
    });
  } catch (error) {
    logger.error(`Get class error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching class',
    });
  }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private/Teacher
exports.updateClass = async (req, res) => {
  try {
    let classObj = await Class.findOne({
      _id: req.params.id,
      teacherId: req.user._id,
    });

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    classObj = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Class updated successfully',
      class: classObj,
    });
  } catch (error) {
    logger.error(`Update class error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error updating class',
    });
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private/Teacher
exports.deleteClass = async (req, res) => {
  try {
    const classObj = await Class.findOne({
      _id: req.params.id,
      teacherId: req.user._id,
    });

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    // Check if class has students
    const studentCount = await Student.countDocuments({ classId: classObj._id });
    if (studentCount > 0) {
      // Soft delete - just mark as inactive
      classObj.isActive = false;
      await classObj.save();
      
      return res.json({
        success: true,
        message: 'Class deactivated (has associated students)',
      });
    }

    await classObj.deleteOne();

    res.json({
      success: true,
      message: 'Class deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete class error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error deleting class',
    });
  }
};

// @desc    Get class students
// @route   GET /api/classes/:id/students
// @access  Private/Teacher
exports.getClassStudents = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    
    // Verify class belongs to teacher
    const classObj = await Class.findOne({
      _id: req.params.id,
      teacherId: req.user._id,
    });

    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    const query = { classId: req.params.id };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { uid: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await Student.find(query)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Student.countDocuments(query);

    res.json({
      success: true,
      students,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Get class students error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching students',
    });
  }
};
