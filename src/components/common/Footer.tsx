import Link from 'next/link';

export default function Footer() {
  const currentYear = 2026

  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Logo & Copyright */}
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-foreground">
              ResearchHub
            </span>
            <span className="text-sm text-muted-foreground">
              © {currentYear} All rights reserved
            </span>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/support"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}