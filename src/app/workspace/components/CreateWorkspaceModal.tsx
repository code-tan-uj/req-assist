'use client';
import { useState, useEffect } from 'react';
 import Icon from'@/components/ui/AppIcon';

interface CreateWorkspaceModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (name: string, description: string) => void
}

export default function CreateWorkspaceModal({
  isOpen,
  onClose,
  onCreate,
}: CreateWorkspaceModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setName('')
      setDescription('')
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && description.trim()) {
      onCreate(name.trim(), description.trim())
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-scale-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      />

      {/* Modal */}
      <div 
        className="relative rounded-2xl p-8 w-full max-w-lg shadow-2xl"
        style={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#2D2D44' }}>
            Create New Workspace
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Icon name="XMarkIcon" size={20} style={{ color: '#6B6B85' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Workspace Name */}
          <div>
            <label
              htmlFor="workspace-name"
              className="block text-sm font-medium mb-2"
              style={{ color: '#2D2D44' }}
            >
              Workspace Name
            </label>
            <input
              id="workspace-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Market Analysis 2026"
              className="w-full px-4 py-3 rounded-xl transition-all focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                color: '#2D2D44',
              }}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="workspace-description"
              className="block text-sm font-medium mb-2"
              style={{ color: '#2D2D44' }}
            >
              Short Description
            </label>
            <textarea
              id="workspace-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this workspace is for..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl transition-all resize-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                color: '#2D2D44',
              }}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              style={{
                background: 'transparent',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                color: '#2D2D44',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !description.trim()}
              className="flex-1 px-4 py-3 rounded-xl font-medium text-white gradient-bg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}