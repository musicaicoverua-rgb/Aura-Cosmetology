import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  MessageSquare, 
  Star, 
  Image, 
  Settings,
  LogOut,
  Menu,
  X,
  Scissors,
  FileText
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/appointments', icon: Calendar, label: 'Appointments' },
  { path: '/admin/clients', icon: Users, label: 'CRM Clients' },
  { path: '/admin/services', icon: Scissors, label: 'Services' },
  { path: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { path: '/admin/reviews', icon: Star, label: 'Reviews' },
  { path: '/admin/gallery', icon: Image, label: 'Gallery' },
  { path: '/admin/content', icon: FileText, label: 'Content' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white shadow-xl transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        } ${isSidebarOpen ? 'w-64' : 'lg:w-20'}`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!isSidebarOpen && 'lg:hidden'}`}>
              <span className="font-display text-2xl tracking-wider">AURA</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Admin</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#D4A24F]/10 text-[#D4A24F]'
                      : 'text-gray-600 hover:bg-gray-100'
                  } ${!isSidebarOpen && 'lg:justify-center'}`
                }
              >
                <item.icon size={20} />
                <span className={`font-medium ${!isSidebarOpen && 'lg:hidden'}`}>
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t">
            <div className={`flex items-center gap-3 mb-4 ${!isSidebarOpen && 'lg:hidden'}`}>
              <div className="w-10 h-10 rounded-full bg-[#D4A24F]/20 flex items-center justify-center">
                <span className="text-[#D4A24F] font-medium">
                  {user?.name?.charAt(0) || user?.email?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || user?.email}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full ${
                !isSidebarOpen && 'lg:justify-center'
              }`}
            >
              <LogOut size={20} />
              <span className={`font-medium ${!isSidebarOpen && 'lg:hidden'}`}>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <span className="font-display text-xl tracking-wider">AURA Admin</span>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};