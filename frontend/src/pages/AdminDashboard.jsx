import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and statistics</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : stats ? (
        <>
          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👨‍🏫</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Teachers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.teachers}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.classes}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.students}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.sessions}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Today's Stats */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Attendance</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card bg-green-50 border-green-200">
                <p className="text-sm text-green-700">Present</p>
                <p className="text-3xl font-bold text-green-700">{stats.today.present}</p>
              </div>
              <div className="card bg-yellow-50 border-yellow-200">
                <p className="text-sm text-yellow-700">Late</p>
                <p className="text-3xl font-bold text-yellow-700">{stats.today.late}</p>
              </div>
              <div className="card bg-red-50 border-red-200">
                <p className="text-sm text-red-700">Absent</p>
                <p className="text-3xl font-bold text-red-700">{stats.today.absent}</p>
              </div>
              <div className="card bg-primary-50 border-primary-200">
                <p className="text-sm text-primary-700">Attendance Rate</p>
                <p className="text-3xl font-bold text-primary-700">{stats.today.attendanceRate}%</p>
              </div>
            </div>
          </motion.div>

          {/* Weekly Trend */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Trend</h2>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Present</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Late</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.weeklyTrend?.map((day) => (
                      <tr key={day._id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{day._id}</td>
                        <td className="px-4 py-3 text-sm text-green-600">{day.present}</td>
                        <td className="px-4 py-3 text-sm text-yellow-600">{day.late}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{day.total}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {day.total > 0
                            ? (((day.present + day.late) / day.total) * 100).toFixed(1)
                            : 0}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600">Unable to load statistics</p>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
