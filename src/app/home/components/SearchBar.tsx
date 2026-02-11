'use client';
import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, FolderIcon } from '@heroicons/react/24/outline';

interface Workspace {
  id: string;
  name: string;
  description: string;
  projectCount: number;
  tags: string[];
  updatedAt: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  workspaces: Workspace[];
  onWorkspaceSelect: (workspaceId: string) => void;
}

export default function SearchBar({ onSearch, workspaces, onWorkspaceSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showWorkspacePalette, setShowWorkspacePalette] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (value: string) => {
    setQuery(value);

    // Show workspace palette when "/" is typed
    if (value.startsWith('/')) {
      setShowWorkspacePalette(true);
      setSelectedIndex(0);
    } else {
      setShowWorkspacePalette(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (showWorkspacePalette) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % workspaces.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + workspaces.length) % workspaces.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (workspaces[selectedIndex]) {
          selectWorkspace(workspaces[selectedIndex].id);
        }
      } else if (e.key === 'Escape') {
        setShowWorkspacePalette(false);
        setQuery('');
      }
    } else {
      if (e.key === 'Enter' && query.trim() && !query.startsWith('/')) {
        onSearch(query);
      }
    }
  };

  const selectWorkspace = (workspaceId: string) => {
    setShowWorkspacePalette(false);
    setQuery('');
    onWorkspaceSelect(workspaceId);
  };

  // Filter workspaces based on search query (after /)
  const filteredWorkspaces = showWorkspacePalette
    ? workspaces.filter((ws) =>
        ws.name.toLowerCase().includes(query.slice(1).toLowerCase())
      )
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
      className="w-full max-w-[650px] mx-auto"
    >
      <div className="relative">
        <motion.div
          animate={{
            boxShadow: isFocused
              ? '0 0 0 3px rgba(157, 124, 196, 0.3)'
              : 'var(--shadow-glass)',
          }}
          transition={{ duration: 0.3 }}
          className="relative glass-card rounded-2xl overflow-hidden"
        >
          {/* Magnifying Glass Icon */}
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <MagnifyingGlassIcon
              className="w-5 h-5"
              style={{ color: 'var(--color-secondary-text)' }}
            />
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              // Delay to allow click on palette
              setTimeout(() => setShowWorkspacePalette(false), 200);
            }}
            placeholder="Ask anything or press '/' to browse workspaces..."
            className="w-full h-16 pl-14 pr-6 text-base bg-transparent border-none outline-none transition-all"
            style={{
              color: 'var(--color-foreground)',
            }}
          />

          {/* Animated Border on Focus */}
          {isFocused && (
            <motion.div
              layoutId="searchBorder"
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                border: '2px solid transparent',
                borderImage: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary)) 1',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </motion.div>

        {/* Workspace Palette */}
        <AnimatePresence>
          {showWorkspacePalette && filteredWorkspaces.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 glass-modal rounded-xl overflow-hidden shadow-lg z-50 max-h-[400px] overflow-y-auto"
              style={{ border: '1px solid var(--color-border)' }}
            >
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-medium" style={{ color: 'var(--color-secondary-text)' }}>
                  Your Workspaces ({filteredWorkspaces.length})
                </div>
                {filteredWorkspaces.map((workspace, index) => (
                  <button
                    key={workspace.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectWorkspace(workspace.id);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full px-3 py-3 rounded-lg text-left flex items-center gap-3 transition-colors ${
                      index === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
                      <FolderIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate" style={{ color: 'var(--color-foreground)' }}>
                        {workspace.name}
                      </div>
                      <div className="text-xs truncate" style={{ color: 'var(--color-secondary-text)' }}>
                        {workspace.projectCount} {workspace.projectCount === 1 ? 'project' : 'projects'} • {workspace.updatedAt}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <svg className="w-4 h-4" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 0.5 : 0 }}
          className="text-xs text-center mt-2"
          style={{ color: 'var(--color-secondary-text)' }}
        >
          {showWorkspacePalette ? 'Use ↑↓ arrows to navigate, Enter to select, Esc to cancel' : 'Press Enter to search or / to browse workspaces'}
        </motion.p>
      </div>
    </motion.div>
  );
}
