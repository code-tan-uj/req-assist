'use client';
import { useEffect } from 'react';

 import Header from'@/components/common/Header';
 import Footer from'@/components/common/Footer';
 import SearchConsole from'./components/SearchConsole';
 import WorkspaceList from'./components/WorkspaceList';

export default function WorkspacePage() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    if (!reveals.length) return
    
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    )
    reveals.forEach(el => observer.observe(el))
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        {/* Search Console */}
        <section className="max-w-4xl mx-auto px-6 py-12 reveal">
          <SearchConsole />
        </section>

        {/* Workspace List */}
        <section className="max-w-7xl mx-auto px-6 py-12 reveal">
          <WorkspaceList />
        </section>
      </main>

      <Footer />
    </div>
  )
}