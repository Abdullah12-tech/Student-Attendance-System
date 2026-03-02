import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { teacherAPI } from '../services/api';

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    attendanceRate: 0,
    recentAttendance: [],
    classPerformance: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, attendanceRes, performanceRes] = await Promise.all([
          teacherAPI.getDashboardStats(),
          teacherAPI.getRecentAttendance(),
          teacherAPI.getClassPerformance()
        ]);

        setStats({
          totalClasses: statsRes.totalClasses,
          totalStudents: statsRes.totalStudents,
          attendanceRate: statsRes.attendanceRate,
          recentAttendance: attendanceRes.data,
          classPerformance: performanceRes.data
        });
      } catch (error) {
        console.error('Failed to fetch teacher dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const attendanceData = [
    { name: 'Mon', present: 24, absent: 1 },
    { name: 'Tue', present: 23, absent: 2 },
    { name: 'Wed', present: 25, absent: 0 },
    { name: 'Thu', present: 22, absent: 3 },
    { name: 'Fri', present: 24, absent: 1 }
  ];

  const performanceData = [
    { name: 'Math', score: 85 },
    { name: 'Science', score: 92 },
    { name: 'English', score: 78 },
    { name: 'History', score: 88 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-sky-900 mb-8">Teacher Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sky-600">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-sky-900">{stats.totalClasses}</p>
            <p className="text-green-600">+2 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sky-600">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-sky-900">{stats.totalStudents}</p>
            <p className="text-green-600">+5 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sky-600">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-sky-900">{stats.attendanceRate}%</p>
            <p className="text-green-600">+3% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#10b981" name="Present" />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Class Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.classPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="averageScore" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
