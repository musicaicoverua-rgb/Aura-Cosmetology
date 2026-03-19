// ============================================================================
// MAIN APPLICATION - AURA COSMETOLOGY
// ============================================================================
// Complete web application with:
// - React Router for navigation
// - Authentication protection for admin routes
// - Dynamic content from Supabase
// - Premium GSAP animations
// ============================================================================

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { Toaster } from 'sonner';

// Contexts
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ContentProvider } from '@/contexts/ContentContext';

// Admin Pages
import AdminLogin from '@/admin/pages/AdminLogin';
import ContentEditor from '@/admin/pages/ContentEditor';

// Public Sections
import HeroSection from '@/sections/HeroSection';

// =============================================================================
// PROTECTED ROUTE COMPONENT
// =============================================================================

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

// =============================================================================
// PUBLIC LAYOUT - MAIN WEBSITE
// =============================================================================

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-white font-semibold hidden sm:block">
                Aura Cosmetology
              </span>
            </a>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#hero"
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                Home
              </a>
              <a
                href="#about"
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                About
              </a>
              <a
                href="#services"
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                Services
              </a>
              <a
                href="#testimonials"
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                Contact
              </a>
            </div>

            {/* CTA */}
            <a
              href="/admin/login"
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-rose-500/25 transition-all"
            >
              Book Now
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <HeroSection />

        {/* Placeholder sections - to be implemented */}
        <section
          id="about"
          className="min-h-screen bg-slate-950 flex items-center justify-center"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">About Section</h2>
            <p className="text-slate-400">Coming soon...</p>
          </div>
        </section>

        <section
          id="services"
          className="min-h-screen bg-slate-900 flex items-center justify-center"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Services Section
            </h2>
            <p className="text-slate-400">Coming soon...</p>
          </div>
        </section>

        <section
          id="testimonials"
          className="min-h-screen bg-slate-950 flex items-center justify-center"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Testimonials Section
            </h2>
            <p className="text-slate-400">Coming soon...</p>
          </div>
        </section>

        <section
          id="contact"
          className="min-h-screen bg-slate-900 flex items-center justify-center"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Contact Section
            </h2>
            <p className="text-slate-400">Coming soon...</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-white font-semibold">Aura Cosmetology</span>
            </div>

            <p className="text-slate-500 text-sm">
              © 2024 Aura Cosmetology. All rights reserved.
            </p>

            <a
              href="/admin/login"
              className="text-slate-500 hover:text-rose-400 text-sm transition-colors"
            >
              Admin Login
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// =============================================================================
// ADMIN LAYOUT
// =============================================================================

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Outlet />
    </div>
  );
};

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ContentProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="login" element={<AdminLogin />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <ContentEditor />
                  </ProtectedRoute>
                }
              />
              <Route index element={<Navigate to="login" replace />} />
            </Route>

            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
            },
          }}
        />
      </ContentProvider>
    </AuthProvider>
  );
};

export default App;
