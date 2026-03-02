import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  LayoutDashboard,
  ArrowLeftRight,
  UserCircle,
  Shield,
  Users,
  ScrollText,
  FileText,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import SqlReserveLogo from './SqlReserveLogo';

const userLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transfer', label: 'Transfers', icon: ArrowLeftRight },
  { to: '/transactions', label: 'History', icon: ScrollText },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/users', label: 'All Users', icon: Users },
  { to: '/admin/transactions', label: 'Transactions', icon: ScrollText },
  { to: '/admin/logs', label: 'System Logs', icon: FileText },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ to, label, icon: Icon }: { to: string; label: string; icon: React.ElementType }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setSidebarOpen(false)}
        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
          active
            ? 'bg-blue-500/15 text-blue-400 shadow-lg shadow-blue-500/5'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
      >
        <Icon size={20} className={active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'} />
        <span>{label}</span>
        {active && (
          <ChevronRight size={16} className="ml-auto text-blue-400" />
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="p-2 rounded-xl gradient-primary">
          <SqlReserveLogo size={24} />
        </div>
        <div>
          <span className="text-xl font-bold text-white tracking-tight">SQL Reserve</span>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Secure Banking</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1">
        <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider px-4 mb-2">
          Menu
        </p>
        {userLinks.map((link) => (
          <NavLink key={link.to} {...link} />
        ))}

        {isAdmin && (
          <>
            <div className="my-4 border-t border-slate-700/50" />
            <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider px-4 mb-2 flex items-center gap-1">
              <Shield size={12} /> Admin
            </p>
            {adminLinks.map((link) => (
              <NavLink key={link.to} {...link} />
            ))}
          </>
        )}
      </nav>

      {/* User Footer */}
      <div className="px-3 pb-6">
        <div className="glass-light rounded-xl p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{user?.fullName}</p>
              <p className="text-xs text-slate-500">@{user?.username}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[260px] flex-col bg-slate-900/50 border-r border-slate-800/50 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[260px] bg-slate-900 z-50 lg:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-6 right-4 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 glass border-b border-slate-800/50 px-4 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <Menu size={22} />
          </button>

          <div className="hidden lg:block">
            <h2 className="text-lg font-semibold text-slate-200">
              {location.pathname === '/dashboard' && 'Dashboard'}
              {location.pathname === '/transfer' && 'Fund Transfer'}
              {location.pathname === '/transactions' && 'Transaction History'}
              {location.pathname === '/profile' && 'My Profile'}
              {location.pathname === '/admin/dashboard' && 'Admin Overview'}
              {location.pathname === '/admin/users' && 'User Management'}
              {location.pathname === '/admin/transactions' && 'All Transactions'}
              {location.pathname === '/admin/logs' && 'System Logs'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                <Shield size={12} /> Admin
              </span>
            )}
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{user?.fullName}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
