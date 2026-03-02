import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

// ─── Animated Counter Component ───────────────────────────────────────────────
const AnimatedCounter = ({ target, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// ─── Floating Particle Component ──────────────────────────────────────────────
const FloatingParticle = ({ delay, size, x, y, color }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      top: `${y}%`,
      background: color,
      filter: 'blur(1px)',
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      opacity: [0.3, 0.7, 0.3],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 4 + Math.random() * 3,
      repeat: Infinity,
      delay,
      ease: 'easeInOut',
    }}
  />
);

// ─── Glowing Orb Background ──────────────────────────────────────────────────
const GlowingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
        top: '-10%',
        right: '-10%',
      }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute w-[500px] h-[500px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        bottom: '-5%',
        left: '-5%',
      }}
      animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute w-[400px] h-[400px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
        top: '40%',
        left: '30%',
      }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
    />
  </div>
);

// ─── Animated Grid Background ─────────────────────────────────────────────────
const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(14,165,233,1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(14,165,233,1) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  </div>
);

// ─── Feature Card with Hover Effects ──────────────────────────────────────────
const FeatureCard = ({ icon, title, description, index, gradient }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
        style={{ background: gradient }}
      />
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-transparent transition-all duration-500 h-full">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
          style={{ background: gradient }}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
          style={{ background: gradient }}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

// ─── Step Card ────────────────────────────────────────────────────────────────
const StepCard = ({ step, title, description, icon, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
    >
      <div className="flex items-start gap-6">
        <motion.div
          className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25"
          whileHover={{ rotate: 5, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <span className="text-white text-2xl font-bold">{step}</span>
        </motion.div>
        <div className="flex-1 pt-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{icon}</span>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Testimonial Card ─────────────────────────────────────────────────────────
const TestimonialCard = ({ quote, name, role, avatar, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500"
    >
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.15 + i * 0.05 }}
            className="text-yellow-400 text-lg"
          >
            ★
          </motion.span>
        ))}
      </div>
      <p className="text-gray-700 leading-relaxed mb-6 italic">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
          {avatar}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Marquee Logos ────────────────────────────────────────────────────────────
const TrustBadges = () => {
  const badges = [
    '🏫 500+ Schools', '👨‍🎓 100K+ Students', '🌍 30+ Countries',
    '⭐ 4.9 Rating', '🔒 SOC2 Certified', '📱 Mobile First',
    '🏫 500+ Schools', '👨‍🎓 100K+ Students', '🌍 30+ Countries',
    '⭐ 4.9 Rating', '🔒 SOC2 Certified', '📱 Mobile First',
  ];

  return (
    <div className="relative overflow-hidden py-4">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {badges.map((badge, i) => (
          <span key={i} className="text-gray-400 font-medium text-sm tracking-wide flex-shrink-0">
            {badge}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const features = [
  {
    icon: '📍',
    title: 'GPS Geofencing',
    description: 'Verify student presence with precision GPS coordinates. Set custom radius boundaries for each classroom.',
    gradient: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(56,189,248,0.15))',
  },
  {
    icon: '🔐',
    title: 'Unique ID Verification',
    description: 'Every student gets a tamper-proof unique identifier. No more buddy punching or proxy attendance.',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(167,139,250,0.15))',
  },
  {
    icon: '⚡',
    title: 'Auto-Absent Marking',
    description: 'Smart automation marks students absent when sessions expire. Zero manual intervention needed.',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,191,36,0.15))',
  },
  {
    icon: '📊',
    title: 'Live Analytics',
    description: 'Real-time dashboards with attendance trends, exportable reports, and predictive insights.',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(52,211,153,0.15))',
  },
  {
    icon: '🛡️',
    title: 'Enterprise Security',
    description: 'JWT authentication, encrypted data at rest, rate limiting, and comprehensive audit logs.',
    gradient: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(248,113,113,0.15))',
  },
  {
    icon: '📱',
    title: 'Works Everywhere',
    description: 'Responsive design that works flawlessly on phones, tablets, and desktops. No app install needed.',
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(244,114,182,0.15))',
  },
];

