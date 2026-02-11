'use client';
import Link from'next/link';
import { usePathname } from 'next/navigation';
 import Icon from'@/components/ui/AppIcon';

export default function Header() {
  const pathname = usePathname()

  const navLinks = [
    { href: '/workspace', label: 'Workspace' },
    { href: '/project-creation', label: 'Projects' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/workspace" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Icon name="BeakerIcon" size={24} className="text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground tracking-tight">
                ResearchHub
              </span>
              <span className="text-xs text-muted-foreground">
                AI Research Platform
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}