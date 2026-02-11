'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderIcon, EllipsisVerticalIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Workspace } from '../page';

interface WorkspaceCardProps {
  workspace: Workspace;
  onDelete: () => void;
}

export default function WorkspaceCard({ workspace, onDelete }: WorkspaceCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleCardClick = () => {
    router.push(`/workspace/${workspace.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative glass-card rounded-2xl p-8 cursor-pointer hover-lift group"
      onClick={handleCardClick}
      style={{
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center"
          >
            <FolderIcon className="w-6 h-6 text-white" />
          </div>

          {/* Three Dot Menu */}
          <div className="relative">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'var(--color-muted)' }}
            >
              <EllipsisVerticalIcon className="w-5 h-5" style={{ color: 'var(--color-foreground)' }} />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-40 glass-modal rounded-xl overflow-hidden z-10"
                  style={{ border: '1px solid var(--color-border)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      // Edit functionality
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-opacity-50 transition-all"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onDelete();
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-opacity-50 transition-all"
                    style={{ color: 'var(--color-destructive)' }}
                  >
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold" style={{ color: 'var(--color-foreground)' }}>
          {workspace.name}
        </h3>

        {/* Project Count Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium gradient-bg text-white">
          {workspace.projectCount} {workspace.projectCount === 1 ? 'project' : 'projects'}
        </div>

        {/* Description */}
        <p
          className="text-sm line-clamp-2"
          style={{ color: 'var(--color-secondary-text)' }}
        >
          {workspace.description}
        </p>

        {/* Tags */}
        {workspace.tags && workspace.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {workspace.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-lg text-xs"
                style={{
                  background: 'var(--color-muted)',
                  color: 'var(--color-secondary-text)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--color-secondary-text)' }}>
          Updated {workspace.updatedAt}
        </span>

        <motion.div
          className="flex items-center gap-1"
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRightIcon className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
        </motion.div>
      </div>

      {/* Hover Gradient Border Animation */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
          padding: '2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
    </motion.div>
  );
}
