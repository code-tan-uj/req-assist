'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Workspace } from '../page';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  workspace: Workspace | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  workspace,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!isConfirmed) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    onConfirm();
    setIsLoading(false);
    setIsConfirmed(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      setIsConfirmed(false);
      onClose();
    }
  };

  if (!workspace) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[400px] rounded-3xl p-8 relative"
              style={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {/* Warning Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center animate-shake"
                style={{ background: 'rgba(239, 68, 68, 0.1)' }}
              >
                <ExclamationTriangleIcon
                  className="w-8 h-8"
                  style={{ color: '#ef4444' }}
                />
              </motion.div>

              {/* Content */}
              <div className="text-center mb-6">
                <h2
                  className="text-2xl font-bold mb-3"
                  style={{ color: '#2D2D44' }}
                >
                  Delete {workspace.name}?
                </h2>
                <p
                  className="text-sm"
                  style={{ color: '#6B6B85' }}
                >
                  All {workspace.projectCount} {workspace.projectCount === 1 ? 'project' : 'projects'} and research
                  will be permanently deleted. This action cannot be undone.
                </p>
              </div>

              {/* Confirmation Checkbox */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={isConfirmed}
                      onChange={(e) => setIsConfirmed(e.target.checked)}
                      className="w-5 h-5 rounded border-2 cursor-pointer appearance-none transition-all"
                      style={{
                        borderColor: isConfirmed
                          ? '#ef4444'
                          : 'rgba(0, 0, 0, 0.2)',
                        background: isConfirmed ? '#ef4444' : 'transparent',
                      }}
                      disabled={isLoading}
                    />
                    {isConfirmed && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 w-5 h-5 text-white pointer-events-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    )}
                  </div>
                  <span
                    className="text-sm select-none"
                    style={{ color: '#2D2D44' }}
                  >
                    I understand this cannot be undone
                  </span>
                </label>
              </motion.div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 rounded-xl font-medium transition-all hover:bg-gray-100"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    color: '#2D2D44',
                  }}
                >
                  Cancel
                </button>

                <motion.button
                  onClick={handleConfirm}
                  disabled={!isConfirmed || isLoading}
                  whileHover={{
                    scale: isConfirmed && !isLoading ? 1.02 : 1,
                    boxShadow: isConfirmed && !isLoading ? '0 0 30px rgba(239, 68, 68, 0.4)' : 'none',
                  }}
                  whileTap={{ scale: isConfirmed && !isLoading ? 0.98 : 1 }}
                  className="flex-1 px-6 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-ripple"
                  style={{
                    background: isConfirmed
                      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      : 'rgba(239, 68, 68, 0.5)',
                  }}
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
                      Deleting...
                    </span>
                  ) : (
                    'Delete Workspace'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
