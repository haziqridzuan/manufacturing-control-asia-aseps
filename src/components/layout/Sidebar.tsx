
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { AreaChart, Home, CalendarDays, Users, Settings, Package, Link2 } from 'lucide-react';

const Sidebar = () => {
  const isMobile = useIsMobile();
  
  const links = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/',
    },
    {
      title: 'Projects',
      icon: Package,
      href: '/projects',
    },
    {
      title: 'Suppliers',
      icon: Users,
      href: '/suppliers',
    },
    {
      title: 'Timeline',
      icon: CalendarDays,
      href: '/timeline',
    },
    {
      title: 'Analytics',
      icon: AreaChart,
      href: '/analytics',
    },
    {
      title: 'External Links',
      icon: Link2,
      href: '/external-links',
    },
    {
      title: 'Admin',
      icon: Settings,
      href: '/admin',
    },
  ];
  
  return (
    <div
      className={cn(
        'fixed left-0 top-0 h-full z-40 border-r transition-all duration-300',
        'dark:bg-slate-800 dark:border-slate-700',
        isMobile ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex flex-col h-full bg-white dark:bg-slate-800">
        {/* Logo */}
        <div className={cn(
          'py-4 border-b flex justify-center items-center',
          'dark:border-slate-700',
          isMobile ? 'px-2' : 'px-6',
        )}>
          <span className={cn(
            'text-xl font-bold dark:text-white',
            isMobile && 'hidden',
          )}>
            ASEPS Asia
          </span>
          {isMobile && (
            <span className="text-xl font-bold dark:text-white">A</span>
          )}
        </div>
        
        {/* Navigation */}
        <div className="flex flex-col flex-1 p-2 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) => cn(
                'flex items-center rounded-md py-2 transition-colors hover:bg-muted',
                'dark:hover:bg-slate-700 dark:text-slate-300',
                isActive ? 'bg-muted text-primary dark:bg-slate-700 dark:text-white' : 'text-muted-foreground hover:text-primary dark:hover:text-white',
                isMobile ? 'justify-center px-2' : 'px-3',
              )}
            >
              <link.icon className={cn('h-5 w-5', !isMobile && 'mr-3')} />
              {!isMobile && <span>{link.title}</span>}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
