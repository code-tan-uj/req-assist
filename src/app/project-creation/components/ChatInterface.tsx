'use client';
import { useState, useRef, useEffect } from 'react';
 import Icon from'@/components/ui/AppIcon';
 import ResearchOutput from'./ResearchOutput';

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ChatInterfaceProps {
  onOpenTaskPanel: () => void
}

export default function ChatInterface({ onOpenTaskPanel }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [showCommands, setShowCommands] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const commands = [
    { command: '/market-research', description: 'Generate comprehensive market analysis', icon: 'ChartBarIcon' },
    { command: '/gap-analysis', description: 'Identify market gaps and opportunities', icon: 'MagnifyingGlassIcon' },
    { command: '/mindmap', description: 'Create visual concept mindmap', icon: 'Square3Stack3DIcon' },
    { command: '/user-flow', description: 'Design user journey flowchart', icon: 'ArrowPathIcon' },
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setInputValue(value)
    setShowCommands(value.startsWith('/') && value.length > 1)
  }

  const handleCommandSelect = (command: string) => {
    setInputValue(command + ' ')
    setShowCommands(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isGenerating) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages([...messages, userMessage])
    setInputValue('')
    setIsGenerating(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'research-output',
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Project Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              SaaS Market Research
            </h1>
            <p className="text-sm text-muted-foreground">
              Analyzing the competitive landscape for B2B SaaS products in 2026
            </p>
          </div>
          <button
            onClick={onOpenTaskPanel}
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors"
          >
            <Icon name="ClipboardDocumentListIcon" size={20} />
            <span className="text-sm font-medium">Tasks</span>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Icon name="ChatBubbleLeftRightIcon" size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Start Your Research
              </h3>
              <p className="text-muted-foreground mb-6">
                Ask a question or use slash commands to generate structured research
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {commands.map((cmd) => (
                  <button
                    key={cmd.command}
                    onClick={() => handleCommandSelect(cmd.command)}
                    className="flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors text-left"
                  >
                    <Icon name={cmd.icon as any} size={20} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{cmd.command}</p>
                      <p className="text-xs text-muted-foreground">{cmd.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id}>
                {message.type === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-3xl bg-primary text-primary-foreground rounded-2xl px-6 py-4">
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-2 block">
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-full">
                    {message.content === 'research-output' ? (
                      <ResearchOutput />
                    ) : (
                      <div className="bg-card border border-border rounded-2xl px-6 py-4">
                        <p className="text-sm text-foreground">{message.content}</p>
                        <span className="text-xs text-muted-foreground mt-2 block">
                          {message.timestamp}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}

          {isGenerating && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
              <span className="text-sm">Generating research...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-6">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            {/* Command Menu */}
            {showCommands && (
              <div className="absolute bottom-full left-0 right-0 mb-2 glass-panel rounded-xl p-2 shadow-lg animate-scale-in">
                {commands
                  .filter(cmd => cmd.command.includes(inputValue.toLowerCase()))
                  .map((cmd) => (
                    <button
                      key={cmd.command}
                      type="button"
                      onClick={() => handleCommandSelect(cmd.command)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <Icon name={cmd.icon as any} size={20} className="text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{cmd.command}</p>
                        <p className="text-xs text-muted-foreground">{cmd.description}</p>
                      </div>
                    </button>
                  ))}
              </div>
            )}

            {/* Input */}
            <div className="relative">
              <textarea
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder="Ask a question or type '/' for commands..."
                rows={3}
                className="w-full px-6 py-4 bg-background border-2 border-input rounded-2xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none outline-none pr-14"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isGenerating}
                className="absolute right-3 bottom-3 p-2 bg-primary text-primary-foreground rounded-xl hover-lift focus-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Icon name="PaperAirplaneIcon" size={20} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Press <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter</kbd> to send or <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Shift + Enter</kbd> for new line
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}