'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import {
  MagnifyingGlassIcon,
  ChartBarIcon,
  LightBulbIcon,
  ArrowsRightLeftIcon,
  UserGroupIcon,
  BookOpenIcon,
  PlusIcon,
  PencilIcon,
  ClipboardIcon,
  ArrowPathIcon,
  DocumentIcon,
  LinkIcon,
  CloudIcon,
  BeakerIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  ShareIcon,
  EyeIcon,
  ArrowUpRightIcon,
  ArrowDownIcon,
  // ArrowRightIcon and ArrowLeftIcon already imported above, remove duplicates
  Cog6ToothIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  UserIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentIcon,
  ClipboardIcon as ClipboardOutlineIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  Bars3Icon,
  Bars4Icon,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  Bars2Icon,
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
  // Removed invalid Heroicons imports
} from '@heroicons/react/24/outline';

// Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sections?: ResearchSection[];
}

interface ResearchSection {
  id: string;
  title: string;
  content: string;
  icon: string;
  isExpanded?: boolean;
  version?: number;
}

interface ResearchConfig {
  industry: string;
  geography: string;
  depth: 'Quick' | 'Standard' | 'Deep';
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'high' | 'medium' | 'low';
  assignee?: string;
  deadline?: string;
  linkedSection?: string;
  progress?: number;
}

interface ActivityItem {
  id: string;
  type: 'ai' | 'edit' | 'task' | 'kb' | 'version' | 'export' | 'user-story';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
}

interface Version {
  id: string;
  version: string;
  timestamp: Date;
  description: string;
  isCurrent: boolean;
}

interface KBEntry {
  id: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
  createdAt: Date;
  author: string;
}

// Slash Commands - Organized by category
const SLASH_COMMANDS = [
  // Research Commands
  { id: 1, icon: <MagnifyingGlassIcon className="w-5 h-5 text-primary" />, command: '/market-research', description: 'Comprehensive market study', category: 'Research' },
  { id: 2, icon: <ChartBarIcon className="w-5 h-5 text-primary" />, command: '/gap-analysis', description: 'Identify market gaps', category: 'Research' },
  { id: 3, icon: <LightBulbIcon className="w-5 h-5 text-primary" />, command: '/mindmap', description: 'Create mind map diagram', category: 'Research' },
  { id: 4, icon: <ArrowsRightLeftIcon className="w-5 h-5 text-primary" />, command: '/userflow', description: 'Generate user flow diagram', category: 'Research' },
  { id: 5, icon: <ChartBarIcon className="w-5 h-5 text-primary" />, command: '/swot', description: 'SWOT analysis', category: 'Research' },
  { id: 6, icon: <UserGroupIcon className="w-5 h-5 text-primary" />, command: '/competitor', description: 'Competitor analysis', category: 'Research' },
  // Knowledge Base
  { id: 7, icon: <BookOpenIcon className="w-5 h-5 text-primary" />, command: '/kb-add', description: 'Add selected text to KB', category: 'Knowledge Base' },
  { id: 8, icon: <MagnifyingGlassIcon className="w-5 h-5 text-primary" />, command: '/kb-search', description: 'Search knowledge base', category: 'Knowledge Base' },
  { id: 9, icon: <PencilIcon className="w-5 h-5 text-primary" />, command: '/kb-update', description: 'Update KB entry', category: 'Knowledge Base' },
  // Azure DevOps
  { id: 10, icon: <ChartBarIcon className="w-5 h-5 text-primary" />, command: '/create-us', description: 'Create user story', category: 'Azure DevOps' },
  { id: 11, icon: <LinkIcon className="w-5 h-5 text-primary" />, command: '/link-azure', description: 'Link to Azure work item', category: 'Azure DevOps' },
  { id: 12, icon: <EyeIcon className="w-5 h-5 text-primary" />, command: '/view-board', description: 'Open Azure board', category: 'Azure DevOps' },
  // Collaboration
  { id: 13, icon: <UserGroupIcon className="w-5 h-5 text-primary" />, command: '/assign', description: 'Assign task to collaborator', category: 'Collaboration' },
  { id: 14, icon: <CalendarIcon className="w-5 h-5 text-primary" />, command: '/schedule', description: 'Set deadline/milestone', category: 'Collaboration' },
  { id: 15, icon: <ShareIcon className="w-5 h-5 text-primary" />, command: '/share', description: 'Share research section', category: 'Collaboration' },
  // Export
  { id: 16, icon: <DocumentIcon className="w-5 h-5 text-primary" />, command: '/export', description: 'Export research document', category: 'Export' },
];

