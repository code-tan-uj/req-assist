'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon, BellIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';

interface NavbarProps {
  activeTab?: 'workspace' | 'projects';
}

export default function Navbar({ activeTab = 'workspace' }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [notificationCount] = useState(3);

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass-panel border-b"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Left Section - Logo & Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold gradient-text">Req-Assist</h1>
              <p className="text-xs opacity-70" style={{ color: 'var(--color-secondary-text)' }}>
                AI Research Platform
              </p>
            </div>
          </button>
        </div>

        {/* Center Section - Navigation Tabs */}
        <div className="flex items-center gap-2">
          {/* <button
            onClick={() => router.push('/home')}
            className="relative px-6 py-2 rounded-lg font-medium transition-all"
            style={{
              background: activeTab === 'workspace' ? 'var(--color-muted)' : 'transparent',
              color: 'var(--color-foreground)',
            }}
          >
            Workspace
            {activeTab === 'workspace' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 gradient-bg"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button> */}
          {/* <button
            onClick={() => router.push('/projects')}
            className="relative px-6 py-2 rounded-lg font-medium transition-all"
            style={{
              background: activeTab === 'projects' ? 'var(--color-muted)' : 'transparent',
              color: 'var(--color-foreground)',
            }}
          >
            Projects
            {activeTab === 'projects' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 gradient-bg"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button> */}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          {/* <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg transition-all"
            style={{
              background: 'var(--color-muted)',
              color: 'var(--color-foreground)',
            }}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <MoonIcon className="w-5 h-5" />
            ) : (
              <SunIcon className="w-5 h-5" />
            )}
          </motion.button> */}

          {/* Notification Bell */}
          <button
            className="relative p-2 rounded-lg transition-all"
            style={{
              background: 'var(--color-muted)',
              color: 'var(--color-foreground)',
            }}
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5" />
            {notificationCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-bg text-white text-xs flex items-center justify-center animate-pulse"
              >
                {notificationCount}
              </motion.span>
            )}
          </button>

          {/* User Avatar */}
          <div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold border-2"
            style={{ borderColor: 'var(--color-primary)' }}
          >
            A
          </div>

          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
            style={{
              background: 'transparent',
              color: 'var(--color-foreground)',
              border: '1px solid var(--color-border)',
            }}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="hidden md:inline">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
