import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import StudentCheckIn from './pages/StudentCheckIn';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherClasses from './pages/TeacherClasses';
import TeacherAttendance from './pages/TeacherAttendance';
import TeacherStudents from './pages/TeacherStudents';
import AdminDashboard from './pages/AdminDashboard';
import AdminTeachers from './pages/AdminTeachers';
import AdminStats from './pages/AdminStats';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/checkin" element={<StudentCheckIn />} />

      {/* Protected Routes */}
      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<TeacherDashboard />} />
                <Route path="/classes" element={<TeacherClasses />} />
                <Route path="/attendance" element={<TeacherAttendance />} />
                <Route path="/students" element={<TeacherStudents />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/teachers" element={<AdminTeachers />} />
                <Route path="/stats" element={<AdminStats />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirect based on role */}
      {user && (
        <Route
          path="/dashboard"
          element={
            <Navigate
              to={user.role === 'admin' ? '/admin' : '/teacher'}
              replace
            />
          }
        />
      )}

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