// Sidebar menu structure
const SIDEBAR_MENU = [
  {
    id: 'research',
    title: 'Market Research',
    icon: <ChartBarIcon className="w-5 h-5 text-primary" />,
    items: [
      { id: 'competitor', label: 'Competitor Research', icon: <UserGroupIcon className="w-5 h-5 text-primary" /> },
      { id: 'market-analysis', label: 'Market Analysis', icon: <ChartBarIcon className="w-5 h-5 text-primary" /> },
      { id: 'gap-analysis', label: 'Gap Analysis', icon: <ChartBarIcon className="w-5 h-5 text-primary" /> },
      { id: 'dark-patterns', label: 'Dark Patterns', icon: <ExclamationTriangleIcon className="w-5 h-5 text-primary" /> },
      { id: 'barriers', label: 'Entry/Exit Barriers', icon: <ShieldCheckIcon className="w-5 h-5 text-primary" /> },
    ],
  },
  {
    id: 'knowledge',
    title: 'Knowledge Base',
    icon: <BookOpenIcon className="w-5 h-5 text-primary" />,
    items: [
      { id: 'browse-kb', label: 'Browse KB Articles', icon: <MagnifyingGlassIcon className="w-5 h-5 text-primary" /> },
      { id: 'add-kb', label: 'Add to KB', icon: <PlusIcon className="w-5 h-5 text-primary" /> },
      { id: 'search-kb', label: 'Search KB', icon: <MagnifyingGlassIcon className="w-5 h-5 text-primary" /> },
    ],
  },
  {
    id: 'devops',
    title: 'User Stories',
    icon: <ChartBarIcon className="w-5 h-5 text-primary" />,
    items: [
      { id: 'create-us', label: 'Create User Story', icon: <PlusIcon className="w-5 h-5 text-primary" /> },
      { id: 'auto-categorize', label: 'Auto-categorize', icon: <ArrowPathIcon className="w-5 h-5 text-primary" /> },
      { id: 'view-board', label: 'View Azure Board', icon: <EyeIcon className="w-5 h-5 text-primary" /> },
    ],
  },
  {
    id: 'documents',
    title: 'Documents',
    icon: <DocumentIcon className="w-5 h-5 text-primary" />,
    items: [
      { id: 'add-doc', label: 'Add Document', icon: <PlusIcon className="w-5 h-5 text-primary" /> },
      { id: 'link-doc', label: 'Link Documents', icon: <LinkIcon className="w-5 h-5 text-primary" /> },
      { id: 'export', label: 'Export Research', icon: <ArrowUpTrayIcon className="w-5 h-5 text-primary" /> },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: <CloudIcon className="w-5 h-5 text-primary" />,
    items: [
      { id: 'github', label: 'GitHub Links', icon: <LinkIcon className="w-5 h-5 text-primary" /> },
      { id: 'azure', label: 'Azure DevOps', icon: <CloudIcon className="w-5 h-5 text-primary" /> },
      { id: 'confluence', label: 'Confluence', icon: <BookOpenIcon className="w-5 h-5 text-primary" /> },
    ],
  },
];

const PROJECT_MANAGEMENT = [
  { id: 'tasks', label: 'Tasks & Milestones', icon: <ClipboardDocumentListIcon className="w-5 h-5 text-primary" /> },
  { id: 'collaborators', label: 'Collaborators', icon: <UserGroupIcon className="w-5 h-5 text-primary" /> },
  { id: 'schedule', label: 'Schedule', icon: <CalendarIcon className="w-5 h-5 text-primary" /> },
  { id: 'status', label: 'Status Updates', icon: <ChartBarIcon className="w-5 h-5 text-primary" /> },
];

// Mock data
const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Analyze competitor pricing', status: 'in-progress', priority: 'high', assignee: 'Alice', deadline: 'Feb 15', linkedSection: 'Market Overview', progress: 60 },
  { id: '2', title: 'Complete SWOT analysis', status: 'todo', priority: 'medium', assignee: 'Bob', deadline: 'Feb 18' },
  { id: '3', title: 'Review market data', status: 'review', priority: 'high', assignee: 'Carol', deadline: 'Feb 14' },
  { id: '4', title: 'Draft executive summary', status: 'done', priority: 'medium', assignee: 'Alice', deadline: 'Feb 10' },
  { id: '5', title: 'Validate TAM/SAM/SOM', status: 'done', priority: 'low', assignee: 'Bob', deadline: 'Feb 12' },
];

const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: '1', type: 'ai', title: 'Research generated', description: 'Market Overview section created', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), user: 'Claude AI' },
  { id: '2', type: 'edit', title: 'Section edited', description: 'SWOT Analysis updated by Alice', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), user: 'Alice' },
  { id: '3', type: 'task', title: 'Task completed', description: '"Analyze pricing" marked done', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), user: 'Bob' },
  { id: '4', type: 'kb', title: 'Added to KB', description: '"Competitor positioning" saved to KB', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), user: 'You' },
];

const MOCK_VERSIONS: Version[] = [
  { id: '1', version: 'v1.2', timestamp: new Date(), description: 'Updated Market Overview, added SWOT', isCurrent: true },
  { id: '2', version: 'v1.1', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), description: 'Initial research generation', isCurrent: false },
];

