'use client';
import { useState } from 'react';
 import Icon from'@/components/ui/AppIcon';
 import CreateWorkspaceModal from'./CreateWorkspaceModal';
 import WorkspaceCard from'./WorkspaceCard';

interface Workspace {
  id: string
  name: string
  description: string
  projectCount: number
  lastUpdated: string
  createdAt: string
}

export default function WorkspaceList() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: '1',
      name: 'Market Analysis 2026',
      description: 'Comprehensive market research for emerging tech sectors',
      projectCount: 5,
      lastUpdated: '2 hours ago',
      createdAt: '2026-01-15',
    },
    {
      id: '2',
      name: 'Competitor Intelligence',
      description: 'Tracking competitor strategies and market positioning',
      projectCount: 3,
      lastUpdated: '1 day ago',
      createdAt: '2026-01-10',
    },
    {
      id: '3',
      name: 'User Research Q1',
      description: 'Customer insights and behavioral analysis for product development',
      projectCount: 8,
      lastUpdated: '3 days ago',
      createdAt: '2026-01-05',
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateWorkspace = (name: string, description: string) => {
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name,
      description,
      projectCount: 0,
      lastUpdated: 'Just now',
      createdAt: new Date().toISOString().split('T')[0],
    }
    setWorkspaces([newWorkspace, ...workspaces])
    setIsModalOpen(false)
  }

  const handleDeleteWorkspace = (id: string) => {
    setWorkspaces(workspaces.filter(w => w.id !== id))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Workspaces</h2>
          <p className="text-muted-foreground mt-1">
            {workspaces.length} {workspaces.length === 1 ? 'workspace' : 'workspaces'} available
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover-lift focus-ring transition-all"
        >
          <Icon name="PlusIcon" size={20} />
          Create Workspace
        </button>
      </div>

      {/* Workspace Grid */}
      {workspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace, index) => (
            <div
              key={workspace.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <WorkspaceCard
                workspace={workspace}
                onDelete={handleDeleteWorkspace}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-4">
            <Icon name="FolderIcon" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No workspaces yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Create your first workspace to start organizing research projects
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover-lift focus-ring transition-all"
          >
            Create First Workspace
          </button>
        </div>
      )}

      {/* Create Modal */}
      <CreateWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateWorkspace}
      />
    </div>
  )
}