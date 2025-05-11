
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  Calendar,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  Home,
  Package,
  Settings,
  TrendingUp,
  Truck,
  Users
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Always collapse on mobile
  const isExpanded = isMobile ? false : expanded;
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  const links = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Projects", path: "/projects", icon: Package },
    { name: "Suppliers", path: "/suppliers", icon: Truck },
    { name: "Timeline", path: "/timeline", icon: Calendar },
    { name: "Analytics", path: "/analytics", icon: TrendingUp },
    { name: "External Links", path: "/external-links", icon: ExternalLink },
    { name: "Admin", path: "/admin", icon: Settings },
  ];
  
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <div 
      className={cn(
        "flex flex-col border-r h-screen sticky top-0 bg-background transition-all duration-300",
        isExpanded ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b flex items-center justify-between h-16">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
            {/* Logo initiial */}
            A
          </div>
          {isExpanded && (
            <span className="ml-3 font-semibold text-xl"></span>
          )}
        </div>
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={toggleSidebar}
          >
            {isExpanded ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
          </Button>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {links.map(link => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center py-2 px-3 rounded-md text-sm font-medium",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    !isExpanded && "justify-center"
                  )
                }
              >
                <link.icon className="h-5 w-5" />
                {isExpanded && <span className="ml-3">{link.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          size={isExpanded ? "default" : "icon"}
          onClick={() => navigate("/admin")}
          className={cn(
            "w-full flex items-center justify-center",
            isExpanded ? "justify-start" : "justify-center"
          )}
        >
          <div className="h-5 w-5 rounded-full bg-muted-foreground/20 flex items-center justify-center text-muted-foreground">
            <Users className="h-3 w-3" />
          </div>
          {isExpanded && <span className="ml-2">Admin</span>}
        </Button>
      </div>
    </div>
  );
}
