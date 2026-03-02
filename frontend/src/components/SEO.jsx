import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title = 'AttendX - Smart Attendance System',
  description = 'Eliminate proxy attendance with GPS geofencing, unique student IDs, and real-time analytics. Trusted by 500+ schools worldwide.',
  keywords = 'attendance system, school management, GPS geofencing, student tracking, education technology',
  image = '/og-image.jpg',
  type = 'website',
  noindex = false,
  canonical,
  children 
}) => {
  const location = useLocation();
  const currentUrl = `https://attendx.io${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tag
    const updateMetaTag = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Standard Meta Tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Robots
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }

    // Open Graph
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', canonicalUrl, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:site_name', 'AttendX', true);
    updateMetaTag('og:locale', 'en_US', true);

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Cleanup function
    return () => {
      // Optional: cleanup meta tags on unmount
    };
  }, [title, description, keywords, image, type, canonicalUrl, noindex]);

  // Schema.org structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'website' ? 'WebSite' : 'WebPage',
    name: title,
    description: description,
    url: canonicalUrl,
    ...(type === 'website' && {
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://attendx.io/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    })
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      {children}
    </>
  );
};

// Predefined SEO configurations for common pages
export const LandingSEO = () => (
  <SEO
    title="AttendX - Smart Attendance System with GPS Geofencing"
    description="Eliminate proxy attendance with GPS geofencing, unique student IDs, and real-time analytics. Trusted by 500+ schools worldwide."
    keywords="attendance system, school management, GPS geofencing, student tracking, education technology, classroom management"
  />
);

export const LoginSEO = () => (
  <SEO
    title="Sign In - AttendX Teacher Portal"
    description="Sign in to your AttendX teacher account to manage attendance, create sessions, and view analytics."
    noindex={true}
  />
);

export const SignupSEO = () => (
  <SEO
    title="Create Account - Join AttendX"
    description="Create your free AttendX teacher account and start tracking attendance with GPS precision."
    noindex={true}
  />
);

export const TeacherDashboardSEO = () => (
  <SEO
    title="Teacher Dashboard - AttendX"
    description="Manage your classes, track attendance, and view real-time analytics."
    noindex={true}
  />
);

export const AdminDashboardSEO = () => (
  <SEO
    title="Admin Dashboard - AttendX"
    description="System overview and management dashboard for AttendX administrators."
    noindex={true}
  />
);

export default SEO;