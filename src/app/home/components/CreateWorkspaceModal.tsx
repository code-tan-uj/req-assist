'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: {
    name: string;
    description: string;
    collaborators: string[];
    tags: string[];
  }) => void;
}

const MOCK_USERS = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'];

export default function CreateWorkspaceModal({
  isOpen,
  onClose,
  onCreate,
}: CreateWorkspaceModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isValid = name.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    onCreate({ name: name.trim(), description: description.trim(), collaborators, tags });

    // Reset
    setName('');
    setDescription('');
    setCollaborators([]);
    setTags([]);
    setTagInput('');
    setIsLoading(false);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() && tags.length < 5) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const toggleCollaborator = (user: string) =>
    setCollaborators((prev) =>
      prev.includes(user) ? prev.filter((c) => c !== user) : [...prev, user]
    );

  const handleClose = () => {
    if (isLoading) return;
    setName('');
    setDescription('');
    setCollaborators([]);
    setTags([]);
    setTagInput('');
    onClose();
  };

  const fieldStyle = {
    background: 'rgba(255,255,255,0.8)',
    borderColor: 'rgba(0,0,0,0.1)',
    color: '#2D2D44',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[480px] rounded-3xl p-8 relative overflow-y-auto"
              style={{
                background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                maxHeight: '90vh',
              }}
            >
              {/* Close */}
              <motion.button
                onClick={handleClose}
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-6 right-6 p-2 rounded-lg"
                style={{ background: 'rgba(0,0,0,0.05)' }}
                disabled={isLoading}
              >
                <XMarkIcon className="w-5 h-5" style={{ color: '#2D2D44' }} />
              </motion.button>

              {/* Header */}
              <h2 className="text-2xl font-bold mb-1" style={{ color: '#2D2D44' }}>
                Create New Workspace
              </h2>
              <p className="text-sm mb-6" style={{ color: '#6B6B85' }}>
                Set up your workspace and start researching.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Workspace Name */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#2D2D44' }}>
                    Workspace Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value.slice(0, 60))}
                      placeholder="e.g. Market Analysis Q1 2026"
                      className="w-full h-12 px-4 rounded-xl border transition-all focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                      style={fieldStyle}
                      required
                    />
                    <span className="absolute right-3 bottom-2.5 text-xs" style={{ color: '#6B6B85' }}>
                      {name.length}/60
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#2D2D44' }}>
                    Description{' '}
                    <span className="text-xs font-normal" style={{ color: '#6B6B85' }}>(optional)</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                      placeholder="What will you research in this project?"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none outline-none"
                      style={fieldStyle}
                    />
                    <span className="absolute right-3 bottom-2.5 text-xs" style={{ color: '#6B6B85' }}>
                      {description.length}/200
                    </span>
                  </div>
                </div>

                {/* Collaborators */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#2D2D44' }}>
                    Collaborators{' '}
                    <span className="text-xs font-normal" style={{ color: '#6B6B85' }}>(optional)</span>
                  </label>
                  <div className="rounded-xl border px-3 py-2 space-y-1" style={fieldStyle}>
                    {MOCK_USERS.map((user) => (
                      <label
                        key={user}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={collaborators.includes(user)}
                          onChange={() => toggleCollaborator(user)}
                          className="w-4 h-4 rounded accent-purple-600"
                        />
                        <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {user[0]}
                        </div>
                        <span className="text-sm" style={{ color: '#2D2D44' }}>{user}</span>
                      </label>
                    ))}
                  </div>
                  {collaborators.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {collaborators.map((c) => (
                        <span
                          key={c}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm"
                          style={{ background: 'rgba(147,51,234,0.1)', border: '1px solid rgba(147,51,234,0.3)', color: '#2D2D44' }}
                        >
                          {c}
                          <button type="button" onClick={() => toggleCollaborator(c)} className="hover:text-red-500 transition-colors">
                            <XMarkIcon className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#2D2D44' }}>
                    Tags{' '}
                    <span className="text-xs font-normal" style={{ color: '#6B6B85' }}>(optional, max 5)</span>
                  </label>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      <AnimatePresence>
                        {tags.map((tag) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm"
                            style={{ background: 'rgba(157,124,196,0.15)', color: '#2D2D44' }}
                          >
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:opacity-70">
                              <XMarkIcon className="w-3.5 h-3.5" />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                  {tags.length < 5 && (
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Type and press Enter to add tags"
                      className="w-full h-11 px-4 rounded-xl border transition-all focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                      style={fieldStyle}
                    />
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 rounded-xl font-medium transition-all hover:bg-gray-100"
                    style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.1)', color: '#2D2D44' }}
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={!isValid || isLoading}
                    whileHover={{ scale: isValid && !isLoading ? 1.02 : 1 }}
                    whileTap={{ scale: isValid && !isLoading ? 0.98 : 1 }}
                    className="flex-1 px-6 py-3 rounded-xl font-medium text-white gradient-bg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating...
                      </>
                    ) : (
                      'Create Project'
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
