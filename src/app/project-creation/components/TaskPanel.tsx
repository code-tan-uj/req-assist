'use client';
import { useState } from 'react';
 import Icon from'@/components/ui/AppIcon';

interface Task {
  id: string
  title: string
  status: 'todo' | 'in-progress' | 'done'
  createdAt: string
}

interface TaskPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function TaskPanel({ isOpen, onClose }: TaskPanelProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review competitive analysis section',
      status: 'todo',
      createdAt: '2026-02-10',
    },
    {
      id: '2',
      title: 'Update TAM/SAM/SOM calculations',
      status: 'in-progress',
      createdAt: '2026-02-10',
    },
    {
      id: '3',
      title: 'Add pricing strategy recommendations',
      status: 'todo',
      createdAt: '2026-02-09',
    },
    {
      id: '4',
      title: 'Validate market size data',
      status: 'done',
      createdAt: '2026-02-08',
    },
  ])

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  const statusColumns = [
    { id: 'todo', label: 'To Do', icon: 'ClipboardDocumentListIcon', color: 'text-muted-foreground' },
    { id: 'in-progress', label: 'In Progress', icon: 'ClockIcon', color: 'text-warning' },
    { id: 'done', label: 'Done', icon: 'CheckCircleIcon', color: 'text-success' },
  ] as const

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      status: 'todo',
      createdAt: new Date().toISOString().split('T')[0],
    }

    setTasks([newTask, ...tasks])
    setNewTaskTitle('')
  }

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (status: Task['status']) => {
    if (!draggedTask) return

    setTasks(tasks.map(task =>
      task.id === draggedTask.id ? { ...task, status } : task
    ))
    setDraggedTask(null)
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md animate-slide-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="absolute inset-y-0 right-0 w-full glass-panel border-l border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name="ClipboardDocumentListIcon" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Tasks</h2>
              <p className="text-sm text-muted-foreground">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Icon name="XMarkIcon" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Add Task Form */}
        <div className="p-6 border-b border-border">
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add new task..."
              className="flex-1 px-4 py-2 bg-background border border-input rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus-ring transition-all"
            />
            <button
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="p-2 bg-primary text-primary-foreground rounded-xl hover-lift focus-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Icon name="PlusIcon" size={20} />
            </button>
          </form>
        </div>

        {/* Task Board */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {statusColumns.map((column) => (
            <div key={column.id}>
              {/* Column Header */}
              <div className="flex items-center gap-2 mb-3">
                <Icon name={column.icon as any} size={16} className={column.color} />
                <h3 className="text-sm font-semibold text-foreground">
                  {column.label}
                </h3>
                <span className="text-xs text-muted-foreground">
                  ({getTasksByStatus(column.id).length})
                </span>
              </div>

              {/* Tasks */}
              <div
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column.id)}
                className="space-y-2 min-h-[100px] p-2 rounded-xl bg-muted/30 border-2 border-dashed border-border"
              >
                {getTasksByStatus(column.id).map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className="group p-3 bg-card border border-border rounded-lg cursor-move hover:border-primary transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-foreground flex-1">
                        {task.title}
                      </p>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-error/10 transition-all"
                      >
                        <Icon name="TrashIcon" size={14} className="text-muted-foreground hover:text-error" />
                      </button>
                    </div>
                    <span className="text-xs text-muted-foreground mt-2 block">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}

                {getTasksByStatus(column.id).length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No tasks
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}