const steps = [
  {
    step: '1',
    icon: '🎯',
    title: 'Teacher Creates Session',
    description: 'With one click, generate a unique 6-character attendance code. Set the geofence radius and session duration.',
  },
  {
    step: '2',
    icon: '📲',
    title: 'Students Check In',
    description: 'Students enter their UID and the session code on any device. GPS location is automatically verified.',
  },
  {
    step: '3',
    icon: '✅',
    title: 'Instant Verification',
    description: 'The system validates identity, location, and timing in milliseconds. Attendance is recorded with full audit trail.',
  },
  {
    step: '4',
    icon: '📈',
    title: 'Analyze & Export',
    description: 'View real-time attendance data, generate reports, track trends, and export to CSV for further analysis.',
  },
];

const testimonials = [
  {
    quote: 'This system eliminated proxy attendance completely. Our attendance accuracy went from 70% to 99.5% in the first month.',
    name: 'Dr. Sarah Chen',
    role: 'Principal, Westfield Academy',
    avatar: 'SC',
  },
  {
    quote: 'The geolocation feature is a game-changer. Students can only check in when they\'re actually in the classroom.',
    name: 'Prof. James Okafor',
    role: 'Head of CS, Lagos University',
    avatar: 'JO',
  },
  {
    quote: 'Setting up took 10 minutes. The interface is so intuitive that even our least tech-savvy teachers love it.',
    name: 'Maria Rodriguez',
    role: 'IT Director, Springfield Schools',
    avatar: 'MR',
  },
];

const stats = [
  { value: 500, suffix: '+', label: 'Schools Trust Us' },
  { value: 100, suffix: 'K+', label: 'Students Tracked' },
  { value: 99, suffix: '.5%', label: 'Accuracy Rate' },
  { value: 2, suffix: 'M+', label: 'Check-ins Daily' },
];

