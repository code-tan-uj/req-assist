'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
 import Icon from'@/components/ui/AppIcon';

interface Workspace {
  id: string
  name: string
  description: string
  projectCount: number
  lastUpdated: string
  createdAt: string
}

interface WorkspaceCardProps {
  workspace: Workspace
  onDelete: (id: string) => void
}

export default function WorkspaceCard({ workspace, onDelete }: WorkspaceCardProps) {
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleClick = () => {
    router.push(`/project-creation?workspace=${workspace.id}`)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (showDeleteConfirm) {
      onDelete(workspace.id)
    } else {
      setShowDeleteConfirm(true)
      setTimeout(() => setShowDeleteConfirm(false), 3000)
    }
  }

  return (
    <div
      onClick={handleClick}
      className="group glass-panel rounded-2xl p-6 cursor-pointer hover-lift transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon name="FolderIcon" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {workspace.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {workspace.projectCount} {workspace.projectCount === 1 ? 'project' : 'projects'}
            </p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-error/10 transition-all"
        >
          <Icon
            name={showDeleteConfirm ? 'CheckIcon' : 'TrashIcon'}
            size={16}
            className={showDeleteConfirm ? 'text-error' : 'text-muted-foreground hover:text-error'}
          />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {workspace.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground">
          Updated {workspace.lastUpdated}
        </span>
        <Icon name="ChevronRightIcon" size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  )
}