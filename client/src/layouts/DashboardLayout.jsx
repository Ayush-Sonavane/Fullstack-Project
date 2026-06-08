import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HiOutlineMenu, 
  HiOutlineX, 
  HiOutlineLogout, 
  HiOutlineKey,
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineOfficeBuilding
} from 'react-icons/hi';

const DashboardLayout = ({ children }) => {
  const { user, logout, isAdmin, isStoreOwner } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items based on role
  const getNavItems = () => {
    if (isAdmin) {
      return [
        { label: 'Dashboard', path: '/admin', icon: HiOutlineChartBar },
        { label: 'Users', path: '/admin/users', icon: HiOutlineUsers },
        { label: 'Stores', path: '/admin/stores', icon: HiOutlineOfficeBuilding },
      ];
    }
    if (isStoreOwner) {
      return [
        { label: 'Dashboard', path: '/owner', icon: HiOutlineChartBar },
      ];
    }
    return [
      { label: 'Stores', path: '/stores', icon: HiOutlineOfficeBuilding },
    ];
  };

  const navItems = getNavItems();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-surface-50 font-sans">
      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40
        w-64 h-screen bg-white
        border-r border-surface-100
        flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo and Nav wrapper */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {/* Logo */}
          <div className="p-6 border-b border-surface-100 flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold font-display shadow-md shadow-primary-500/20">
                S
              </span>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent font-display tracking-tight">
                StoreRate
              </h1>
            </div>
            <p className="text-[10px] text-surface-400 font-semibold uppercase tracking-wider ml-10 mt-0.5">
              Rating Platform
            </p>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-300 no-underline relative group
                    ${active
                      ? 'bg-primary-50 text-primary-700 border border-primary-100/50 shadow-sm shadow-primary-500/5 font-semibold'
                      : 'text-surface-500 hover:bg-surface-50 hover:text-surface-900 border border-transparent'
                    }
                  `}
                >
                  {active && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary-600 rounded-r" />
                  )}
                  <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-105 ${active ? 'text-primary-600' : 'text-surface-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom section / Profile */}
        <div className="p-4 border-t border-surface-100 bg-white">
          <div className="px-4 py-3 mb-3 bg-surface-50 rounded-2xl border border-surface-100 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                {user?.name ? user.name[0] : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-surface-800 truncate leading-none">{user?.name}</p>
                <p className="text-[10px] text-surface-400 truncate mt-0.5">{user?.email}</p>
              </div>
            </div>
            <span className="inline-block mt-2 align-self-start px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-primary-100 text-primary-800 uppercase tracking-wide w-max">
              {user?.role?.replace('_', ' ')}
            </span>
          </div>

          <Link
            to="/profile/password"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-surface-500 hover:text-surface-800 hover:bg-surface-50 rounded-xl transition-all no-underline font-medium"
          >
            <HiOutlineKey className="w-4.5 h-4.5 text-surface-400" />
            Change Password
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-danger hover:bg-red-50/50 hover:text-red-600 rounded-xl transition-all font-medium border-0 cursor-pointer mt-1"
          >
            <HiOutlineLogout className="w-4.5 h-4.5 text-danger opacity-75" />
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-surface-950/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-surface-100 px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              className="lg:hidden text-surface-500 hover:text-surface-900 p-2 rounded-xl hover:bg-surface-100 transition-colors border-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
            </button>
            <div className="hidden lg:block" />
            <div className="text-sm text-surface-500 font-medium">
              Welcome back, <span className="text-surface-900 font-bold font-display">{user?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
