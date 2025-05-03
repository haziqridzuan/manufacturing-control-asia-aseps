
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  Package, 
  Users, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Gauge,
  Map
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { 
      name: 'Dashboard', 
      icon: <Gauge className="h-5 w-5" />, 
      path: '/' 
    },
    { 
      name: 'Projects', 
      icon: <Package className="h-5 w-5" />, 
      path: '/projects' 
    },
    { 
      name: 'Suppliers', 
      icon: <Users className="h-5 w-5" />, 
      path: '/suppliers' 
    },
    { 
      name: 'Timeline', 
      icon: <Calendar className="h-5 w-5" />, 
      path: '/timeline' 
    },
    { 
      name: 'Global Map', 
      icon: <Map className="h-5 w-5" />, 
      path: '/map' 
    },
    { 
      name: 'Analytics', 
      icon: <BarChart className="h-5 w-5" />, 
      path: '/analytics' 
    }
  ];
  
  return (
    <div 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border transition-all duration-300 bg-background",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col py-4">
        <div className="flex items-center justify-between px-4 mb-6">
          {!collapsed && (
            <h2 className="text-xl font-bold">Fab Tracker</h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-md p-1.5 hover:bg-accent"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center rounded-md px-2 py-3 hover:bg-accent",
                  location.pathname === item.path && "bg-accent",
                )}
              >
                <span className="flex items-center justify-center">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
