'use client';
import { useState, FormEvent, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (workspace: {
    name: string;
    description: string;
    projectCount: number;
    tags: string[];
  }) => void;
}

export default function CreateWorkspaceModal({
  isOpen,
  onClose,
  onCreate,
}: CreateWorkspaceModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    onCreate({
      name: name.trim(),
      description: description.trim(),
      projectCount: 0,
      tags,
    });

    // Reset form
    setName('');
    setDescription('');
    setTags([]);
    setTagInput('');
    setIsLoading(false);
  };

  const handleAddTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() && tags.length < 5) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleClose = () => {
    if (!isLoading) {
      setName('');
      setDescription('');
      setTags([]);
      setTagInput('');
      onClose();
    }
  };

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
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[480px] rounded-3xl p-10 relative"
              style={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {/* Close Button */}
              <motion.button
                onClick={handleClose}
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-6 right-6 p-2 rounded-lg transition-all"
                style={{ background: 'rgba(0, 0, 0, 0.05)' }}
                disabled={isLoading}
              >
                <XMarkIcon className="w-5 h-5" style={{ color: '#2D2D44' }} />
              </motion.button>

              {/* Header */}
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D2D44' }}>
                Create New Workspace
              </h2>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Workspace Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                    style={{ color: '#2D2D44' }}
                  >
                    Workspace Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value.slice(0, 50))}
                      placeholder="Enter workspace name"
                      className="w-full h-14 px-4 rounded-xl border transition-all focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        color: '#2D2D44',
                      }}
                      required
                    />
                    <span
                      className="absolute right-3 bottom-3 text-xs"
                      style={{ color: '#6B6B85' }}
                    >
                      {name.length}/50
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-2"
                    style={{ color: '#2D2D44' }}
                  >
                    Description <span className="text-xs" style={{ color: '#6B6B85' }}>(optional)</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                      placeholder="What will you research in this workspace?"
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        color: '#2D2D44',
                      }}
                    />
                    <span
                      className="absolute right-3 bottom-3 text-xs"
                      style={{ color: '#6B6B85' }}
                    >
                      {description.length}/200
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium mb-2"
                    style={{ color: '#2D2D44' }}
                  >
                    Tags <span className="text-xs" style={{ color: '#6B6B85' }}>(optional, max 5)</span>
                  </label>

                  {/* Tag Display */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      <AnimatePresence>
                        {tags.map((tag) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                            style={{
                              background: 'rgba(157, 124, 196, 0.15)',
                              color: '#2D2D44',
                            }}
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:opacity-70 transition-opacity"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Tag Input */}
                  {tags.length < 5 && (
                    <input
                      id="tags"
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Type and press Enter to add tags"
                      className="w-full h-14 px-4 rounded-xl border transition-all focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        color: '#2D2D44',
                      }}
                    />
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
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
                    type="submit"
                    disabled={!name.trim() || isLoading}
                    whileHover={{ scale: name.trim() && !isLoading ? 1.02 : 1 }}
                    whileTap={{ scale: name.trim() && !isLoading ? 0.98 : 1 }}
                    className="flex-1 px-6 py-3 rounded-xl font-medium text-white gradient-bg disabled:opacity-50 disabled:cursor-not-allowed"
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
                        Creating...
                      </span>
                    ) : (
                      'Create Workspace'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
