import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { attendanceAPI, classesAPI } from '../services/api';

const TeacherAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchAttendance();
    }
  }, [selectedClass, dateRange]);

  const fetchClasses = async () => {
    try {
      const response = await classesAPI.getAll();
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params = {
        classId: selectedClass,
        startDate: dateRange.start,
        endDate: dateRange.end,
      };
      const [attendanceRes, statsRes] = await Promise.all([
        attendanceAPI.getAttendance(params),
        attendanceAPI.getStats(selectedClass, params),
      ]);
      setAttendance(attendanceRes.data.records || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = {
        classId: selectedClass,
        startDate: dateRange.start,
        endDate: dateRange.end,
        format: 'csv',
      };
      const response = await attendanceAPI.exportAttendance(selectedClass, { params });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_${selectedClass}_${dateRange.start}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Failed to export attendance');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
        <p className="text-gray-600">View and manage attendance history</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Class</label>
            <select
              className="input"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select a class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Start Date</label>
            <input
              type="date"
              className="input"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          <div>
            <label className="label">End Date</label>
            <input
              type="date"
              className="input"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleExport}
              disabled={!selectedClass}
              className="btn btn-secondary w-full"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card bg-green-50 border-green-200">
            <p className="text-sm text-green-700">Present</p>
            <p className="text-2xl font-bold text-green-700">{stats.present || 0}</p>
          </div>
          <div className="card bg-yellow-50 border-yellow-200">
            <p className="text-sm text-yellow-700">Late</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.late || 0}</p>
          </div>
          <div className="card bg-red-50 border-red-200">
            <p className="text-sm text-red-700">Absent</p>
            <p className="text-2xl font-bold text-red-700">{stats.absent || 0}</p>
          </div>
          <div className="card bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-700">Rate</p>
            <p className="text-2xl font-bold text-blue-700">
              {stats.total > 0 ? (((stats.present + stats.late) / stats.total) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      {selectedClass && (
        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : attendance.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No attendance records found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Student</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">UID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendance.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {record.student?.name || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                        {record.student?.uid || 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default TeacherAttendance;
