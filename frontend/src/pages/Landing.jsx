import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: '📍',
    title: 'Geolocation Security',
    description: 'Verify student attendance with GPS coordinates to prevent proxy attendance',
  },
  {
    icon: '🔐',
    title: 'UID Verification',
    description: 'Unique student IDs ensure accurate identification and prevent impersonation',
  },
  {
    icon: '⏰',
    title: 'Auto-Absent Marking',
    description: 'System automatically marks students absent when they miss attendance sessions',
  },
  {
    icon: '📊',
    title: 'Real-time Analytics',
    description: 'Track attendance trends with detailed reports and exportable data',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    description: 'Enterprise-grade security with JWT authentication and encrypted data',
  },
  {
    icon: '📱',
    title: 'Mobile Ready',
    description: 'Works seamlessly on any device with responsive design',
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl">🎓</span>
              <span className="ml-2 text-xl font-bold text-gray-900">
                School Attendance
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/checkin"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Student Check-In
              </Link>
              <Link
                to="/login"
                className="btn btn-primary"
              >
                Teacher Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Smart Attendance
              <span className="block text-primary-600">System</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Eliminate proxy attendance with geolocation verification, unique student
              IDs, and real-time tracking. The modern solution for schools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="btn btn-primary text-lg px-8 py-3">
                Get Started
              </Link>
              <a href="#features" className="btn btn-secondary text-lg px-8 py-3">
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Traditional Attendance Problems
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Schools face significant challenges with manual attendance tracking
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '👤', problem: 'Proxy Attendance', solution: 'Friends marking for friends' },
              { icon: '❌', problem: 'No Verification', solution: 'Manual registers prone to errors' },
              { icon: '📝', problem: 'Time-Consuming', solution: 'Manual data entry and calculation' },
              { icon: '📍', problem: 'No Location Proof', solution: 'No attendance verification' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.problem}</h3>
                <p className="text-sm text-gray-600">{item.solution}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How We Solve It
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A comprehensive system that addresses all attendance challenges
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Teacher Starts Session',
                description: 'Teacher generates a temporary attendance code for their class',
              },
              {
                step: '2',
                title: 'Student Checks In',
                description: 'Student enters their UID and class code with location verification',
              },
              {
                step: '3',
                title: 'System Records',
                description: 'Attendance is marked with timestamp, location, and IP address',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Attendance System?
            </h2>
            <p className="text-primary-100 text-lg mb-8">
              Join schools already using our platform to track attendance accurately
            </p>
            <Link
              to="/login"
              className="inline-block bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Request Demo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-2xl">🎓</span>
                <span className="ml-2 text-white font-bold">School Attendance</span>
              </div>
              <p className="text-sm">
                Modern attendance management system with geolocation security.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/checkin" className="hover:text-white">Student Check-In</Link></li>
                <li><Link to="/login" className="hover:text-white">Teacher Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li>Geolocation Security</li>
                <li>Real-time Tracking</li>
                <li>Analytics Dashboard</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-sm">support@schoolattendance.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; 2026 School Attendance System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
