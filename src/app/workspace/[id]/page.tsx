'use client';
import { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import toast from 'react-hot-toast';

export interface Project {
  id: string;
  title: string;
  overview: string;
  collaborators: string[];
  tags: string[];
  status: 'Draft' | 'In Progress' | 'Complete';
  updatedAt: string;
}

// Mock data
const mockWorkspaces: Record<string, { name: string; description?: string; projects: Project[] }> = {
  '1': {
    name: 'Market Analysis 2026',
    description: 'Comprehensive market research for emerging tech sectors',
    projects: [
      {
        id: 'p1',
        title: 'AI Market Trends',
        overview: 'Analysis of artificial intelligence market trends and opportunities in 2026',
        collaborators: ['Alice', 'Bob'],
        tags: ['AI', 'trends'],
        status: 'In Progress',
        updatedAt: '2 hours ago',
      },
      {
        id: 'p2',
        title: 'Cloud Infrastructure Growth',
        overview: 'Research on cloud infrastructure market expansion and key players',
        collaborators: ['Carol'],
        tags: ['cloud', 'infrastructure'],
        status: 'Complete',
        updatedAt: '1 day ago',
      },
    ],
  },
  '2': {
    name: 'Product Research',
    description: 'User research and competitive analysis for new product features',
    projects: [],
  },
  '3': {
    name: 'Academic Studies',
    description: 'Collection of research papers and academic resources for thesis work',
    projects: [],
  },
};

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const workspaceId = params.id as string;

  // Get workspace name and description from URL query params (for newly created workspaces)
  const queryName = searchParams.get('name');
  const queryDescription = searchParams.get('description');

  // Use mock data if available, otherwise use query params for newly created workspaces
  const workspace = mockWorkspaces[workspaceId] || { 
    name: queryName || 'New Workspace', 
    description: queryDescription || '',
    projects: [] 
  };
  const [projects, setProjects] = useState<Project[]>(workspace.projects);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  const handleDeleteProject = (project: Project) => {
    setDeleteProject(project);
  };

  const confirmDelete = () => {
    if (deleteProject) {
      setProjects(projects.filter((p) => p.id !== deleteProject.id));
      toast.success('Project deleted successfully');
      setDeleteProject(null);
    }
  };

  const handleCreateProject = (project: Omit<Project, 'id' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      updatedAt: 'Just now',
    };

    setProjects([newProject, ...projects]);
    setIsCreateModalOpen(false);
    toast.success('Project created successfully');
  };

  const handleOpenProject = (projectId: string, projectTitle: string) => {
    const params = new URLSearchParams({
      title: projectTitle,
      workspace: workspace.name,
      workspaceId: workspaceId,
    });
    router.push(`/project/${projectId}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen pb-12">
      <Navbar activeTab="workspace" />

      {/* Header Section */}
      <section className="pt-32 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-6 text-sm"
            style={{ color: 'var(--color-secondary-text)' }}
          >
            <button
              onClick={() => router.push('/home')}
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              Home
            </button>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium" style={{ color: 'var(--color-foreground)' }}>
              {workspace.name}
            </span>
          </motion.div>

          {/* Page Title */}
          <div className="flex items-start justify-between mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">
                {workspace.name}
              </h1>
              {workspace.description && (
                <p className="text-lg" style={{ color: 'var(--color-secondary-text)' }}>
                  {workspace.description}
                </p>
              )}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white gradient-bg hover-glow btn-ripple"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Project
            </motion.button>
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    onDelete={() => handleDeleteProject(project)}
                    onOpen={() => handleOpenProject(project.id, project.title)}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 glass-card rounded-2xl"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full glass-panel flex items-center justify-center">
                <svg
                  className="w-12 h-12"
                  style={{ color: 'var(--color-secondary-text)' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-foreground)' }}>
                No projects yet
              </h3>
              <p className="mb-6" style={{ color: 'var(--color-secondary-text)' }}>
                Create your first project to get started
              </p>
              <motion.button
                onClick={() => setIsCreateModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-xl font-medium text-white gradient-bg hover-glow"
              >
                Create Project
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Modals */}
      <NewProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProject}
      />

      <DeleteProjectModal
        isOpen={!!deleteProject}
        project={deleteProject}
        onClose={() => setDeleteProject(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

// Project Card Component
function ProjectCard({
  project,
  index,
  onDelete,
  onOpen,
}: {
  project: Project;
  index: number;
  onDelete: () => void;
  onOpen: () => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    Draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    'In Progress': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Complete: 'bg-green-500/20 text-green-300 border-green-500/30',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass-card rounded-2xl p-6 hover-lift cursor-pointer relative group"
      onClick={onOpen}
    >
      {/* Three-dot menu */}
      <div className="absolute top-4 right-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-2 w-40 glass-modal rounded-xl overflow-hidden shadow-lg z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-red-500/20 transition-colors text-red-400 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Project Content */}
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2 pr-8" style={{ color: 'var(--color-foreground)' }}>
          {project.title}
        </h3>
        <p
          className="text-sm line-clamp-2 mb-4"
          style={{ color: 'var(--color-secondary-text)' }}
        >
          {project.overview}
        </p>
      </div>

      {/* Collaborators */}
      {project.collaborators.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-2">
            {project.collaborators.slice(0, 3).map((collab, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-medium border-2"
                style={{ borderColor: 'var(--color-background-start)' }}
                title={collab}
              >
                {collab[0]}
              </div>
            ))}
            {project.collaborators.length > 3 && (
              <div
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium border-2"
                style={{ borderColor: 'var(--color-background-start)' }}
              >
                +{project.collaborators.length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--color-secondary-text)' }}>
          {project.updatedAt}
        </span>
      </div>

      {/* Hover Arrow */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
        className="absolute bottom-6 right-6"
      >
        <svg
          className="w-6 h-6"
          style={{ color: 'var(--color-primary)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// New Project Modal Component
function NewProjectModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: Omit<Project, 'id' | 'updatedAt'>) => void;
}) {
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const mockUsers = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'];

  const handleSubmit = async () => {
    if (!title.trim() || !overview.trim()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onCreate({
      title,
      overview,
      collaborators,
      tags,
      status: 'Draft',
    });

    // Reset form
    setTitle('');
    setOverview('');
    setCollaborators([]);
    setTags([]);
    setTagInput('');
    setIsLoading(false);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const toggleCollaborator = (user: string) => {
    if (collaborators.includes(user)) {
      setCollaborators(collaborators.filter((c) => c !== user));
    } else {
      setCollaborators([...collaborators, user]);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-md p-8 overflow-y-auto"
        style={{ 
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold gradient-text">New Project</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" style={{ color: '#6B6B85' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D44' }}>
              Project Title*
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              style={{ 
                color: '#2D2D44',
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>

          {/* Overview */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D44' }}>
              Overview*
            </label>
            <textarea
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Brief overview of the project"
              rows={4}
              className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
              style={{ 
                color: '#2D2D44',
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>

          {/* Collaborators */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D44' }}>
              Select Collaborators
            </label>
            <div 
              className="rounded-xl p-4 space-y-2"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}
            >
              {mockUsers.map((user) => (
                <label
                  key={user}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={collaborators.includes(user)}
                    onChange={() => toggleCollaborator(user)}
                    className="w-4 h-4 rounded accent-[var(--color-primary)]"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-medium">
                      {user[0]}
                    </div>
                    <span style={{ color: '#2D2D44' }}>{user}</span>
                  </div>
                </label>
              ))}
            </div>
            {collaborators.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {collaborators.map((collab) => (
                  <span
                    key={collab}
                    className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    style={{
                      background: 'rgba(147, 51, 234, 0.1)',
                      border: '1px solid rgba(147, 51, 234, 0.3)',
                      color: '#2D2D44'
                    }}
                  >
                    {collab}
                    <button onClick={() => toggleCollaborator(collab)} className="hover:text-red-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D44' }}>
              Tags (optional)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type and press Enter to add tags"
              className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              style={{ 
                color: '#2D2D44',
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <motion.span
                    key={tag}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    style={{
                      background: 'rgba(147, 51, 234, 0.1)',
                      border: '1px solid rgba(147, 51, 234, 0.3)',
                      color: '#2D2D44'
                    }}
                  >
                    #{tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            style={{
              background: 'transparent',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              color: '#2D2D44'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !overview.trim() || isLoading}
            className="flex-1 px-6 py-3 rounded-xl font-medium text-white gradient-bg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating...
              </>
            ) : (
              'Create Project'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Delete Project Modal Component
function DeleteProjectModal({
  isOpen,
  project,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [isChecked, setIsChecked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onConfirm();
    setIsDeleting(false);
    setIsChecked(false);
  };

  if (!isOpen || !project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md glass-modal rounded-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center"
        >
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </motion.div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--color-foreground)' }}>
          Delete {project.title}?
        </h3>
        <p className="text-center mb-6" style={{ color: 'var(--color-secondary-text)' }}>
          Research, tasks, and history will be permanently lost
        </p>

        {/* Confirmation Checkbox */}
        <label className="flex items-start gap-3 p-4 rounded-xl glass-panel mb-6 cursor-pointer hover:bg-white/5 transition-colors">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="mt-1 w-4 h-4 rounded accent-red-500"
          />
          <span className="text-sm" style={{ color: 'var(--color-foreground)' }}>
            I understand this cannot be undone
          </span>
        </label>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl font-medium glass-panel hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isChecked || isDeleting}
            className="flex-1 px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
