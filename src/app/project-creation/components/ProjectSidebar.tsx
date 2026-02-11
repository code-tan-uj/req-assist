'use client';
import { useState } from 'react';
 import Icon from'@/components/ui/AppIcon';
 import CreateProjectModal from'./CreateProjectModal';

interface Project {
  id: string
  title: string
  overview: string
  lastUpdated: string
  createdAt: string
}

export default function ProjectSidebar() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'SaaS Market Research',
      overview: 'Analyzing the competitive landscape for B2B SaaS products in 2026',
      lastUpdated: '1 hour ago',
      createdAt: '2026-02-01',
    },
    {
      id: '2',
      title: 'AI Adoption Study',
      overview: 'Research on AI tool adoption rates across different industries',
      lastUpdated: '2 days ago',
      createdAt: '2026-01-28',
    },
    {
      id: '3',
      title: 'Consumer Behavior Analysis',
      overview: 'Understanding purchasing patterns in post-pandemic economy',
      lastUpdated: '5 days ago',
      createdAt: '2026-01-25',
    },
  ])

  const [selectedProject, setSelectedProject] = useState<string | null>(projects[0]?.id || null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateProject = (title: string, overview: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      title,
      overview,
      lastUpdated: 'Just now',
      createdAt: new Date().toISOString().split('T')[0],
    }
    setProjects([newProject, ...projects])
    setSelectedProject(newProject.id)
    setIsModalOpen(false)
  }

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id))
    if (selectedProject === id) {
      setSelectedProject(projects[0]?.id || null)
    }
  }

  return (
    <>
      <aside className="w-80 border-r border-border bg-card flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Projects
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Icon name="PlusIcon" size={20} />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              className={`group p-4 rounded-xl cursor-pointer transition-all ${
                selectedProject === project.id
                  ? 'bg-primary/10 border-2 border-primary' :'bg-muted/50 border-2 border-transparent hover:border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className={`font-medium text-sm line-clamp-1 ${
                  selectedProject === project.id ? 'text-primary' : 'text-foreground'
                }`}>
                  {project.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteProject(project.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-error/10 transition-all"
                >
                  <Icon name="TrashIcon" size={14} className="text-muted-foreground hover:text-error" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {project.overview}
              </p>
              <span className="text-xs text-muted-foreground">
                {project.lastUpdated}
              </span>
            </div>
          ))}
        </div>
      </aside>

      {/* Create Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </>
  )
}