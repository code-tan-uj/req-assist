'use client';
import { useState, KeyboardEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderIcon,
  PlusIcon,
  PaperClipIcon,
  MicrophoneIcon,
  ChevronDownIcon,
  SparklesIcon,
  CheckCircleIcon,
  MapIcon,
  LightBulbIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

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
  onQuickAction: (action: 'search-kb' | 'initiate-change' | 'create-workspace') => void;
}

export default function SearchBar({ onSearch, workspaces, onWorkspaceSelect, onQuickAction }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showWorkspacePalette, setShowWorkspacePalette] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState('select model');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const quickActions = [
    // { icon: SparklesIcon, label: 'Research Hub', color: 'from-purple-500 to-pink-500' },
    { icon: CheckCircleIcon, label: 'Search KB', color: 'from-blue-500 to-cyan-500' },
    { icon: MapIcon, label: 'Initate Change', color: 'from-green-500 to-emerald-500' },
    { icon: LightBulbIcon, label: 'Create Work Space', color: 'from-yellow-500 to-orange-500' },
  ];

  const handleInputChange = (value: string) => {
    setQuery(value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    // Show workspace palette when "/" is typed
    if (value.startsWith('/')) {
      setShowWorkspacePalette(true);
      setSelectedIndex(0);
    } else {
      setShowWorkspacePalette(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showWorkspacePalette) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % workspaces.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + workspaces.length) % workspaces.length);
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (workspaces[selectedIndex]) {
          selectWorkspace(workspaces[selectedIndex].id);
        }
      } else if (e.key === 'Escape') {
        setShowWorkspacePalette(false);
        setQuery('');
      }
    } else {
      if (e.key === 'Enter' && !e.shiftKey && query.trim() && !query.startsWith('/')) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query);
      setQuery('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const selectWorkspace = (workspaceId: string) => {
    setShowWorkspacePalette(false);
    setQuery('');
    onWorkspaceSelect(workspaceId);
  };

  const handleQuickAction = (action: string) => {
    // Handle different quick actions
    if (action === 'Search KB') {
      onQuickAction('search-kb');
    } else if (action === 'Initate Change') {
      onQuickAction('initiate-change');
    } else if (action === 'Create Work Space') {
      onQuickAction('create-workspace');
    }
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
      className="w-full max-w-[900px] mx-auto"
    >
      <div className="relative">
        {/* Main Chat Input */}
        <motion.div
          animate={{
            boxShadow: isFocused
              ? '0 0 0 2px rgba(157, 124, 196, 0.3)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
          }}
          transition={{ duration: 0.3 }}
          className="relative glass-card rounded-[28px] overflow-visible"
          style={{
            backgroundColor: 'var(--color-glass-bg)',
            border: '1px solid var(--color-border)',
          }}
        >
          {/* Top Row: Textarea with icons */}
          <div className="relative">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                setTimeout(() => setShowWorkspacePalette(false), 200);
              }}
              placeholder="Ask anything. Type @ for sources and / for shortcuts."
              rows={1}
              className="w-full resize-none px-6 pt-5 pb-4 pr-24 text-base bg-transparent border-none outline-none transition-all"
              style={{
                color: 'var(--color-foreground)',
                minHeight: '64px',
                maxHeight: '200px',
              }}
            />
          </div>

          {/* Bottom Row: Controls */}
          <div className="flex items-center justify-between px-4 pb-4 pt-2">
            {/* Left: Add button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-white/5 transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
              title="Add attachment"
            >
              <PlusIcon className="w-5 h-5" style={{ color: 'var(--color-secondary-text)' }} />
            </motion.button>

            {/* Right: Model selector, mic, and submit */}
            <div className="flex items-center gap-3">
              {/* Model Selector */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className="text-sm font-medium" style={{ color: 'var(--color-secondary-text)' }}>
                  {selectedModel}
                </span>
                <ChevronDownIcon className="w-4 h-4" style={{ color: 'var(--color-secondary-text)' }} />
              </motion.button>

              {/* Microphone */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
                title="Voice input"
              >
                <MicrophoneIcon className="w-5 h-5" style={{ color: 'var(--color-secondary-text)' }} />
              </motion.button>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!query.trim()}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: query.trim() ? 'var(--color-primary)' : 'var(--color-border)',
                }}
                title="Submit"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center justify-center gap-3 mt-6 flex-wrap"
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickAction(action.label)}
                className="px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
              >
                <Icon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">
                  {action.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Hint Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 0.5 : 0 }}
          className="text-xs text-center mt-3"
          style={{ color: 'var(--color-secondary-text)' }}
        >
          {showWorkspacePalette ? 'Use ↑↓ arrows to navigate, Enter to select, Esc to cancel' : 'Press Enter to search or / to browse workspaces'}
        </motion.p>
      </div>
    </motion.div>
  );
}
