import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Input, Button, Alert, Label } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/teacher');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Sign In - AttendX Teacher Portal"
        description="Sign in to your AttendX teacher account to manage attendance, create sessions, and view analytics."
        noindex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0">
            <div className="p-8">
              {/* Logo */}
              <div className="text-center mb-8">
                <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">🎓</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">AttendX</span>
                </Link>
                <h1 className="text-xl text-gray-600">Teacher Portal</h1>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <Alert variant="error">
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="teacher@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label>Password</Label>
                    <Link to="/forgot-password" className="text-xs text-sky-600 hover:text-sky-700">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  className="w-full"
                >
                  Sign In
                </Button>

                <div className="text-center text-sm pt-4 border-t border-gray-100">
                  <span className="text-gray-500">Don't have an account? </span>
                  <Link to="/signup" className="font-semibold text-sky-600 hover:text-sky-700 transition-colors">
                    Create account
                  </Link>
                </div>
              </form>
            </div>
          </Card>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-gray-400 mb-3">Secure, encrypted connection</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-lg" title="256-bit SSL">🔒</span>
              <span className="text-lg" title="GDPR Compliant">🛡️</span>
              <span className="text-lg" title="SOC 2 Certified">✓</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
