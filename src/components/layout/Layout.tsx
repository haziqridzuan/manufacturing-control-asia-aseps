
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
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
