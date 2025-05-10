
import { ReactNode, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    // Check if user has a preference stored
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);
  
  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);
  
  const toggleDarkMode = () => setDarkMode(!darkMode);
  
  return (
    <div className={cn(
      "min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden",
      darkMode ? "dark" : ""
    )}>
      {/* Background image with animation */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5 dark:opacity-10 animate-float">
        <img 
          src="/lovable-uploads/44861a8d-b1c8-452d-b8f6-fbc0e9b4dc3d.png" 
          alt="" 
          className="absolute w-full h-full object-contain" 
          style={{ 
            transform: "scale(1.5)",
            filter: "blur(5px)"
          }}
        />
      </div>
      
      <Sidebar />
      <div className="pl-16 lg:pl-64 pt-4 relative z-10">
        <main className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold dark:text-white">ASEPS Asia Manufacturing Tracker</h1>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleDarkMode}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="rounded-full"
              >
                {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
              </Button>
              <img 
                src="https://www.actemium-mixing-process.com/media/websites/actemium-mixing/img/actemium-logo-baseline.png" 
                alt="Actemium Logo" 
                className="h-8" 
              />
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
