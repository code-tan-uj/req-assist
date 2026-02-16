'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RedirectingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  destination?: string;
}

export default function RedirectingModal({
  isOpen,
  onComplete,
  destination = 'Req-Ease',
}: RedirectingModalProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing...');

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setStatusText('Initializing...');
      return;
    }

    const statusMessages = [
      'Initializing...',
      'Connecting to services...',
      'Preparing workspace...',
      'Loading resources...',
      'Almost there...',
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
      setProgress(Math.min(currentProgress, 100));
      
      // Update status text based on progress
      const statusIndex = Math.min(
        Math.floor(currentProgress / 25),
        statusMessages.length - 1
      );
      setStatusText(statusMessages[statusIndex]);
    }, 400);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm rounded-2xl p-8 text-center"
          style={{
            backgroundColor: '#ffffff',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Animated Logo/Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #9d7cc4 0%, #c4a0e8 50%, #e8c4f0 100%)',
              }}
            >
              <motion.svg
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </motion.svg>
            </motion.div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Redirecting to {destination}
          </h2>

          {/* Status Text */}
          <motion.p
            key={statusText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gray-500 mb-6"
          >
            {statusText}
          </motion.p>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #9d7cc4 0%, #c4a0e8 50%, #e8c4f0 100%)',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>

          {/* Progress Percentage */}
          <p className="text-sm font-medium text-gray-600">
            {Math.round(progress)}%
          </p>

          {/* Animated Dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#9d7cc4' }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
