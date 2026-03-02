import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';

// Card Components
export const Card = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 bg-gray-50 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);

// Input Component
export const Input = forwardRef(({ className = '', label, error, ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
    )}
    <input
      ref={ref}
      className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 ${
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
      } ${className}`}
      {...props}
    />
    {error && (
      <p className="mt-1 text-sm text-red-600">{error}</p>
    )}
  </div>
));
Input.displayName = 'Input';

// Textarea Component
export const Textarea = forwardRef(({ className = '', label, error, ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
    )}
    <textarea
      ref={ref}
      className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 resize-none ${
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
      } ${className}`}
      {...props}
    />
    {error && (
      <p className="mt-1 text-sm text-red-600">{error}</p>
    )}
  </div>
));
Textarea.displayName = 'Textarea';

// Button Component
export const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  disabled = false,
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:translate-y-[-1px] active:translate-y-[0px]',
    secondary: 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-200 hover:bg-primary-50',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30',
    outline: 'bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-2xl',
  };

  return (
    <motion.button
      ref={ref}
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </motion.button>
  );
});
Button.displayName = 'Button';

// Label Component
export const Label = ({ children, htmlFor, className = '', required = false }) => (
  <label 
    htmlFor={htmlFor} 
    className={`block text-sm font-medium text-gray-700 mb-1.5 ${className}`}
  >
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

// Select Component
export const Select = forwardRef(({ className = '', label, error, options = [], ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
    )}
    <div className="relative">
      <select
        ref={ref}
        className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 appearance-none cursor-pointer ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-600">{error}</p>
    )}
  </div>
));
Select.displayName = 'Select';

// Badge Component
export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Alert Component
export const Alert = ({ children, variant = 'info', title, className = '' }) => {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <div className={`rounded-xl border p-4 ${variants[variant]} ${className}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg">{icons[variant]}</span>
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loading Component
export const Skeleton = ({ className = '', count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
      />
    ))}
  </>
);

// Modal/Dialog Component
export const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden ${className}`}
      >
        {title && (
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
};

// Table Components
export const Table = ({ children, className = '' }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200">
    <table className={`w-full text-sm text-left text-gray-600 ${className}`}>
      {children}
    </table>
  </div>
);

export const TableHead = ({ children, className = '' }) => (
  <thead className={`bg-gray-50 text-gray-700 font-semibold ${className}`}>
    {children}
  </thead>
);

export const TableBody = ({ children, className = '' }) => (
  <tbody className={`divide-y divide-gray-200 ${className}`}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className = '' }) => (
  <tr className={`hover:bg-gray-50 transition-colors ${className}`}>
    {children}
  </tr>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 ${className}`}>
    {children}
  </td>
);

export const TableHeader = ({ children, className = '' }) => (
  <th className={`px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

// Tooltip Component
export const Tooltip = ({ children, content, position = 'top' }) => {
  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group inline-block">
      {children}
      <div className={`absolute ${positions[position]} px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50`}>
        {content}
        <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
          position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
          position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
          position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
          'right-full top-1/2 -translate-y-1/2 -mr-1'
        }`} />
      </div>
    </div>
  );
};

// Separator Component
export const Separator = ({ className = '' }) => (
  <div className={`h-px bg-gray-200 my-4 ${className}`} />
);

// Avatar Component
export const Avatar = ({ src, alt, fallback, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const [error, setError] = useState(false);

  if (src && !error) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold ${className}`}>
      {fallback || alt?.charAt(0).toUpperCase() || '?'}
    </div>
  );
};

// Switch/Toggle Component
export const Switch = ({ checked, onChange, className = '' }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
      checked ? 'bg-primary-600' : 'bg-gray-200'
    } ${className}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

// Checkbox Component
export const Checkbox = forwardRef(({ className = '', label, ...props }, ref) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      ref={ref}
      type="checkbox"
      className={`w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer ${className}`}
      {...props}
    />
    {label && <span className="text-sm text-gray-700">{label}</span>}
  </label>
));
Checkbox.displayName = 'Checkbox';

// Radio Component
export const Radio = forwardRef(({ className = '', label, ...props }, ref) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      ref={ref}
      type="radio"
      className={`w-4 h-4 border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer ${className}`}
      {...props}
    />
    {label && <span className="text-sm text-gray-700">{label}</span>}
  </label>
));
Radio.displayName = 'Radio';

// Progress Component
export const Progress = ({ value, max = 100, className = '', size = 'md' }) => {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]} ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
      />
    </div>
  );
};

// Export all components
export default {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Button,
  Label,
  Select,
  Badge,
  Alert,
  Skeleton,
  Modal,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
  Tooltip,
  Separator,
  Switch,
  Checkbox,
  Radio,
  Progress,
};