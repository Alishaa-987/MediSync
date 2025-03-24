
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [notifications] = useState([
    { id: 1, text: 'New appointment request', isRead: false },
    { id: 2, text: 'Dr. Smith updated patient records', isRead: false },
    { id: 3, text: 'Staff meeting at 3 PM', isRead: true },
  ]);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 h-16 max-w-[1920px] mx-auto">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="p-6">
                <MobileNav />
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center ml-2">
            <div className="w-8 h-8 rounded-md bg-hms-600 flex items-center justify-center text-white font-bold text-xl mr-2">
              H
            </div>
            <span className="font-semibold text-lg hidden xs:block">Hospitalia</span>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          {user && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-hms-600">
                        {unreadCount}
                      </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <h3 className="font-medium">Notifications</h3>
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                      Mark all as read
                    </Button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-4 text-center text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "px-4 py-2 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer",
                            !notification.isRead && "bg-primary/5"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <div className={cn(
                              "w-2 h-2 rounded-full mt-2",
                              !notification.isRead ? "bg-primary" : "bg-muted"
                            )} />
                            <div>
                              <p className="text-sm">{notification.text}</p>
                              <p className="text-xs text-muted-foreground mt-1">Just now</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center px-3 py-2 md:hidden">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="md:hidden" />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          
          {!user && (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-hms-600 hover:bg-hms-700">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const MobileNav = () => {
  const { user, logout } = useAuth();
  return (
    <div className="flex flex-col h-full">
      <div className="px-2 py-4 mb-4 flex justify-between items-center border-b">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-hms-600 flex items-center justify-center text-white font-bold text-xl mr-2">
            H
          </div>
          <span className="font-semibold text-lg">Hospitalia</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetTrigger>
        </Sheet>
      </div>
      
      {user && (
        <div className="px-2 py-4 mb-4 flex items-center space-x-3 border-b">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>
      )}
      
      <nav className="flex-1">
        <div className="space-y-1 px-2">
          <NavItem to="/" label="Home" />
          {user && (
            <>
              <NavItem to="/dashboard" label="Dashboard" />
              <NavItem to="/patients" label="Patients" />
              <NavItem to="/doctors" label="Doctors" />
              <NavItem to="/appointments" label="Appointments" />
              <NavItem to="/billing" label="Billing" />
              <NavItem to="/pharmacy" label="Pharmacy" />
              <NavItem to="/settings" label="Settings" />
            </>
          )}
        </div>
      </nav>
      
      {user && (
        <div className="px-2 py-4 mt-auto border-t">
          <Button onClick={logout} variant="outline" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      )}
    </div>
  );
};

const NavItem: React.FC<{ to: string; label: string }> = ({ to, label }) => (
  <Link 
    to={to} 
    className="block py-2 px-3 text-base rounded-md hover:bg-muted transition-colors"
  >
    {label}
  </Link>
);

export default Navbar;
