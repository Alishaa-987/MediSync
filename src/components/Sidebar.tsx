
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  CreditCard, 
  PieChart, 
  Settings, 
  Pill, 
  Stethoscope, 
  Menu, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/context/AuthContext';
import { hasPermission } from '@/lib/permissions';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ElementType;
  permission: keyof typeof rolePermissions[keyof typeof rolePermissions];
}

import { rolePermissions } from '@/lib/permissions';

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // If no user, don't render the sidebar
  if (!user) return null;

  const menuItems: MenuItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: Home, permission: 'canViewAllPatients' },
    { path: '/patients', label: 'Patients', icon: Users, permission: 'canViewAllPatients' },
    { path: '/doctors', label: 'Doctors', icon: Stethoscope, permission: 'canViewAllPatients' },
    { path: '/appointments', label: 'Appointments', icon: Calendar, permission: 'canBookAppointment' },
    { path: '/billing', label: 'Billing', icon: CreditCard, permission: 'canViewFinances' },
    { path: '/pharmacy', label: 'Pharmacy', icon: Pill, permission: 'canManagePharmacy' },
    { path: '/reports', label: 'Reports', icon: PieChart, permission: 'canManageReports' },
    { path: '/settings', label: 'Settings', icon: Settings, permission: 'canManageSystem' }
  ];

  // Filter menu items based on user permissions
  const authorizedMenuItems = menuItems.filter(item => 
    hasPermission(user, item.permission)
  );

  // Always show dashboard and appointments for patients
  if (user.role === 'patient') {
    authorizedMenuItems.push(
      { path: '/dashboard', label: 'Dashboard', icon: Home, permission: 'canBookAppointment' },
      { path: '/appointments', label: 'Appointments', icon: Calendar, permission: 'canBookAppointment' }
    );
  }

  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-border transition-all duration-300 z-30 hidden md:block",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full p-3">
        <div className="flex justify-end mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span className="sr-only">
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
          </Button>
        </div>
        
        <nav className="space-y-1 flex-1">
          {authorizedMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return collapsed ? (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-md my-1 mx-auto transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className={cn(
          "p-3 rounded-lg bg-muted/50 mt-auto",
          collapsed ? "text-center" : ""
        )}>
          <div className="flex items-center mb-2">
            <Menu className="h-4 w-4 text-muted-foreground" />
            {!collapsed && <span className="text-xs font-medium ml-2">QUICK MENU</span>}
          </div>
          {!collapsed && (
            <div className="text-xs text-muted-foreground">
              <p>Need help with the system?</p>
              <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                View Documentation
              </Button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
