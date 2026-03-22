// ============================================================================
// MAIN APPLICATION - AURA COSMETOLOGY
// ============================================================================

import React from 'react';
import {
BrowserRouter as Router,
Routes,
Route,
Navigate,
Outlet,
Link,
useLocation
} from 'react-router-dom';
import { Toaster } from 'sonner';
import supabase from '@/lib/supabase';

// Contexts
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useContent, ContentProvider } from '@/contexts/ContentContext';

// Admin Pages
import AdminLogin from '@/admin/pages/AdminLogin';
import ContentEditor from '@/admin/pages/ContentEditor';

// Public Sections
import HeroSection from '@/sections/HeroSection';

// =============================================================================
// PROTECTED ROUTE
// =============================================================================

interface ProtectedRouteProps {
children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
const { isAuthenticated, isLoading } = useAuth();

if (isLoading) {
return (
<div className="min-h-screen bg-slate-950 flex items-center justify-center">
<div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
</div>
);
}

if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
return children ? <>{children}</> : <Outlet />;
};

// =============================================================================
// АНІМАЦІЯ ПЕРЕХОДІВ
// =============================================================================
const PageTransition: React.FC<{children: React.ReactNode}> = ({ children }) => {
const location = useLocation();
return (
<div key={location.pathname} style={{ animation: 'fadeSlideUp 0.6s ease-out forwards' }} className="w-full">
<style>{`
       @keyframes fadeSlideUp {
         0% { opacity: 0; transform: translateY(20px); }
         100% { opacity: 1; transform: translateY(0); }
       }
     `}</style>
{children}
</div>
);
};

// =============================================================================
// СТОРІНКИ САЙТУ
// =============================================================================

// 1. Головна
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

// 2. Послуги (Розумна сторінка)
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

// 3. Галерея (Залишаємо як було, вона працює ідеально)
// 3. Галерея 
const GalleryPage: React.FC = () => {
const [images, setImages] = React.useState<any[]>([]);
const [loading, setLoading] = React.useState(true);
@@ -178,7 +178,7 @@
);
};

// 4. Прайс-лист (Розумна сторінка)
// 4. Прайс-лист (Розумна сторінка - ВИПРАВЛЕНО TS)
const PricingPage: React.FC = () => {
const [pricingList, setPricingList] = React.useState<any[]>([]);
const [loading, setLoading] = React.useState(true);
@@ -220,7 +220,8 @@
<h2 className="text-xl font-bold text-amber-500">{category}</h2>
</div>
<div className="divide-y divide-slate-700/50">
                    {items.map(item => (
                    {/* Ось тут додано явні типи для items та item */}
                    {(items as any[]).map((item: any) => (
<div key={item.id} className="flex justify-between items-center p-4 hover:bg-slate-800/50 transition-colors">
<span className="text-slate-300 font-medium">{item.name}</span>
<span className="text-white font-bold bg-slate-900 px-4 py-1 rounded-full border border-slate-700">{item.price}</span>
