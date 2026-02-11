'use client';
import { useState } from 'react';
 import Icon from'@/components/ui/AppIcon';

interface Section {
  id: string
  title: string
  content: string
  isExpanded: boolean
}

export default function ResearchOutput() {
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      title: 'Executive Summary',
      content: 'The B2B SaaS market in 2026 shows strong growth potential with a projected CAGR of 18.2%. Key drivers include increased cloud adoption, remote work infrastructure, and AI integration. Market size is estimated at $195B globally, with North America leading at 42% market share.',
      isExpanded: true,
    },
    {
      id: '2',
      title: 'Market Overview',
      content: 'The global SaaS market has experienced accelerated growth post-2024, driven by digital transformation initiatives across industries. Major segments include CRM (23%), ERP (19%), collaboration tools (15%), and analytics platforms (12%). Enterprise adoption has increased by 34% year-over-year.',
      isExpanded: false,
    },
    {
      id: '3',
      title: 'TAM / SAM / SOM',
      content: 'Total Addressable Market (TAM): $285B globally. Serviceable Available Market (SAM): $142B for mid-market and enterprise segments. Serviceable Obtainable Market (SOM): $8.5B achievable within 3 years with current resources and competitive positioning.',
      isExpanded: false,
    },
    {
      id: '4',
      title: 'Competitive Landscape',
      content: 'Top 5 competitors: Salesforce (18% market share), Microsoft 365 (15%), Adobe Experience Cloud (12%), SAP (10%), Oracle Cloud (9%). Emerging players include Notion, Airtable, and Monday.com, capturing the collaborative work management niche with innovative UX.',
      isExpanded: false,
    },
    {
      id: '5',
      title: 'SWOT Analysis',
      content: 'Strengths: Strong product-market fit, scalable infrastructure, recurring revenue model. Weaknesses: High customer acquisition cost, limited brand recognition. Opportunities: AI integration, vertical-specific solutions, international expansion. Threats: Market saturation, price competition, economic downturn.',
      isExpanded: false,
    },
    {
      id: '6',
      title: 'Gap Analysis',
      content: 'Key market gaps identified: 1) AI-powered workflow automation for non-technical users, 2) Industry-specific compliance solutions, 3) Real-time collaboration with advanced security, 4) Integrated analyticsfor decision-making, 5) Mobile-first experience for field teams. These gaps represent significant opportunities for differentiation and market capture.',
      isExpanded: false,
    },
    {
      id: '7',
      title: 'Risks',
      content: 'Primary risks include: Data security breaches (high impact, medium probability), regulatory compliance changes (medium impact, high probability), technology disruption from AI-native competitors (high impact, medium probability), economic recession affecting B2B spending (high impact, low probability), and talent acquisition challenges (medium impact, high probability).',
      isExpanded: false,
    },
    {
      id: '8',
      title: 'Recommendations',
      content: '1) Prioritize AI integration for competitive differentiation. 2) Develop industry-specific solutions for healthcare and finance. 3) Implement usage-based pricing to lower entry barriers. 4) Expand partner ecosystem for distribution. 5) Invest in customer success to reduce churn. 6) Focus on mobile experience for field workforce segments.',
      isExpanded: false,
    },
  ])

  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const toggleSection = (id: string) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, isExpanded: !section.isExpanded } : section
    ))
  }

  const startEditing = (section: Section) => {
    setEditingSection(section.id)
    setEditContent(section.content)
  }

  const saveEdit = (id: string) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, content: editContent } : section
    ))
    setEditingSection(null)
    setEditContent('')
  }

  const cancelEdit = () => {
    setEditingSection(null)
    setEditContent('')
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <Icon name="DocumentTextIcon" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Market Research Report
            </h3>
            <p className="text-sm text-muted-foreground">
              Generated {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors text-sm font-medium">
            <Icon name="ArrowDownTrayIcon" size={16} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover-lift transition-all text-sm font-medium">
            <Icon name="BookmarkIcon" size={16} />
            Save
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="glass-panel rounded-xl overflow-hidden animate-fade-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  {index + 1}
                </span>
                <h4 className="text-base font-semibold text-foreground">
                  {section.title}
                </h4>
              </div>
              <Icon
                name="ChevronDownIcon"
                size={20}
                className={`text-muted-foreground transition-transform ${
                  section.isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Section Content */}
            {section.isExpanded && (
              <div className="px-4 pb-4 border-t border-border">
                {editingSection === section.id ? (
                  <div className="space-y-3 mt-4">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground focus-ring transition-all resize-none"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => saveEdit(section.id)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover-lift transition-all text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 mt-4">
                    <p className="text-sm text-foreground leading-relaxed">
                      {section.content}
                    </p>
                    <button
                      onClick={() => startEditing(section)}
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      <Icon name="PencilIcon" size={16} />
                      Edit Section
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}