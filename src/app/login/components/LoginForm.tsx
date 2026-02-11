'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Mock authentication - any email/password works
    setTimeout(() => {
      router.push('/home');
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-[450px]"
    >
      {/* Logo/Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold gradient-text mb-3">
          Req-Assist
        </h1>
        <p className="text-lg" style={{ color: 'var(--color-secondary-text)' }}>
          Sign in to your workspace
        </p>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass-panel rounded-3xl p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-foreground)' }}
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <EnvelopeIcon className="w-5 h-5" style={{ color: 'var(--color-secondary-text)' }} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className="w-full pl-12 pr-4 py-3 rounded-xl border transition-all focus-glow"
                style={{
                  background: 'var(--color-input)',
                  borderColor: errors.email ? 'var(--color-destructive)' : 'var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-sm mt-1" style={{ color: 'var(--color-destructive)' }}>
                  {errors.email}
                </p>
              </motion.div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-foreground)' }}
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockClosedIcon className="w-5 h-5" style={{ color: 'var(--color-secondary-text)' }} />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                className="w-full pl-12 pr-12 py-3 rounded-xl border transition-all focus-glow"
                style={{
                  background: 'var(--color-input)',
                  borderColor: errors.password ? 'var(--color-destructive)' : 'var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-secondary-text)' }}
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-sm mt-1" style={{ color: 'var(--color-destructive)' }}>
                  {errors.password}
                </p>
              </motion.div>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-secondary-text)' }}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-6 rounded-xl font-medium transition-all gradient-bg text-white btn-ripple disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        {/* Helper Text */}
        <div className="mt-6 text-center">
          <p className="text-xs" style={{ color: 'var(--color-secondary-text)' }}>
            Use any email and password to sign in
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
