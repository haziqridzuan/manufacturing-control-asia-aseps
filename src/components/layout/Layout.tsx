
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="pl-16 lg:pl-64 pt-4">
        <main className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">ASEPS Asia Manufacturing Tracker</h1>
            <img 
              src="https://www.actemium-mixing-process.com/media/websites/actemium-mixing/img/actemium-logo-baseline.png" 
              alt="ASEPS Asia Logo" 
              className="h-8" 
            />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
