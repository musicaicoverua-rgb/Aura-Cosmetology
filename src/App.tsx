import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import supabase from '@/lib/supabase';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useContent, ContentProvider } from '@/contexts/ContentContext';

import AdminLogin from '@/admin/pages/AdminLogin';
import ContentEditor from '@/admin/pages/ContentEditor';
import HeroSection from '@/sections/HeroSection';

interface ProtectedRouteProps { children?: React.ReactNode; }

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children ? <>{children}</> : <Outlet />;
};

const PageTransition: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const location = useLocation();
  return (
    <div key={location.pathname} style={{ animation: 'fadeSlideUp 0.6s ease-out forwards' }} className="w-full">
      <style>{`@keyframes fadeSlideUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>
      {children}
    </div>
  );
};

const HomePage: React.FC = () => {
  const { getAboutContent } = useContent();
  const aboutData = getAboutContent();
  return (
    <PageTransition>
      <HeroSection />
      <section className="min-h-screen bg-slate-950 flex items-center justify-center py-20">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-4">{aboutData?.title || 'Про нас'}</h2>
          <p className="text-slate-400 whitespace-pre-wrap">{aboutData?.description || 'Завантаження опису...'}</p>
        </div>
      </section>
    </PageTransition>
  );
};

const ServicesPage: React.FC = () => {
  const { getServicesContent } = useContent();
  const servicesData = getServicesContent();
  const [servicesList, setServicesList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services_items').select('*').order('created_at', { ascending: true });
      if (data) setServicesList(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  return (
    <PageTransition>
      <section className="min-h-screen bg-slate-900 flex flex-col items-center py-32">
        <div className="text-center max-w-6xl mx-auto px-4 w-full">
          <h1 className="text-4xl font-bold text-white mb-4 text-rose-500">{servicesData?.title || 'Наші послуги'}</h1>
          <p className="text-slate-400 mb-12 max-w-2xl mx-auto">{servicesData?.description || 'Опис послуг завантажується...'}</p>
          {loading ? (
            <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          ) : servicesList.length === 0 ? (
            <p className="text-slate-500 bg-slate-800/20 p-8 rounded-2xl border border-slate-800">Послуги скоро з'являться!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesList.map(service => (
                <div key={service.id} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-left hover:border-rose-500/50 transition-colors group">
                  <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

const GalleryPage: React.FC = () => {
  const [images, setImages] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (data) setImages(data);
      setLoading(false);
    };
    fetchGallery();
  }, []);

  return (
    <PageTransition>
      <section className="min-h-screen bg-slate-950 flex flex-col items-center py-32">
        <div className="text-center max-w-6xl mx-auto px-4 w-full">
          <h1 className="text-4xl font-bold text-white mb-4 text-purple-500">Галерея робіт</h1>
          <p className="text-slate-400 mb-12">Результати нашої роботи до та після</p>
          {loading ? (
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          ) : images.length === 0 ? (
            <p className="text-slate-500 bg-slate-900/50 p-8 rounded-2xl border border-slate-800">Галерея поки що порожня.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {images.map((img) => (
                <div key={img.id} className="relative group overflow-hidden rounded-2xl aspect-square bg-slate-800">
                  <img src={img.image_url} alt="Робота" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white font-medium text-lg border-b border-purple-500 pb-1">{img.title || 'До та Після'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

const PricingPage: React.FC = () => {
  const [pricingList, setPricingList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPricing = async () => {
      const { data } = await supabase.from('pricing_items').select('*').order('created_at', { ascending: true });
      if (data) setPricingList(data);
      setLoading(false);
    };
    fetchPricing();
  }, []);

  const groupedPricing = pricingList.reduce((acc: Record<string, any[]>, item: any) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedPricing);

  return (
    <PageTransition>
      <section className="min-h-screen bg-slate-900 flex flex-col items-center py-32">
        <div className="max-w-4xl mx-auto px-4 w-full">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-4 text-amber-500">Прайс-лист</h1>
            <p className="text-slate-400">Прозорі ціни на всі процедури</p>
          </div>
          {loading ? (
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          ) : pricingList.length === 0 ? (
            <p className="text-slate-500 text-center bg-slate-800/20 p-8 rounded-2xl border border-slate-800">Прайс скоро з'явиться!</p>
          ) : (
            <div className="space-y-12">
              {categories.map((category) => (
                <div key={category} className="bg-slate-800/30 border border-slate-700 rounded-2xl overflow-hidden">
                  <div className="bg-slate-800 p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-amber-500">{category}</h2>
                  </div>
                  <div className="divide-y divide-slate-700/50">
                    {(groupedPricing[category] as any[]).map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center p-4 hover:bg-slate-800/50 transition-colors">
                        <span className="text-slate-300 font-medium">{item.name}</span>
                        <span className="text-white font-bold bg-slate-900 px-4 py-1 rounded-full border border-slate-700">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

const ContactPage: React.FC = () => {
  const { getContactContent, settings } = useContent();
  const contactData = getContactContent();

  return (
    <PageTransition>
      <section className="min-h-screen bg-slate-950 flex flex-col items-center py-32">
        <div className="max-w-4xl w-full mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4 text-blue-500">{contactData?.title || 'Контакти'}</h1>
          <p className="text-slate-400 mb-12">{contactData?.description || 'Зв’яжіться з нами зручним для вас способом'}</p>
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
    </PageTransition>
  );
};

const PublicLayout: React.FC = () => {
  const { settings } = useContent();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-white font-semibold hidden sm:block">Aura Cosmetology</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Головна</Link>
              <Link to="/services" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Послуги</Link>
              <Link to="/pricing" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Прайс</Link>
              <Link to="/gallery" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Галерея</Link>
              <Link to="/contact" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Контакти</Link>
            </div>
            <a href={`tel:${settings?.phone || '+38000000000'}`} className="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-rose-500/25 transition-all flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Подзвонити
            </a>
          </div>
        </div>
      </nav>
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <footer className="bg-slate-950 border-t border-slate-800 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-purple-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">A</span></div>
              <span className="text-white font-semibold">Aura Cosmetology</span>
            </div>
            <p className="text-slate-500 text-sm">© 2024 Aura Cosmetology. All rights reserved.</p>
            <Link to="/admin/login" className="text-slate-500 hover:text-rose-400 text-sm transition-colors">Admin Login</Link>
          </div>
        </div>
      </footer>
      <a href={settings?.instagram?.includes('http') ? settings.instagram : `https://instagram.com/${settings?.instagram?.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(225,29,72,0.5)] hover:scale-110 transition-transform z-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
      </a>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ContentProvider>
        <Router>
          <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>
            <Route path="/admin" element={<div className="min-h-screen bg-slate-950"><Outlet /></div>}>
              <Route path="login" element={<AdminLogin />} />
              <Route path="dashboard" element={<ProtectedRoute><ContentEditor /></ProtectedRoute>} />
              <Route index element={<Navigate to="login" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }} />
      </ContentProvider>
    </AuthProvider>
  );
}; 

export default App;
