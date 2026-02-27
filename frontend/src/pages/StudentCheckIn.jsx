import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { attendanceAPI } from '../services/api';

const StudentCheckIn = () => {
  const [uid, setUid] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [locationStatus, setLocationStatus] = useState('idle'); // idle, loading, granted, denied
  const [location, setLocation] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);

  // Get location on mount
  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    setLocationStatus('loading');
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus('granted');
      },
      (err) => {
        setLocationStatus('denied');
        setError('Location access denied. Please enable location services.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const verifyCode = async () => {
    if (!code || code.length < 6) return;
    
    try {
      setLoading(true);
      const response = await attendanceAPI.getSessionByCode(code);
      setSessionInfo(response.data.session);
    } catch (err) {
      setSessionInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code.length === 6) {
      verifyCode();
    } else {
      setSessionInfo(null);
    }
  }, [code]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (locationStatus !== 'granted' || !location) {
      setError('Location access is required for attendance');
      return;
    }

    setLoading(true);

    try {
      const response = await attendanceAPI.checkIn({
        uid: uid.toUpperCase(),
        code: code.toUpperCase(),
        latitude: location.latitude,
        longitude: location.longitude,
      });

      setResult({
        success: true,
        data: response.data,
      });
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message || 'Check-in failed',
        code: err.response?.data?.code,
      });
    } finally {
      setLoading(false);
    }
  };

  const getLocationIcon = () => {
    switch (locationStatus) {
      case 'loading':
        return '⏳';
      case 'granted':
        return '✅';
      case 'denied':
        return '❌';
      default:
        return '📍';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center">
            <span className="text-2xl">🎓</span>
            <span className="ml-2 text-lg font-bold text-gray-900">
              School Attendance
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Student Check-In
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Enter your UID and class code to mark attendance
            </p>

            {/* Location Status */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getLocationIcon()}</span>
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">
                    {locationStatus === 'loading'
                      ? 'Getting location...'
                      : locationStatus === 'granted'
                      ? 'Location verified'
                      : 'Location required'}
                  </p>
                </div>
              </div>
              {locationStatus === 'denied' && (
                <button
                  onClick={requestLocation}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Retry
                </button>
              )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result Message */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`mb-6 p-6 rounded-lg text-center ${
                    result.success
                      ? 'bg-green-50 border-2 border-green-200'
                      : 'bg-red-50 border-2 border-red-200'
                  }`}
                >
                  <div className="text-5xl mb-4">
                    {result.success ? '🎉' : '😔'}
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.success ? 'Attendance Marked!' : 'Check-In Failed'}
                  </h3>
                  <p className={result.success ? 'text-green-600' : 'text-red-600'}>
                    {result.success
                      ? `Status: ${result.data.attendance.status.toUpperCase()}`
                      : result.message}
                  </p>
                  {result.success && result.data.student && (
                    <p className="text-green-600 mt-2">
                      Welcome, {result.data.student.name}!
                    </p>
                  )}
                  <button
                    onClick={() => {
                      setResult(null);
                      setUid('');
                      setCode('');
                    }}
                    className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Check in another student
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            {!result && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="label">Your UID</label>
                  <input
                    type="text"
                    className="input text-center text-2xl font-mono uppercase"
                    placeholder="SCH2026-0001"
                    value={uid}
                    onChange={(e) => setUid(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                <div>
                  <label className="label">Class Code</label>
                  <input
                    type="text"
                    className="input text-center text-2xl font-mono uppercase tracking-widest"
                    placeholder="ABC123"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                  />
                  {sessionInfo && (
                    <p className="mt-2 text-sm text-green-600">
                      ✓ {sessionInfo.className} - {sessionInfo.subject || 'Class'}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || locationStatus !== 'granted'}
                  className="w-full btn btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Mark Attendance'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Having trouble? Contact your teacher for the class code.</p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500">
        <Link to="/login" className="hover:text-primary-600">
          Teacher Login
        </Link>
      </footer>
    </div>
  );
};

export default StudentCheckIn;
