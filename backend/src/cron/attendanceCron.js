const cron = require('node-cron');
const Attendance = require('../models/Attendance');
const AttendanceSession = require('../models/AttendanceSession');
const Student = require('../models/Student');
const Class = require('../models/Class');
const logger = require('../utils/logger');

/**
 * Mark students as absent for sessions that have ended
 * This runs every 5 minutes to check for expired sessions
 */
const markAbsentStudents = async () => {
  try {
    logger.info('Running auto-absent marking job...');

    // Find all active sessions that have expired
    const expiredSessions = await AttendanceSession.find({
      active: true,
      expiresAt: { $lt: new Date() },
    });

    if (expiredSessions.length === 0) {
      logger.info('No expired sessions found');
      return;
    }

    logger.info(`Found ${expiredSessions.length} expired sessions`);

    for (const session of expiredSessions) {
      // Get all students in this class
      const students = await Student.find({
        classId: session.classId,
        isActive: true,
      });

      // Get students who already have attendance for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const attendedStudents = await Attendance.find({
        sessionId: session._id,
        date: { $gte: today, $lt: tomorrow },
      }).distinct('studentId');

      // Mark absent students
      const absentStudents = students.filter(
        s => !attendedStudents.includes(s._id.toString())
      );

      if (absentStudents.length > 0) {
        const absentRecords = absentStudents.map(student => ({
          studentId: student._id,
          classId: session.classId,
          sessionId: session._id,
          date: new Date(),
          status: 'absent',
          timestamp: new Date(),
          markedBy: 'system',
        }));

        await Attendance.insertMany(absentRecords);
        logger.info(`Marked ${absentRecords.length} students as absent for session ${session._id}`);
      }

      // Mark session as inactive
      session.active = false;
      session.endTime = new Date();
      await session.save();
    }

    logger.info('Auto-absent marking completed');
  } catch (error) {
    logger.error(`Auto-absent marking error: ${error.message}`);
  }
};

/**
 * Clean up old sessions
 * This runs daily at midnight
 */
const cleanupOldSessions = async () => {
  try {
    logger.info('Running session cleanup job...');

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await AttendanceSession.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
      active: false,
    });

    logger.info(`Cleaned up ${result.deletedCount} old sessions`);
  } catch (error) {
    logger.error(`Session cleanup error: ${error.message}`);
  }
};

const startCronJob = () => {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', markAbsentStudents);
  
  // Run daily at midnight
  cron.schedule('0 0 * * *', cleanupOldSessions);

  logger.info('Cron jobs scheduled: auto-absent (every 5 min), cleanup (daily midnight)');
};

module.exports = startCronJob;
