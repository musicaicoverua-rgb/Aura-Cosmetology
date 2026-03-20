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
import { useContent, ContentProvider } from '@/contexts/ContentContext';

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
  const { getAboutContent, getServicesContent, getTestimonialsContent, getContactContent, settings } = useContent();
  const aboutData = getAboutContent();
  const servicesData = getServicesContent();
  const testimonialsData = getTestimonialsContent();
  const contactData = getContactContent();

  return (
    <div className="min-h-screen bg-slate-950 relative">
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
              <a href="#hero" className="text-slate-400 hover:text-white transition-colors text-sm">Home</a>
              <a href="#about" className="text-slate-400 hover:text-white transition-colors text-sm">About</a>
              <a href="#services" className="text-slate-400 hover:text-white transition-colors text-sm">Services</a>
              <a href="#testimonials" className="text-slate-400 hover:text-white transition-colors text-sm">Testimonials</a>
              <a href="#contact" className="text-slate-400 hover:text-white transition-colors text-sm">Contact</a>
            </div>

            {/* CTA - Гаряча кнопка дзвінка */}
            <a
              href={`tel:${settings?.phone || '+38000000000'}`}
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-rose-500/25 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Подзвонити
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <HeroSection />

        <section id="about" className="min-h-screen bg-slate-950 flex items-center justify-center py-20">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-white mb-4">
              {aboutData?.title || 'Про нас'}
            </h2>
            <p className="text-slate-400">
              {aboutData?.description || 'Завантаження опису...'}
            </p>
          </div>
        </section>

        <section id="services" className="min-h-screen bg-slate-900 flex items-center justify-center py-20">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-white mb-4">
              {servicesData?.title || 'Наші послуги'}
            </h2>
            <p className="text-slate-400">
              {servicesData?.description || 'Опис послуг завантажується...'}
            </p>
          </div>
        </section>

        <section id="testimonials" className="min-h-screen bg-slate-950 flex items-center justify-center py-20">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-white mb-4">
              {testimonialsData?.title || 'Відгуки'}
            </h2>
            <p className="text-slate-400">
              {testimonialsData?.description || 'Відгуки завантажуються...'}
            </p>
          </div>
        </section>

        <section id="contact" className="min-h-screen bg-slate-900 flex flex-col items-center justify-center py-20">
          <div className="max-w-4xl w-full mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              {contactData?.title || 'Контакти'}
            </h2>
            <p className="text-slate-400 mb-12">
              {contactData?.description || 'Зв’яжіться з нами зручним для вас способом'}
            </p>

            {/* Карточка з реальними контактами з адмінки */}
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 max-w-lg mx-auto text-left backdrop-blur-sm">
              <div className="space-y-6 text-slate-300 text-lg">
                {settings?.phone && <p className="flex items-center gap-4">📞 <a href={`tel:${settings.phone}`} className="hover:text-rose-400 transition-colors">{settings.phone}</a></p>}
                {settings?.email && <p className="flex items-center gap-4">✉️ <a href={`mailto:${settings.email}`} className="hover:text-rose-400 transition-colors">{settings.email}</a></p>}
                {settings?.instagram && <p className="flex items-center gap-4">📸 <a href={settings.instagram.includes('http') ? settings.instagram : `https://instagram.com/${settings.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-rose-400 transition-colors">{settings.instagram}</a></p>}
                {settings?.address && <p className="flex items-center gap-4">📍 <span>{settings.address}</span></p>}
                {settings?.working_hours && <p className="flex items-center gap-4">🕒 <span>{settings.working_hours}</span></p>}
              </div>
            </div>
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

            <a href="/admin/login" className="text-slate-500 hover:text-rose-400 text-sm transition-colors">
              Admin Login
            </a>
          </div>
        </div>
      </footer>
      
      {/* Плаваюча кнопка чату (Instagram) */}
      <a
        href="https://www.instagram.com/lux_cosmetologia?igsh=MWM2M2Zza215aWFpbQ==" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(225,29,72,0.5)] hover:scale-110 transition-transform z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
      </a>
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