// ─── Main Landing Component ──────────────────────────────────────────────────
const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const particles = Array.from({ length: 20 }, (_, i) => ({
    delay: i * 0.3,
    size: 4 + Math.random() * 6,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: ['rgba(14,165,233,0.4)', 'rgba(139,92,246,0.3)', 'rgba(16,185,129,0.3)'][i % 3],
  }));

  return (
    <>
      <SEO
        title="AttendX - Smart Attendance System with GPS Geofencing"
        description="Eliminate proxy attendance with GPS geofencing, unique student IDs, and real-time analytics. Trusted by 500+ schools worldwide."
        keywords="attendance system, school management, GPS geofencing, student tracking, education technology, classroom management"
      />
    <div className="min-h-screen bg-[#fafbff] overflow-x-hidden">
      {/* ─── Navigation ─────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-gray-900/5 border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <span className="text-white text-xl">🎓</span>
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                AttendX
              </span>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group">
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group">
                Reviews
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
              </a>
              <Link
                to="/checkin"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Student Check-In
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2.5 text-gray-700 font-semibold hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300"
                >
                  Get Started Free
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <motion.div animate={mobileMenuOpen ? { rotate: 90 } : { rotate: 0 }}>
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 font-medium py-2">Features</a>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 font-medium py-2">How It Works</a>
                <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 font-medium py-2">Reviews</a>
                <Link to="/checkin" className="block text-gray-700 font-medium py-2">Student Check-In</Link>
                <hr className="border-gray-100" />
                <Link to="/login" className="block text-center py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl">
                  Get Started Free
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ─── Hero Section ───────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <GlowingOrbs />
        <GridBackground />
        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32"
        >
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-8"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-primary-500"
              />
              <span className="text-sm font-semibold text-primary-700">
                Trusted by 500+ schools worldwide
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8"
            >
              <span className="text-gray-900">Attendance</span>
              <br />
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-blue-400 bg-clip-text text-transparent">
                Reimagined
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl sm:text-2xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
            >
              Eliminate proxy attendance with{' '}
              <span className="text-gray-700 font-medium">GPS geofencing</span>,{' '}
              <span className="text-gray-700 font-medium">unique student IDs</span>, and{' '}
              <span className="text-gray-700 font-medium">real-time analytics</span>.
              The modern solution schools deserve.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300"
                >
                  Start Free Trial
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-bold text-lg rounded-2xl border-2 border-gray-200 hover:border-primary-200 hover:bg-primary-50 transition-all duration-300"
                >
                  <span className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </span>
                  See How It Works
                </a>
              </motion.div>
            </motion.div>

            {/* Hero Visual - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-20 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#fafbff] via-transparent to-transparent z-10 pointer-events-none" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/10 border border-gray-200/50 bg-white">
                {/* Mock Dashboard */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-4 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="inline-block bg-white/20 rounded-lg px-4 py-1 text-white/80 text-sm font-medium">
                      dashboard.attendx.io
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8 bg-gray-50">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Present', value: '847', color: 'bg-green-500', bg: 'bg-green-50' },
                      { label: 'Late', value: '23', color: 'bg-yellow-500', bg: 'bg-yellow-50' },
                      { label: 'Absent', value: '12', color: 'bg-red-500', bg: 'bg-red-50' },
                      { label: 'Rate', value: '98.6%', color: 'bg-primary-500', bg: 'bg-primary-50' },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.3 + i * 0.1 }}
                        className={`${stat.bg} rounded-xl p-4 text-center`}
                      >
                        <div className={`w-2 h-2 rounded-full ${stat.color} mx-auto mb-2`} />
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>
                  {/* Mini chart bars */}
                  <div className="flex items-end gap-2 h-24 px-4">
                    {[65, 80, 45, 90, 70, 85, 95, 60, 88, 75, 92, 78].map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-md"
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 1.5 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ─── Trust Bar ──────────────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBadges />
        </div>
      </section>

      {/* ─── Problem Section ────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-semibold mb-4">
              The Problem
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Traditional Attendance is{' '}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Broken</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Schools lose thousands of hours and millions in funding due to inaccurate attendance tracking
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '👤', problem: 'Proxy Attendance', stat: '35%', desc: 'of students admit to proxy attendance' },
              { icon: '❌', problem: 'Manual Errors', stat: '12%', desc: 'average error rate in paper registers' },
              { icon: '⏰', problem: 'Time Wasted', stat: '15min', desc: 'per class spent on roll call' },
              { icon: '📍', problem: 'No Verification', stat: '0%', desc: 'location proof with traditional methods' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 text-center group hover:shadow-xl transition-all duration-500"
              >
                <motion.div
                  className="text-5xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.problem}</h3>
                <p className="text-3xl font-extrabold text-red-500 mb-2">{item.stat}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Section ───────────────────────────────────────────── */}
      <section id="features" className="py-24 sm:py-32 relative">
        <GlowingOrbs />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent">
                Modernize Attendance
              </span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              A comprehensive platform that addresses every attendance challenge with elegant solutions
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Section ──────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-900 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-gray-400 font-medium text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-sm font-semibold mb-4">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Simple as{' '}
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                1-2-3-4
              </span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Get up and running in minutes, not days
            </p>
          </motion.div>

          <div className="space-y-12 relative">
            {/* Connecting Line */}
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-primary-200 via-primary-400 to-primary-200 hidden sm:block" />
            {steps.map((step, index) => (
              <StepCard key={index} {...step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ───────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 sm:py-32 relative">
        <GlowingOrbs />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-50 text-yellow-600 text-sm font-semibold mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Loved by{' '}
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Educators
              </span>{' '}
              Worldwide
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-blue-800" />
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
              backgroundSize: '30px 30px',
            }}
          />
        </div>
        {/* Floating shapes */}
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/5"
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white/5"
          animate={{ y: [0, 20, 0], rotate: [360, 180, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-24 h-24 rounded-2xl bg-white/5 rotate-45"
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-8"
            >
              🚀
            </motion.div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
              Ready to Transform Your
              <br />
              Attendance System?
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Join 500+ schools already using AttendX to track attendance with 99.5% accuracy.
              Set up in under 10 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary-700 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Start Free Trial
                  <span>→</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/checkin"
                  className="inline-flex items-center gap-2 px-10 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-2xl border-2 border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Try Student Check-In
                </Link>
              </motion.div>
            </div>
            <p className="mt-6 text-primary-200 text-sm">
              No credit card required • Free for up to 50 students • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-gray-400 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <span className="text-white text-xl">🎓</span>
                </div>
                <span className="text-xl font-extrabold text-white">AttendX</span>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                Modern attendance management with GPS geofencing, real-time analytics, and enterprise-grade security.
              </p>
              <div className="flex gap-4">
                {['𝕏', 'in', 'f'].map((social, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ y: -3 }}
                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors font-bold text-sm"
                  >
                    {social}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><Link to="/checkin" className="hover:text-white transition-colors">Student Check-In</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Teacher Portal</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status Page</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="mailto:support@attendx.io" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; 2026 AttendX. All rights reserved.</p>
            <p className="text-sm text-gray-600">
              Built with ❤️ for educators worldwide
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Landing;
