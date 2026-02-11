import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/index.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Req-Assist - AI Research Platform',
  description: 'AI-powered research platform for structured insights and workspace management',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--color-card)',
                backdropFilter: 'blur(20px)',
                color: 'var(--color-foreground)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-glass)',
                borderRadius: '16px',
                padding: '16px',
              },
              success: {
                iconTheme: {
                  primary: 'var(--color-success)',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: 'var(--color-destructive)',
                  secondary: 'white',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
