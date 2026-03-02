import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI, classesAPI } from '../services/api';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
        <p className="text-gray-600">Detailed attendance analytics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Teachers</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.teachers || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats?.classes || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats?.students || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats?.sessions || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Stats */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Attendance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-green-50 border-green-200">
            <p className="text-sm text-green-700">Present</p>
            <p className="text-3xl font-bold text-green-700">{stats?.today?.present || 0}</p>
          </div>
          <div className="card bg-yellow-50 border-yellow-200">
            <p className="text-sm text-yellow-700">Late</p>
            <p className="text-3xl font-bold text-yellow-700">{stats?.today?.late || 0}</p>
          </div>
          <div className="card bg-red-50 border-red-200">
            <p className="text-sm text-red-700">Absent</p>
            <p className="text-3xl font-bold text-red-700">{stats?.today?.absent || 0}</p>
          </div>
          <div className="card bg-primary-50 border-primary-200">
            <p className="text-sm text-primary-700">Attendance Rate</p>
            <p className="text-3xl font-bold text-primary-700">
              {stats?.today?.attendanceRate || 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Trend</h2>
        <div className="card overflow-hidden">
          {stats?.weeklyTrend?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Present</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Late</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Absent</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.weeklyTrend.map((day) => (
                    <tr key={day._id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{day._id}</td>
                      <td className="px-4 py-3 text-sm text-green-600">{day.present}</td>
                      <td className="px-4 py-3 text-sm text-yellow-600">{day.late}</td>
                      <td className="px-4 py-3 text-sm text-red-600">{day.absent}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{day.total}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {day.total > 0
                          ? (((day.present + day.late) / day.total) * 100).toFixed(1)
                          : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">No data available</div>
          )}
        </div>
      </div>

      {/* Class Performance */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Class Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats?.classStats?.map((classStat) => (
            <div key={classStat._id} className="card">
              <h3 className="font-semibold text-gray-900 mb-2">{classStat.name}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium">{classStat.studentCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sessions:</span>
                  <span className="font-medium">{classStat.sessionCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Rate:</span>
                  <span className="font-medium text-green-600">{classStat.attendanceRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminStats;
