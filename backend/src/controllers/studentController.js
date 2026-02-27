const Student = require('../models/Student');
const Class = require('../models/Class');
const logger = require('../utils/logger');

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Teacher
exports.createStudent = async (req, res) => {
  try {
    const { classId, name, email, phone, parentContact, address, dateOfBirth } = req.body;

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

    // Check if student with same name exists in this class
    const existingStudent = await Student.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      classId,
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this name already exists in this class',
      });
    }

    const student = await Student.create({
      classId,
      name,
      email,
      phone,
      parentContact,
      address,
      dateOfBirth,
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      student,
    });
  } catch (error) {
    logger.error(`Create student error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error creating student',
    });
  }
};

// @desc    Bulk create students
// @route   POST /api/students/bulk
// @access  Private/Teacher
exports.bulkCreateStudents = async (req, res) => {
  try {
    const { classId, students } = req.body;

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

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Students array is required',
      });
    }

    // Get current student count for UID generation
    const currentCount = await Student.countDocuments({ classId });

    // Prepare students data
    const studentsData = students.map((student, index) => ({
      classId,
      name: student.name,
      email: student.email,
      phone: student.phone,
      parentContact: student.parentContact,
      address: student.address,
      dateOfBirth: student.dateOfBirth,
    }));

    // Insert students
    const createdStudents = await Student.insertMany(studentsData, { ordered: false });

    res.status(201).json({
      success: true,
      message: `${createdStudents.length} students created successfully`,
      students: createdStudents,
    });
  } catch (error) {
    logger.error(`Bulk create students error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error creating students',
    });
  }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Teacher
exports.getStudents = async (req, res) => {
  try {
    const { page = 1, limit = 20, classId, search = '' } = req.query;
    
    // Get teacher's classes
    const classes = await Class.find({ teacherId: req.user._id, isActive: true });
    const classIds = classes.map(c => c._id);

    const query = {};
    
    // If classId is provided, verify it belongs to teacher
    if (classId) {
      if (!classIds.some(id => id.toString() === classId)) {
        return res.status(404).json({
          success: false,
          message: 'Class not found',
        });
      }
      query.classId = classId;
    } else {
      query.classId = { $in: classIds };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { uid: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await Student.find(query)
      .populate('classId', 'name subject')
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
    logger.error(`Get students error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching students',
    });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private/Teacher
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('classId', 'name subject teacherId');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Verify teacher owns the class
    if (student.classId.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      student,
    });
  } catch (error) {
    logger.error(`Get student error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching student',
    });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Teacher
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('classId', 'teacherId');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Verify teacher owns the class
    if (student.classId.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Student updated successfully',
      student: updatedStudent,
    });
  } catch (error) {
    logger.error(`Update student error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error updating student',
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Teacher
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('classId', 'teacherId');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Verify teacher owns the class
    if (student.classId.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Soft delete
    student.isActive = false;
    await student.save();

    res.json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete student error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error deleting student',
    });
  }
};

// @desc    Verify student UID exists
// @route   POST /api/students/verify
// @access  Public (for student check-in)
exports.verifyStudent = async (req, res) => {
  try {
    const { uid, classId } = req.body;

    const student = await Student.findOne({ 
      uid: uid.toUpperCase(),
      classId,
      isActive: true,
    }).populate('classId', 'name subject');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found with this UID in this class',
      });
    }

    res.json({
      success: true,
      student: {
        name: student.name,
        uid: student.uid,
        className: student.classId.name,
      },
    });
  } catch (error) {
    logger.error(`Verify student error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error verifying student',
    });
  }
};