const MOCK_CONVERSATIONS = [
  { id: '1', title: 'Market Analysis', date: 'Today' },
  { id: '2', title: 'Competitor SWOT', date: '2d ago' },
  { id: '3', title: 'Gap Analysis', date: '1w ago' },
];

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.id as string;

  // Get project title and workspace info from URL query params
  const queryTitle = searchParams.get('title');
  const queryWorkspace = searchParams.get('workspace');
  const queryWorkspaceId = searchParams.get('workspaceId');

  // Core state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [researchSections, setResearchSections] = useState<ResearchSection[]>([]);
  
  // UI state
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [hasConfigured, setHasConfigured] = useState(false);
  const [researchConfig, setResearchConfig] = useState<ResearchConfig | null>(null);
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [sidePanelTab, setSidePanelTab] = useState<'tasks' | 'versions' | 'activity' | 'more'>('tasks');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['research']);
  const [projectTitle, setProjectTitle] = useState(queryTitle || 'Untitled Project');
  const [workspaceName] = useState(queryWorkspace || 'Workspace');
  const [workspaceId] = useState(queryWorkspaceId || '');
  const [projectStatus, setProjectStatus] = useState<'draft' | 'in-progress' | 'review' | 'complete'>('draft');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  
  // Task & Collaboration state
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activities, setActivities] = useState<ActivityItem[]>(MOCK_ACTIVITIES);
  const [versions, setVersions] = useState<Version[]>(MOCK_VERSIONS);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showKBModal, setShowKBModal] = useState(false);
  const [showUserStoryModal, setShowUserStoryModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [taskFilter, setTaskFilter] = useState<'all' | 'todo' | 'in-progress' | 'review' | 'done'>('all');

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputContainerRef = useRef<HTMLDivElement>(null);
  const [commandPalettePosition, setCommandPalettePosition] = useState({ left: 0, right: 0, bottom: 0, width: 0 });

  // Update command palette position when it opens or layout changes
  useEffect(() => {
    if (showCommandPalette && chatInputContainerRef.current) {
      const rect = chatInputContainerRef.current.getBoundingClientRect();
      setCommandPalettePosition({
        left: rect.left,
        right: window.innerWidth - rect.right,
        bottom: window.innerHeight - rect.top + 8, // 8px gap above the input
        width: rect.width
      });
    }
  }, [showCommandPalette, sidebarCollapsed, showSidePanel]);

  // Toggle menu expansion
  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  // Filter commands based on input
  const filteredCommands = SLASH_COMMANDS.filter(cmd =>
    cmd.command.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, typeof SLASH_COMMANDS>);

  // Handle input change and slash command detection
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.startsWith('/')) {
      setShowCommandPalette(true);
      setSelectedCommandIndex(0);
    } else {
      setShowCommandPalette(false);
    }
  };

  // Handle keyboard navigation in command palette
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      const totalCommands = filteredCommands.length;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCommandIndex((prev) => (prev + 1) % totalCommands);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCommandIndex((prev) => (prev - 1 + totalCommands) % totalCommands);
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (filteredCommands[selectedCommandIndex]) {
          selectCommand(filteredCommands[selectedCommandIndex].command);
        }
      } else if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectCommand = (command: string) => {
    setInputValue(command + ' ');
    setShowCommandPalette(false);
    inputRef.current?.focus();
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Check if this is the first research query
    if (!hasConfigured) {
      setShowConfigModal(true);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Start research generation
    startResearchGeneration();
  };

  const startResearchGeneration = async () => {
    setIsGenerating(true);
    const steps = [
      '⏳ Analyzing query...',
      '🔍 Gathering market data...',
      '📈 Generating Executive Summary...',
      '🏢 Analyzing competitors...',
      '✅ Research complete!',
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Generate mock research sections
    const mockSections: ResearchSection[] = [
      {
        id: '1',
        title: 'Executive Summary',
        content:
          'The market shows significant growth potential with emerging opportunities in AI and machine learning sectors. Key findings indicate a 25% YoY growth rate with strong investor interest.',
        icon: 'clipboard',
      },
      {
        id: '2',
        title: 'Market Overview',
        content:
          'Current market size is estimated at $50B with projected growth to $75B by 2027. Major players include established tech giants and innovative startups disrupting traditional models.',
        icon: 'globe',
      },
      {
        id: '3',
        title: 'Competitive Analysis',
        content:
          'Top competitors identified: Company A (30% market share), Company B (25%), Company C (15%). Each competitor brings unique value propositions and technological advantages.',
        icon: 'chart',
      },
    ];

    setResearchSections(mockSections);
    setIsGenerating(false);
    setCurrentStep(0);
  };

  const handleConfigSave = (config: ResearchConfig) => {
    setResearchConfig(config);
    setHasConfigured(true);
    setShowConfigModal(false);
    startResearchGeneration();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const steps = [
    'Analyzing query...',
    'Gathering market data...',
    'Generating Executive Summary...',
    'Analyzing competitors...',
    'Research complete!',
  ];

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400';
      case 'review': return 'bg-orange-500/20 text-orange-400';
      case 'complete': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Priority colors
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  // Activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ai': return <BoltIcon className="w-5 h-5 text-purple-400" />;
      case 'edit': return <PencilIcon className="w-5 h-5 text-blue-400" />;
      case 'task': return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'kb': return <BookOpenIcon className="w-5 h-5 text-amber-400" />;
      case 'version': return <ArrowPathIcon className="w-5 h-5 text-cyan-400" />;
      case 'export': return <ArrowDownTrayIcon className="w-5 h-5 text-teal-400" />;
      case 'user-story': return <ClipboardDocumentListIcon className="w-5 h-5 text-pink-400" />;
      default: return <DocumentIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  // Section icon
  const getSectionIcon = (icon: string) => {
    switch (icon) {
      case 'clipboard': return <ClipboardDocumentListIcon className="w-6 h-6 text-primary" />;
      case 'globe': return <ChartBarIcon className="w-6 h-6 text-primary" />;
      case 'chart': return <UserGroupIcon className="w-6 h-6 text-primary" />;
      default: return <DocumentIcon className="w-6 h-6 text-primary" />;
    }
  };

  // Time ago helper
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return `${Math.floor(seconds / 604800)} weeks ago`;
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => 
    taskFilter === 'all' || task.status === taskFilter
  );

  // Group tasks by status
  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    review: tasks.filter(t => t.status === 'review'),
    done: tasks.filter(t => t.status === 'done'),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab="projects" />

      {/* Header */}
      <header className="fixed top-20 left-0 right-0 z-40 glass-panel border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="h-16 px-6 flex items-center justify-between">
          {/* Left: Breadcrumb + Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-secondary-text)' }}>
              <button onClick={() => router.push('/home')} className="hover:text-[var(--color-primary)] transition-colors">
                Home
              </button>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <button 
                onClick={() => workspaceId ? router.push(`/workspace/${workspaceId}?name=${encodeURIComponent(workspaceName)}`) : router.back()} 
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                {workspaceName}
              </button>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {isEditingTitle ? (
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  autoFocus
                  className="font-medium bg-transparent border-b-2 border-[var(--color-primary)] focus:outline-none px-1"
                  style={{ color: 'var(--color-foreground)' }}
                />
              ) : (
                <button 
                  onClick={() => setIsEditingTitle(true)}
                  className="font-medium hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  {projectTitle}
                  <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(projectStatus)}`}>
              {projectStatus.replace('-', ' ')}
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowConfigModal(true)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Configuration"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              onClick={() => setShowSidePanel(!showSidePanel)}
              className={`p-2 rounded-lg transition-colors ${showSidePanel ? 'bg-white/20' : 'hover:bg-white/10'}`}
              title="Toggle Side Panel"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </button>
            <button 
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 rounded-lg gradient-bg text-white hover-glow font-medium text-sm"
            >
              Share
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 pt-36 flex">
        {/* Left Sidebar */}
        <aside 
          className={`fixed left-0 top-36 bottom-0 z-30 glass-panel border-r transition-all duration-300 overflow-hidden ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="h-full flex flex-col">
            {/* Collapse Toggle */}
            <div className="p-3 flex justify-end border-b" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              {!sidebarCollapsed && (
                <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-secondary-text)' }}>
                  Quick Actions
                </p>
              )}
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <span className="text-lg"><PlusIcon className="w-5 h-5 text-primary" /></span>
                  {!sidebarCollapsed && <span className="text-sm">New Research</span>}
                </button>
                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <span className="text-lg"><MagnifyingGlassIcon className="w-5 h-5 text-primary" /></span>
                  {!sidebarCollapsed && <span className="text-sm">Search Chats</span>}
                </button>
              </div>
            </div>

            {/* Menu Sections */}
            <div className="flex-1 overflow-y-auto p-3">
              {!sidebarCollapsed && (
                <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-secondary-text)' }}>
                  Workspace Tools
                </p>
              )}
              
              {SIDEBAR_MENU.map((menu) => (
                <div key={menu.id} className="mb-2">
                  <button
                    onClick={() => toggleMenu(menu.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{menu.icon}</span>
                      {!sidebarCollapsed && (
                        <span className="text-sm font-medium">{menu.title}</span>
                      )}
                    </div>
                    {!sidebarCollapsed && (
                      <svg 
                        className={`w-4 h-4 transition-transform ${expandedMenus.includes(menu.id) ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {!sidebarCollapsed && expandedMenus.includes(menu.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden ml-4"
                      >
                        {menu.items.map((item) => (
                          <button
                            key={item.id}
                            className="w-full flex items-center gap-2 p-2 pl-4 rounded-lg hover:bg-white/10 transition-colors text-sm"
                            style={{ color: 'var(--color-secondary-text)' }}
                          >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Project Management Section */}
              {!sidebarCollapsed && (
                <>
                  <p className="text-xs font-medium uppercase tracking-wider mt-4 mb-2" style={{ color: 'var(--color-secondary-text)' }}>
                    Project Management
                  </p>
                  {PROJECT_MANAGEMENT.map((item) => (
                    <button
                      key={item.id}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
                </>
              )}

              {/* Recent Conversations */}
              {!sidebarCollapsed && (
                <>
                  <p className="text-xs font-medium uppercase tracking-wider mt-4 mb-2" style={{ color: 'var(--color-secondary-text)' }}>
                    Recent Conversations
                  </p>
                  {MOCK_CONVERSATIONS.map((conv) => (
                    <button
                      key={conv.id}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
                    >
                      <span style={{ color: 'var(--color-foreground)' }}>{conv.title}</span>
                      <span className="text-xs" style={{ color: 'var(--color-secondary-text)' }}>{conv.date}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main 
          className={`flex-1 flex transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} ${showSidePanel ? 'mr-96' : ''}`}
        >
          {/* Research/Chat Area */}
          <div className="flex-1 flex flex-col h-[calc(100vh-144px)]">
            {/* Chat Messages / Research Output */}
            <div className="flex-1 overflow-y-auto p-6 relative z-10">
              {researchSections.length === 0 && messages.length === 0 && !isGenerating ? (
                /* Empty State */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <motion.div 
                    className="w-24 h-24 mb-8 rounded-full glass-panel flex items-center justify-center"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <LightBulbIcon className="w-12 h-12 text-primary" />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-4 gradient-text">Start your research</h3>
                  <p className="text-lg mb-8 max-w-md" style={{ color: 'var(--color-secondary-text)' }}>
                    Type your research query or use <span className="font-mono text-[var(--color-primary)]">/</span> commands
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center mb-8">
                    {['Market Analysis', 'Competitive Landscape', 'SWOT', 'Gap Analysis'].map((example) => (
                      <motion.button
                        key={example}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setInputValue(example);
                          inputRef.current?.focus();
                        }}
                        className="px-5 py-3 rounded-xl glass-card hover:bg-white/15 transition-colors text-sm font-medium"
                      >
                        {example}
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-secondary-text)' }}>
                    No messages yet. Start a conversation!
                  </p>
                </motion.div>
              ) : isGenerating ? (
                /* Generation Progress */
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-4">
                  <h2 className="text-2xl font-bold mb-6 gradient-text">Generating Research...</h2>
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: index <= currentStep ? 1 : 0.3, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 glass-card rounded-xl"
                    >
                      {index < currentStep ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      ) : index === currentStep ? (
                        <div className="w-6 h-6">
                          <svg className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2" style={{ borderColor: 'var(--color-border)' }} />
                      )}
                      <span className="font-medium">{step}</span>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                /* Chat Messages + Research Sections */
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Messages */}
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.role === 'user' ? '' : ''}`}>
                        <div
                          className={`px-5 py-4 rounded-2xl ${
                            message.role === 'user' 
                              ? 'gradient-bg text-white ml-auto' 
                              : 'glass-card'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                        <span className={`text-xs mt-1 block ${message.role === 'user' ? 'text-right' : ''}`} style={{ color: 'var(--color-secondary-text)' }}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Research Sections */}
                  {researchSections.length > 0 && (
                    <div className="space-y-4 mt-8">
                      <h2 className="text-2xl font-bold gradient-text">Research Results</h2>
                      {researchSections.map((section, index) => (
                        <motion.div
                          key={section.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="glass-card rounded-2xl overflow-hidden"
                        >
                          <button
                            onClick={() => {
                              setResearchSections(prev => prev.map(s => 
                                s.id === section.id ? { ...s, isExpanded: !s.isExpanded } : s
                              ));
                            }}
                            className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {getSectionIcon(section.icon)}
                              <h3 className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>
                                {section.title}
                              </h3>
                              {section.version && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                                  v{section.version}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setShowCreateTaskModal(true); }}
                                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                                title="Create Task"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setShowKBModal(true); }}
                                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                                title="Add to KB"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </button>
                              <svg 
                                className={`w-5 h-5 transition-transform ${section.isExpanded !== false ? 'rotate-180' : ''}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </button>
                          <AnimatePresence>
                            {section.isExpanded !== false && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5 pt-0">
                                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-secondary-text)' }}>
                                    {section.content}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t glass-panel relative" style={{ borderColor: 'var(--color-border)' }}>
              <div ref={chatInputContainerRef} className="max-w-4xl mx-auto relative">
                {/* Input Area */}
                <div className="glass-card rounded-xl flex items-end gap-2 p-3">
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Attach file">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>

                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything or type / for commands..."
                    rows={1}
                    className="flex-1 bg-transparent resize-none focus:outline-none py-2 max-h-32 overflow-y-auto text-sm"
                    style={{ color: 'var(--color-foreground)' }}
                  />

                  <motion.button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-xl gradient-bg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </motion.button>
                </div>

                <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--color-secondary-text)' }}>
                  <span>Press Enter to send or / for commands</span>
                  <span>{inputValue.length} characters</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Side Panel */}
        <AnimatePresence>
          {showSidePanel && (
            <motion.aside
              initial={{ x: 384, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 384, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-36 bottom-0 w-96 glass-panel border-l border-[var(--color-border)] z-30 flex flex-col"
            >
              {/* Tab Navigation */}
              <div className="flex border-b border-[var(--color-border)]">
                {(['tasks', 'versions', 'activity', 'more'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSidePanelTab(tab)}
                    className={`flex-1 py-3 text-sm font-medium capitalize transition-colors relative ${
                      sidePanelTab === tab ? 'text-[var(--color-primary)]' : 'text-[var(--color-secondary-text)] hover:text-[var(--color-foreground)]'
                    }`}
                  >
                    {tab}
                    {sidePanelTab === tab && (
                      <motion.div
                        layoutId="activePanelTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 gradient-bg"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {sidePanelTab === 'tasks' && (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">Tasks</h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateTaskModal(true)}
                        className="px-3 py-1.5 rounded-lg gradient-bg text-white text-sm font-medium"
                      >
                        + New Task
                      </motion.button>
                    </div>

                    {/* Filter */}
                    <div className="flex gap-2 flex-wrap">
                      {(['all', 'todo', 'in-progress', 'review', 'done'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setTaskFilter(filter)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            taskFilter === filter 
                              ? 'gradient-bg text-white' 
                              : 'glass-card hover:bg-white/10'
                          }`}
                        >
                          {filter === 'all' ? 'All' : filter.replace('-', ' ')}
                        </button>
                      ))}
                    </div>

                    {/* Kanban Columns */}
                    <div className="space-y-4">
                      {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                        <div key={status}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-secondary-text)' }}>
                              {status.replace('-', ' ')} ({statusTasks.length})
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {statusTasks.map((task) => (
                              <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card rounded-xl p-3"
                              >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                    {task.priority.toUpperCase()}
                                  </span>
                                </div>
                                <h5 className="font-medium text-sm mb-2">{task.title}</h5>
                                {task.linkedSection && (
                                  <p className="text-xs mb-2" style={{ color: 'var(--color-secondary-text)' }}>
                                    Linked: {task.linkedSection}
                                  </p>
                                )}
                                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-secondary-text)' }}>
                                  <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" /> {task.assignee}</span>
                                  <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {task.deadline}</span>
                                </div>
                                {task.progress !== undefined && (
                                  <div className="mt-2">
                                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                                      <div 
                                        className="h-full gradient-bg transition-all duration-500"
                                        style={{ width: `${task.progress}%` }}
                                      />
                                    </div>
                                    <span className="text-xs mt-1 block" style={{ color: 'var(--color-secondary-text)' }}>
                                      {task.progress}%
                                    </span>
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sidePanelTab === 'versions' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">Versions</h3>
                      <button className="px-3 py-1.5 rounded-lg glass-card text-sm font-medium hover:bg-white/10">
                        + Create Version
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {versions.map((version) => (
                        <div key={version.id} className="glass-card rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {version.isCurrent && (
                              <CheckCircleIcon className="w-4 h-4 text-green-400" />
                            )}
                            <span className="font-bold">{version.version}</span>
                            {version.isCurrent && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-xs mb-2" style={{ color: 'var(--color-secondary-text)' }}>
                            {version.timestamp.toLocaleDateString()} at {version.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-sm mb-3">{version.description}</p>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 rounded text-xs glass-card hover:bg-white/10">View</button>
                            <button className="px-3 py-1 rounded text-xs glass-card hover:bg-white/10">Compare</button>
                            {!version.isCurrent && (
                              <button className="px-3 py-1 rounded text-xs glass-card hover:bg-white/10">Restore</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sidePanelTab === 'activity' && (
                  <div className="space-y-4">
                    <h3 className="font-bold">Activity</h3>
                    <div className="space-y-3">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex gap-3">
                          <span className="text-xl">{getActivityIcon(activity.type)}</span>
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{activity.title}</h5>
                            <p className="text-xs" style={{ color: 'var(--color-secondary-text)' }}>
                              {activity.description}
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--color-secondary-text)' }}>
                              {getTimeAgo(activity.timestamp)} · {activity.user}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sidePanelTab === 'more' && (
                  <div className="space-y-4">
                    <h3 className="font-bold">More Options</h3>
                    <div className="space-y-2">
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl glass-card hover:bg-white/10 transition-colors">
                        <ChartBarIcon className="w-5 h-5 text-primary" />
                        <span className="text-sm">Analytics</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl glass-card hover:bg-white/10 transition-colors">
                        <LinkIcon className="w-5 h-5 text-primary" />
                        <span className="text-sm">Integrations</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl glass-card hover:bg-white/10 transition-colors">
                        <Cog6ToothIcon className="w-5 h-5 text-primary" />
                        <span className="text-sm">Settings</span>
                      </button>
                      <button 
                        onClick={() => setShowExportModal(true)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl glass-card hover:bg-white/10 transition-colors"
                      >
                        <ArrowUpTrayIcon className="w-5 h-5 text-primary" />
                        <span className="text-sm">Export Research</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <ConfigurationModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onSave={handleConfigSave}
        existingConfig={researchConfig}
      />
      
      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        onSave={(task) => {
          setTasks([...tasks, { ...task, id: Date.now().toString() }]);
          setShowCreateTaskModal(false);
        }}
        sections={researchSections}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      {/* Command Palette - Rendered at root level for proper z-index stacking */}
      <AnimatePresence>
        {showCommandPalette && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[9998]"
              onClick={() => setShowCommandPalette(false)}
            />
            {/* Command palette panel - positioned relative to chat input container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed rounded-xl overflow-hidden max-h-80 overflow-y-auto z-[9999]"
              style={{ 
                backgroundColor: '#1a1a2e',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                // Position relative to the chat input container
                left: `${commandPalettePosition.left}px`,
                bottom: `${commandPalettePosition.bottom}px`,
                width: `${commandPalettePosition.width}px`,
              }}
            >
              {Object.entries(groupedCommands).map(([category, commands]) => (
                <div key={category}>
                  <div 
                    className="px-4 py-2 text-xs font-medium uppercase tracking-wider sticky top-0"
                    style={{ color: '#B8B8D0', backgroundColor: '#1a1a2e' }}
                  >
                    {category}
                  </div>
                  {commands.map((cmd) => {
                    const globalIndex = filteredCommands.findIndex(c => c.id === cmd.id);
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => selectCommand(cmd.command)}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors hover:bg-white/10"
                        style={{ 
                          backgroundColor: globalIndex === selectedCommandIndex ? 'rgba(124, 58, 237, 0.25)' : 'transparent'
                        }}
                      >
                        <span className="text-xl">{cmd.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm" style={{ color: '#F5F5FA' }}>
                            {cmd.command}
                          </div>
                          <div className="text-xs" style={{ color: '#B8B8D0' }}>
                            {cmd.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Configuration Modal Component
function ConfigurationModal({
  isOpen,
  onClose,
  onSave,
  existingConfig,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: ResearchConfig) => void;
  existingConfig: ResearchConfig | null;
}) {
  const [industry, setIndustry] = useState(existingConfig?.industry || '');
  const [geography, setGeography] = useState(existingConfig?.geography || '');
  const [depth, setDepth] = useState<'Quick' | 'Standard' | 'Deep'>(existingConfig?.depth || 'Standard');

  const industries = [
    'Financial Services',
    'Healthcare',
    'Technology',
    'Retail & E-commerce',
    'Manufacturing',
    'Education',
    'Real Estate',
    'Energy & Utilities',
    'Telecommunications',
  ];

  const geographies = [
    'Global',
    'North America',
    'Europe',
    'Asia-Pacific',
    'Latin America',
    'Middle East & Africa',
    'India',
    'United States',
    'China',
  ];

  const depthOptions = [
    { value: 'Quick', duration: '10-15 min', description: 'High-level overview\nKey insights only' },
    { value: 'Standard', duration: '20-30 min', description: 'Comprehensive analysis\nDetailed sections' },
    { value: 'Deep', duration: '45+ min', description: 'In-depth research\nCitations & sources' },
  ];

  const handleSave = () => {
    if (industry && geography && depth) {
      onSave({ industry, geography, depth });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl rounded-2xl p-8"
        style={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Configure Research Parameters</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6" style={{ color: '#6B6B85' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Industry Selection */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D44' }}>
              Select Industry*
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              style={{ 
                color: '#2D2D44',
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}
            >
              <option value="">Choose an industry</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Geography */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D44' }}>
              Target Geography*
            </label>
            <select
              value={geography}
              onChange={(e) => setGeography(e.target.value)}
              className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              style={{ 
                color: '#2D2D44',
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}
            >
              <option value="">Choose a geography</option>
              {geographies.map((geo) => (
                <option key={geo} value={geo}>
                  {geo}
                </option>
              ))}
            </select>
          </div>

          {/* Research Depth */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: '#2D2D44' }}>
              Research Depth*
            </label>
            <div className="grid grid-cols-3 gap-4">
              {depthOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDepth(option.value as 'Quick' | 'Standard' | 'Deep')}
                  className={`p-4 rounded-xl text-left transition-all ${
                    depth === option.value
                      ? 'gradient-bg text-white shadow-lg'
                      : 'hover:bg-gray-100'
                  }`}
                  style={depth !== option.value ? { 
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(0, 0, 0, 0.1)'
                  } : {}}
                >
                  <div className="font-bold mb-1">{option.value}</div>
                  <div className={`text-xs mb-2 ${depth === option.value ? 'text-white/80' : ''}`} style={depth !== option.value ? { color: '#6B6B85' } : {}}>
                    {option.duration}
                  </div>
                  <div className={`text-xs whitespace-pre-line ${depth === option.value ? 'text-white/70' : ''}`} style={depth !== option.value ? { color: '#6B6B85' } : {}}>
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
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
            onClick={handleSave}
            disabled={!industry || !geography || !depth}
            className="flex-1 px-6 py-3 rounded-xl font-medium text-white gradient-bg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {existingConfig ? 'Update Research' : 'Save'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Create Task Modal Component
function CreateTaskModal({
  isOpen,
  onClose,
  onSave,
  sections,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  sections: ResearchSection[];
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [assignee, setAssignee] = useState('');
  const [deadline, setDeadline] = useState('');
  const [linkedSection, setLinkedSection] = useState('');

  const handleSubmit = () => {
    if (title.trim()) {
      onSave({
        title,
        description,
        priority,
        assignee: assignee || 'Unassigned',
        deadline: deadline || 'No deadline',
        linkedSection,
        status: 'todo',
        progress: 0,
      });
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setAssignee('');
      setDeadline('');
      setLinkedSection('');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg rounded-2xl p-6"
        style={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold gradient-text">Create Task</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" style={{ color: '#6B6B85' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D44' }}>Title*</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              style={{ 
                color: '#2D2D44',
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D44' }}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
              style={{ 
                color: '#2D2D44',
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D44' }}>Assign to</label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                style={{ 
                  color: '#2D2D44',
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(0, 0, 0, 0.1)'
                }}
              >
                <option value="">Select assignee</option>
                <option value="Alice">Alice</option>
                <option value="Bob">Bob</option>
                <option value="Carol">Carol</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D44' }}>Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                style={{ 
                  color: '#2D2D44',
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(0, 0, 0, 0.1)'
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D44' }}>Priority</label>
            <div className="flex gap-3">
              {(['high', 'medium', 'low'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    priority === p
                      ? p === 'high' ? 'bg-red-500/30 text-red-600 border border-red-500/50'
                        : p === 'medium' ? 'bg-orange-500/30 text-orange-600 border border-orange-500/50'
                        : 'bg-green-500/30 text-green-600 border border-green-500/50'
                      : 'hover:bg-gray-100'
                  }`}
                  style={priority !== p ? { 
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    color: '#2D2D44'
                  } : {}}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {sections.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D44' }}>Linked Section</label>
              <select
                value={linkedSection}
                onChange={(e) => setLinkedSection(e.target.value)}
                className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                style={{ 
                  color: '#2D2D44',
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(0, 0, 0, 0.1)'
                }}
              >
                <option value="">Select section</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
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
            disabled={!title.trim()}
            className="flex-1 px-6 py-3 rounded-xl font-medium text-white gradient-bg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Create Task
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Share Modal Component
function ShareModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [shareLink] = useState('https://req-assist.com/share/abc123');
  const [copied, setCopied] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [permission, setPermission] = useState<'view' | 'edit' | 'comment'>('view');

  const users = [
    { id: '1', name: 'Alice Johnson', email: 'alice@company.com' },
    { id: '2', name: 'Bob Smith', email: 'bob@company.com' },
    { id: '3', name: 'Carol Davis', email: 'carol@company.com' },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-2xl p-6"
        style={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold gradient-text">Share Research</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" style={{ color: '#6B6B85' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D44' }}>Team Members</label>
            <div className="space-y-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    selectedUsers.includes(user.id) ? 'bg-purple-100' : 'hover:bg-gray-100'
                  }`}
                  style={{
                    background: selectedUsers.includes(user.id) ? 'rgba(147, 51, 234, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedUsers.includes(user.id) ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-gray-400'
                  }`}>
                    {selectedUsers.includes(user.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium" style={{ color: '#2D2D44' }}>{user.name}</p>
                    <p className="text-xs" style={{ color: '#6B6B85' }}>{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D44' }}>Or share via link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-4 py-2 rounded-lg text-sm"
                style={{ 
                  color: '#2D2D44',
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(0, 0, 0, 0.1)'
                }}
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  color: '#2D2D44'
                }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D44' }}>Permission Level</label>
            <div className="flex gap-2">
              {(['view', 'edit', 'comment'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPermission(p)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    permission === p ? 'gradient-bg text-white' : 'hover:bg-gray-100'
                  }`}
                  style={permission !== p ? {
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    color: '#2D2D44'
                  } : {}}
                >
                  Can {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
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
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl font-medium text-white gradient-bg hover:shadow-lg transition-all"
          >
            Share
          </button>
        </div>
      </motion.div>
    </div>
  );
}
