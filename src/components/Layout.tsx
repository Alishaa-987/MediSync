
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import FadeIn from './animations/FadeIn';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after the initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        {user && (
          <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        )}
        
        <main 
          className={cn(
            "flex-1 transition-all duration-300 min-h-[calc(100vh-4rem)]",
            user && !sidebarCollapsed ? "md:pl-64" : user ? "md:pl-20" : ""
          )}
        >
          {mounted && (
            <FadeIn className="w-full h-full p-4 md:p-6 lg:p-8">
              <Outlet />
            </FadeIn>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;
