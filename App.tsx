import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { AuthProvider } from '@/context/AuthContext';
import { Navigation } from '@/components/navigation/Navigation';
import { MenuOverlay } from '@/components/navigation/MenuOverlay';
import { FloatingButtons } from '@/components/FloatingButtons';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { ProtectedRoute } from '@/admin/components/ProtectedRoute';
import {
  Dashboard,
  Appointments,
  Clients,
  Services,
  Messages,
  Reviews,
  Gallery,
  Content,
  Settings,
  AdminLogin,
} from '@/admin/pages';
import { HeroSection } from '@/sections/HeroSection';
import { SignatureSection } from '@/sections/SignatureSection';
import { AboutSection } from '@/sections/AboutSection';
import { ServicesSection } from '@/sections/ServicesSection';
import { TreatmentsSection } from '@/sections/TreatmentsSection';
import { ResultsSection } from '@/sections/ResultsSection';
import { TeamSection } from '@/sections/TeamSection';
import { BookingSection } from '@/sections/BookingSection';
import { GiftSection } from '@/sections/GiftSection';
import { ReviewsSection } from '@/sections/ReviewsSection';
import { ContactSection } from '@/sections/ContactSection';
import './App.css';

// Main website component
const MainWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#F6F6F2] flex items-center justify-center z-[9999]">
        <div className="text-center">
          <h1 className="font-display text-4xl md:text-5xl tracking-wider animate-pulse">AURA</h1>
          <p className="text-sm text-[#6F6F6F] mt-2 tracking-widest uppercase">Luxe Clinic</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grain-overlay" />
      <Navigation onMenuClick={() => setIsMenuOpen(true)} />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <main className="relative">
        <HeroSection />
        <SignatureSection />
        <AboutSection />
        <ServicesSection />
        <TreatmentsSection />
        <ResultsSection />
        <TeamSection />
        <BookingSection />
        <GiftSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <FloatingButtons />
    </div>
  );
};

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Main Website */}
            <Route path="/" element={<MainWebsite />} />

            {/* Admin Login */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Admin Dashboard */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="clients" element={<Clients />} />
              <Route path="services" element={<Services />} />
              <Route path="messages" element={<Messages />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="content" element={<Content />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;