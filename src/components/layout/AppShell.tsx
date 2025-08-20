import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast, ToastPortal } from '../../visuals/ToastPortal';
import { RoleBadge } from '../badges/RoleBadge';
import { Button } from '../ui/Button';
import { 
  Home, 
  Ticket, 
  Plus, 
  Users, 
  Settings, 
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';

export function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toasts, removeToast } = useToast();
  const [isDark, setIsDark] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  if (!user) return null;

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    switch (user.role) {
      case 'customer':
        return [
          { to: '/my/tickets', label: 'My Tickets', icon: Ticket },
          { to: '/my/tickets/new', label: 'New Ticket', icon: Plus },
        ];
      case 'staff':
        return [
          { to: '/staff/tickets', label: 'All Tickets', icon: Ticket },
          { to: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        ];
      case 'admin':
        return [
          { to: '/staff/tickets', label: 'All Tickets', icon: Ticket },
          { to: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/admin/categories', label: 'Categories', icon: Settings },
          { to: '/admin/priorities', label: 'Priorities', icon: Settings },
          { to: '/admin/staff', label: 'Staff', icon: Users },
        ];
      default:
        return [];
    }
  };

  return (
    <div 
      className="min-h-screen bg-bg flex transition-colors duration-300"
      onMouseMove={handleMouseMove}
      style={{
        '--mx': `${mousePosition.x}px`,
        '--my': `${mousePosition.y}px`,
      } as React.CSSProperties}
    >
      {/* Sidebar */}
      <motion.div
        className={`${sidebarCollapsed ? 'w-16' : 'w-64'} glass border-r border-border/50 transition-all duration-300`}
        initial={false}
        animate={{ width: sidebarCollapsed ? 64 : 256 }}
      >
        {/* App bar glow */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-brand/10 via-brand-2/10 to-brand/10 opacity-50 blur-xl" />
        
        <div className="relative p-6 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-brand to-brand-2">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-xl font-bold text-ink">SparkSupport</h1>
                  <p className="text-sm text-muted">Premium Dashboard</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-6 p-1.5 rounded-full glass border border-border/50 hover:scale-110 transition-transform"
          >
            {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {getNavItems().map((item) => (
            <motion.div
              key={item.to}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={item.to}
                className={`flex items-center space-x-3 px-3 py-3 rounded-2xl transition-all duration-200 relative group ${
                  location.pathname === item.to
                    ? 'bg-gradient-to-r from-brand/20 to-brand-2/20 text-brand border-l-4 border-brand'
                    : 'text-muted hover:bg-panel-2/50 hover:text-ink'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      className="font-medium"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Active indicator */}
                {location.pathname === item.to && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand to-brand-2 rounded-r-full"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className={`absolute bottom-0 ${sidebarCollapsed ? 'w-16' : 'w-64'} p-4 border-t border-border/50 glass`}>
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm font-medium text-ink">{user.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <RoleBadge role={user.role} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="p-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="glass border-b border-border/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Global Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  className="pl-10 pr-4 py-2 w-80 glass rounded-2xl border border-border/50 focus:ring-2 focus:ring-brand/50 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* New Ticket Button */}
              {user.role === 'customer' && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => navigate('/my/tickets/new')}
                    className="bg-gradient-to-r from-brand to-brand-2 hover:from-brand/90 hover:to-brand-2/90 text-white shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Ticket
                  </Button>
                </motion.div>
              )}
              
              {/* Notifications */}
              <div className="relative">
                <Button variant="ghost" size="sm" className="p-2 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-brand rounded-full pulse-glow" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Toast Portal */}
      <ToastPortal toasts={toasts} onRemove={removeToast} />
    </div>
  );
}