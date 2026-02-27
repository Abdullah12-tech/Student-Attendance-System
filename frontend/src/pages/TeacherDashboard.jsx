import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { classesAPI, attendanceAPI } from '../services/api';

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [sessionCode, setSessionCode] = useState('');
  const [sessionLoading, setSessionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await classesAPI.getAll({ limit: 10 });
      setClasses(response.data.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async (classId) => {
    setSessionLoading(true);
    try {
      const response = await attendanceAPI.createSession({ classId });
      setSessionCode(response.data.session.code);
      fetchClasses(); // Refresh to get updated session info
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to start session');
    } finally {
      setSessionLoading(false);
    }
  };

  const handleEndSession = async (sessionId) => {
    try {
      await attendanceAPI.endSession(sessionId);
      fetchClasses();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to end session');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-600">Manage your classes and attendance</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Classes</p>
              <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">
                {classes.filter(c => c.activeSession).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {classes.reduce((sum, c) => sum + (c.studentCount || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Classes Section */}
      <motion.div variants={itemVariants}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Classes</h2>
          <button
            onClick={() => navigate('/teacher/classes')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View All →
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">No classes yet. Create your first class!</p>
            <button
              onClick={() => navigate('/teacher/classes')}
              className="btn btn-primary"
            >
              Create Class
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <motion.div
                key={classItem._id}
                variants={itemVariants}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{classItem.name}</h3>
                    <p className="text-sm text-gray-600">{classItem.subject || 'General'}</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                    {classItem.studentCount || 0} students
                  </span>
                </div>

                {classItem.activeSession ? (
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-green-700">Active Session</span>
                      <span className="text-xs text-green-600">
                        {classItem.activeSession.checkedInCount || 0} checked in
                      </span>
                    </div>
                    <div className="text-3xl font-mono font-bold text-green-700 text-center my-2">
                      {classItem.activeSession.code}
                    </div>
                    <button
                      onClick={() => handleEndSession(classItem.activeSession._id)}
                      className="w-full btn btn-secondary text-sm mt-2"
                    >
                      End Session
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartSession(classItem._id)}
                    disabled={sessionLoading}
                    className="w-full btn btn-primary"
                  >
                    Start Attendance
                  </button>
                )}

                <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                  <span className="text-gray-500">
                    📍 {classItem.allowedRadius}m radius
                  </span>
                  <button
                    onClick={() => navigate(`/teacher/classes/${classItem._id}`)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Details →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Session Code Modal */}
      <AnimatePresence>
        {showModal && sessionCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Session Started!
              </h3>
              <p className="text-gray-600 mb-6">
                Share this code with your students:
              </p>
              <div className="bg-primary-50 text-primary-700 text-4xl font-mono font-bold py-4 rounded-lg mb-6">
                {sessionCode}
              </div>
              <p className="text-sm text-gray-500 mb-4">
                This code will expire in 10 minutes
              </p>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSessionCode('');
                }}
                className="btn btn-primary w-full"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TeacherDashboard;
