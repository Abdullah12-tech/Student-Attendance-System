import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Input, Button, Label, Alert } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    school: '',
    role: 'teacher'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signup(formData);
      navigate('/teacher');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <>
      <SEO
        title="Create Account - Join AttendX"
        description="Create your free AttendX teacher account and start tracking attendance with GPS precision."
        noindex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="shadow-2xl border-0">
            <div className="p-8">
              {/* Logo */}
              <div className="text-center mb-8">
                <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">🎓</span>
                  </div>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-500">Join AttendX and transform your classroom management</p>
              </div>

              {error && (
                <Alert variant="error" className="mb-6">
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="name"
                    label="Full Name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Smith"
                  />
                  <Input
                    id="school"
                    label="School Name"
                    type="text"
                    value={formData.school}
                    onChange={handleChange}
                    required
                    placeholder="Example High School"
                  />
                </div>

                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="teacher@example.com"
                />

                <div>
                  <Input
                    id="password"
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    placeholder="••••••••"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 8 characters long
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  className="w-full"
                >
                  Create Account
                </Button>

                <div className="text-center text-sm pt-4 border-t border-gray-100">
                  <span className="text-gray-500">Already have an account? </span>
                  <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700 transition-colors">
                    Sign in
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
            <p className="text-xs text-gray-400 mb-3">Trusted by 500+ schools worldwide</p>
            <div className="flex items-center justify-center gap-6 text-gray-300">
              <span className="text-2xl" title="Secure">🔒</span>
              <span className="text-2xl" title="GDPR Compliant">🛡️</span>
              <span className="text-2xl" title="24/7 Support">🌐</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}