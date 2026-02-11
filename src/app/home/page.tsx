'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import SearchBar from './components/SearchBar';
import CreateWorkspaceModal from './components/CreateWorkspaceModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import toast from 'react-hot-toast';

export interface Workspace {
  id: string;
  name: string;
  description: string;
  projectCount: number;
  tags: string[];
  updatedAt: string;
}

const initialWorkspaces: Workspace[] = [
  {
    id: '1',
    name: 'Market Analysis 2026',
    description: 'Comprehensive market research for emerging tech sectors',
    projectCount: 5,
    tags: ['market', 'tech', 'analysis'],
    updatedAt: '2 hours ago',
  },
  {
    id: '2',
    name: 'Product Research',
    description: 'User research and competitive analysis for new product features',
    projectCount: 3,
    tags: ['product', 'UX', 'research'],
    updatedAt: '1 day ago',
  },
  {
    id: '3',
    name: 'Academic Studies',
    description: 'Collection of research papers and academic resources for thesis work',
    projectCount: 8,
    tags: ['academic', 'thesis', 'papers'],
    updatedAt: '3 days ago',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteWorkspace, setDeleteWorkspace] = useState<Workspace | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Intersection Observer for reveal animations
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    );

    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleCreateWorkspace = (workspace: Omit<Workspace, 'id' | 'updatedAt'>) => {
    const newWorkspace: Workspace = {
      ...workspace,
      id: Date.now().toString(),
      updatedAt: 'Just now',
    };

    setWorkspaces([newWorkspace, ...workspaces]);
    setIsCreateModalOpen(false);

    toast.success('Workspace created successfully! Redirecting...', {
      duration: 2000,
    });

    // Redirect to the newly created workspace with name and description as query params
    const params = new URLSearchParams({
      name: newWorkspace.name,
      description: newWorkspace.description || '',
    });
    router.push(`/workspace/${newWorkspace.id}?${params.toString()}`);
  };

  const handleDeleteWorkspace = (workspace: Workspace) => {
    setDeleteWorkspace(workspace);
  };

  const confirmDelete = () => {
    if (deleteWorkspace) {
      setWorkspaces(workspaces.filter((w) => w.id !== deleteWorkspace.id));
      toast.success('Workspace deleted successfully');
      setDeleteWorkspace(null);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
    console.log('Searching for:', query);
  };

  const handleWorkspaceSelect = (workspaceId: string) => {
    router.push(`/workspace/${workspaceId}`);
  };

  return (
    <div className="min-h-screen pb-12">
      <Navbar activeTab="workspace" />

      {/* Centered Hero Section */}
      <section className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="max-w-4xl mx-auto text-center w-full">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-5xl md:text-6xl font-bold gradient-text mb-4"
            style={{ letterSpacing: '-0.5px' }}
          >
            What would you like to research today?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="text-lg md:text-xl mb-12"
            style={{ color: 'var(--color-secondary-text)', opacity: 0.8 }}
          >
            Start a new research project or continue with your existing workspaces
          </motion.p>

          <SearchBar
            onSearch={handleSearch}
            workspaces={workspaces}
            onWorkspaceSelect={handleWorkspaceSelect}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
            className="mt-6"
          >
            <motion.button
              onClick={() => setIsCreateModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl font-medium text-white gradient-bg hover-glow"
            >
              Create Workspace
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Workspaces Section */}
      {/* <section className="px-6">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-center justify-between mb-8 reveal">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--color-foreground)' }}>
                Your Workspaces
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--color-secondary-text)', opacity: 0.6 }}>
                {workspaces.length} {workspaces.length === 1 ? 'workspace' : 'workspaces'} available
              </p>
            </div>

            <motion.button
              onClick={() => setIsCreateModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white gradient-bg hover-glow btn-ripple"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Workspace
            </motion.button>
          </div>


          {workspaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {workspaces.map((workspace, index) => (
                  <motion.div
                    key={workspace.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                  >
                    <WorkspaceCard
                      workspace={workspace}
                      onDelete={() => handleDeleteWorkspace(workspace)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
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
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-foreground)' }}>
                No workspaces yet
              </h3>
              <p className="mb-6" style={{ color: 'var(--color-secondary-text)' }}>
                Create your first workspace to get started
              </p>
              <motion.button
                onClick={() => setIsCreateModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-xl font-medium text-white gradient-bg hover-glow"
              >
                Create Workspace
              </motion.button>
            </motion.div>
          )}
        </div>
      </section> */}

      {/* Modals */}
      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateWorkspace}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteWorkspace}
        workspace={deleteWorkspace}
        onClose={() => setDeleteWorkspace(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
