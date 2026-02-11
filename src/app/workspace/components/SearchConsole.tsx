'use client';
import { useState } from 'react';
 import Icon from'@/components/ui/AppIcon';

export default function SearchConsole() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Search query:', searchQuery)
      // Future: Handle search logic
    }
  }

  return (
    <div className="text-center space-y-8">
      {/* Heading */}
      <div className="space-y-3">
        <h1 className="text-fluid-4xl font-bold text-foreground tracking-tight">
          What would you like to research today?
        </h1>
        <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto">
          Start a new research project or continue with your existing workspaces
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Icon name="MagnifyingGlassIcon" size={24} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask anything or press '/' for commands..."
            className="w-full pl-14 pr-6 py-5 bg-card border-2 border-input rounded-2xl text-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSearch(e)
              }
            }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Press <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter</kbd> to search or <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">/</kbd> for commands
        </p>
      </form>
    </div>
  )
}