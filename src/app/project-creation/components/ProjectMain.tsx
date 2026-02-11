'use client';
import { useState } from 'react';
 import ChatInterface from'./ChatInterface';
 import TaskPanel from'./TaskPanel';

export default function ProjectMain() {
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false)

  return (
    <main className="flex-1 flex flex-col relative">
      {/* Chat Interface */}
      <ChatInterface onOpenTaskPanel={() => setIsTaskPanelOpen(true)} />

      {/* Task Side Panel */}
      <TaskPanel
        isOpen={isTaskPanelOpen}
        onClose={() => setIsTaskPanelOpen(false)}
      />
    </main>
  )
}