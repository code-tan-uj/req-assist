'use client';

import { useParams, useRouter } from 'next/navigation';
import { useKB } from '@/lib/kb-store';
import { BookOpenIcon, ArrowLeftIcon, Cog6ToothIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function KBDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getKBItem } = useKB();
  const [kbItem, setKBItem] = useState<ReturnType<typeof getKBItem>>();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (params.id) {
      const item = getKBItem(params.id as string);
      setKBItem(item);
    }
  }, [params.id, getKBItem]);

  const handleDownload = () => {
    if (!kbItem) return;

    // Create a text representation of the KB item
    const content = `
${kbItem.applicationName}
${kbItem.categoryDomain ? `Category: ${kbItem.categoryDomain}` : ''}
${kbItem.moduleSubDomain ? `Module: ${kbItem.moduleSubDomain}` : ''}
${kbItem.functionalComponent ? `Component: ${kbItem.functionalComponent}` : ''}

OVERVIEW
${kbItem.sections.overview || 'This component provides a comprehensive solution for managing and tracking key business processes...'}

FUNCTIONAL REQUIREMENTS
${kbItem.sections.functionalRequirements || 'User Management, Data Processing, Reporting & Analytics...'}

TECHNICAL DETAILS
${kbItem.sections.technicalDetails || 'Architecture, Technology Stack, Security Measures...'}

BUSINESS RULES
${kbItem.sections.businessRules || 'Data Retention, Approval Workflows, Access Control...'}

---
Added: ${new Date(kbItem.timestamp).toLocaleDateString()} at ${new Date(kbItem.timestamp).toLocaleTimeString()}
    `.trim();

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${kbItem.applicationName.replace(/\s+/g, '_')}_KB.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('KB document downloaded successfully!');
  };

  if (!kbItem) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <BookOpenIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-secondary-text)' }} />
          <p className="text-lg" style={{ color: 'var(--color-secondary-text)' }}>KB item not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: 'var(--color-text)' }}
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 flex-1">
              <BookOpenIcon className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                  {kbItem.applicationName}
                </h1>
                {kbItem.categoryDomain && (
                  <div className="flex gap-2 mt-1 text-sm" style={{ color: 'var(--color-secondary-text)' }}>
                    <span>{kbItem.categoryDomain}</span>
                    {kbItem.moduleSubDomain && (
                      <>
                        <span>•</span>
                        <span>{kbItem.moduleSubDomain}</span>
                      </>
                    )}
                    {kbItem.functionalComponent && (
                      <>
                        <span>•</span>
                        <span>{kbItem.functionalComponent}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: 'var(--color-text)' }}
                title="Settings"
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white"
                style={{ background: 'linear-gradient(135deg, #9d7cc4 0%, #c4a0e8 50%, #e8c4f0 100%)' }}
                title="Download KB Document"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="rounded-xl p-8 space-y-8" style={{ background: 'var(--color-surface)' }}>
          {/* Overview Section */}
          <section>
            <h2
              className="text-2xl font-bold mb-4 pb-2 border-b"
              style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
            >
              Overview
            </h2>
            <div
              className="prose prose-sm max-w-none"
              style={{ color: 'var(--color-text)' }}
            >
              <p className="leading-relaxed">
                {kbItem.sections.overview || 'This component provides a comprehensive solution for managing and tracking key business processes. It enables users to efficiently handle operations through an intuitive interface while maintaining robust data integrity and security measures. The system is designed to scale with organizational needs and integrate seamlessly with existing infrastructure.'}
              </p>
            </div>
          </section>

          {/* Functional Requirements Section */}
          <section>
            <h2
              className="text-2xl font-bold mb-4 pb-2 border-b"
              style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
            >
              Functional Requirements
            </h2>
            <div
              className="prose prose-sm max-w-none"
              style={{ color: 'var(--color-text)' }}
            >
              {kbItem.sections.functionalRequirements || (
                <ul className="space-y-2">
                  <li>
                    <strong>User Management:</strong> The system must support role-based access control with configurable permissions for different user types including administrators, managers, and standard users.
                  </li>
                  <li>
                    <strong>Data Processing:</strong> Support for batch and real-time data processing with validation rules, error handling, and comprehensive audit logging for compliance requirements.
                  </li>
                  <li>
                    <strong>Reporting & Analytics:</strong> Generate customizable reports with export capabilities in multiple formats (PDF, Excel, CSV). Include dashboard visualizations for key metrics and trends.
                  </li>
                  <li>
                    <strong>Integration Capabilities:</strong> RESTful API endpoints for third-party integrations with authentication, rate limiting, and comprehensive documentation.
                  </li>
                  <li>
                    <strong>Notification System:</strong> Multi-channel notification support (email, SMS, in-app) with customizable templates and delivery scheduling options.
                  </li>
                </ul>
              )}
            </div>
          </section>

          {/* Technical Details Section */}
          <section>
            <h2
              className="text-2xl font-bold mb-4 pb-2 border-b"
              style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
            >
              Technical Details
            </h2>
            <div
              className="prose prose-sm max-w-none"
              style={{ color: 'var(--color-text)' }}
            >
              {kbItem.sections.technicalDetails || (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Architecture</h3>
                    <p>Built on a microservices architecture utilizing containerization for scalability and deployment flexibility. Implements event-driven patterns for asynchronous processing and maintains service independence.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Technology Stack</h3>
                    <ul>
                      <li>Frontend: React/Next.js with TypeScript for type safety</li>
                      <li>Backend: Node.js with Express framework</li>
                      <li>Database: PostgreSQL for relational data, Redis for caching</li>
                      <li>Infrastructure: Docker containers orchestrated with Kubernetes</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Security Measures</h3>
                    <p>Implements industry-standard security protocols including OAuth 2.0 for authentication, AES-256 encryption for data at rest, TLS 1.3 for data in transit, and regular security audits and penetration testing.</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Business Rules Section */}
          <section>
            <h2
              className="text-2xl font-bold mb-4 pb-2 border-b"
              style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
            >
              Business Rules
            </h2>
            <div
              className="prose prose-sm max-w-none"
              style={{ color: 'var(--color-text)' }}
            >
              {kbItem.sections.businessRules || (
                <ul className="space-y-2">
                  <li>
                    <strong>Data Retention:</strong> All transaction records must be retained for a minimum of 7 years in compliance with regulatory requirements. Archived data must remain accessible for audit purposes.
                  </li>
                  <li>
                    <strong>Approval Workflows:</strong> Transactions exceeding $10,000 require dual authorization. Critical operations must go through a multi-level approval process with complete audit trail.
                  </li>
                  <li>
                    <strong>Access Control:</strong> User access must be reviewed quarterly. Inactive accounts are automatically disabled after 90 days. All privileged access requires justification and time-bound approval.
                  </li>
                  <li>
                    <strong>Data Quality:</strong> All data inputs must pass validation checks before processing. Duplicate detection algorithms run automatically to maintain data integrity.
                  </li>
                  <li>
                    <strong>Service Level:</strong> The system must maintain 99.9% uptime with automatic failover capabilities. Maximum response time for critical operations should not exceed 3 seconds.
                  </li>
                </ul>
              )}
            </div>
          </section>

          {/* Metadata Footer */}
          <div className="pt-6 mt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between text-sm" style={{ color: 'var(--color-secondary-text)' }}>
              <span>Added: {new Date(kbItem.timestamp).toLocaleDateString()} at {new Date(kbItem.timestamp).toLocaleTimeString()}</span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  Knowledge Base
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
