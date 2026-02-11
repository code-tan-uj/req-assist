'use client';
import { useEffect } from 'react';

 import Header from'@/components/common/Header';
 import Footer from'@/components/common/Footer';
 import ProjectSidebar from'./components/ProjectSidebar';
 import ProjectMain from'./components/ProjectMain';

export default function ProjectCreationPage() {
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
      
      <div className="flex-1 pt-20 flex">
        {/* Sidebar */}
        <ProjectSidebar />

        {/* Main Content */}
        <ProjectMain />
      </div>

      <Footer />
    </div>
  )
}