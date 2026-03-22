// ============================================================================
// CONTENT EDITOR - ADMIN DASHBOARD
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save, RefreshCw, LogOut, Layout, Settings, Type, FileText, Sparkles, AlertCircle,
  Phone, Mail, MapPin, Instagram, Clock, Image as ImageIcon, Trash2, Upload, Plus, DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';
import supabase, { uploadImage } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const ContentEditor: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut, isAuthenticated, isLoading: authLoading } = useAuth();
  const { settings, siteContent, isLoading: contentLoading, isSaving, error, updateSettings, updateContent, refreshContent, getHeroContent, getAboutContent, getServicesContent, getContactContent, getTestimonialsContent } = useContent();

  const [activeTab, setActiveTab] = useState('hero');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Стейт для Галереї
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Стейт для Послуг
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [newService, setNewService] = useState({ title: '', description: '' });
  const [isAddingService, setIsAddingService] = useState(false);

  // Стейт для Прайсу
  const [pricingList, setPricingList] = useState<any[]>([]);
  const [newPricing, setNewPricing] = useState({ category: '', name: '', price: '' });
  const [isAddingPricing, setIsAddingPricing] = useState(false);

  // Стейт для форм
  const [settingsForm, setSettingsForm] = useState({ clinic_name: '', phone: '', email: '', instagram: '', address: '', working_hours: '' });
  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '', description: '', image_url: '' });
  const [aboutForm, setAboutForm] = useState({ title: '', subtitle: '', description: '' });
  const [servicesForm, setServicesForm] = useState({ title: '', subtitle: '', description: '' });
  const [contactForm, setContactForm] = useState({ title: '', subtitle: '', description: '' });
  const [testimonialsForm, setTestimonialsForm] = useState({ title: '', subtitle: '', description: '' });

  useEffect(() => { 
    if (!authLoading && !isAuthenticated) navigate('/admin/login'); 
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (settings) {
      setSettingsForm({ clinic_name: settings.clinic_name || '', phone: settings.phone || '', email: settings.email || '', instagram: settings.instagram || '', address: settings.address || '', working_hours: settings.working_hours || '' });
    }
  }, [settings]);

  useEffect(() => {
    const hero = getHeroContent(); if (hero) setHeroForm({ title: hero.title, subtitle: hero.subtitle, description: hero.description, image_url: hero.image_url || '' });
    const about = getAboutContent(); if (about) setAboutForm({ title: about.title, subtitle: about.subtitle, description: about.description });
    const services = getServicesContent(); if (services) setServicesForm({ title: services.title, subtitle: services.subtitle, description: services.description });
    const contact = getContactContent(); if (contact) setContactForm({ title: contact.title, subtitle: contact.subtitle, description: contact.description });
    const testimonials = getTestimonialsContent(); if (testimonials) setTestimonialsForm({ title: testimonials.title, subtitle: testimonials.subtitle, description: testimonials.description });
  }, [siteContent, getHeroContent, getAboutContent, getServicesContent, getContactContent, getTestimonialsContent]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galRes, srvRes, prcRes] = await Promise.all([
          supabase.from('gallery').select('*').order('created_at', { ascending: false }),
          supabase.from('services_items').select('*').order('created_at', { ascending: true }),
          supabase.from('pricing_items').select('*').order('created_at', { ascending: true })
        ]);
        if (galRes.data) setGalleryImages(galRes.data);
        if (srvRes.data) setServicesList(srvRes.data);
        if (prcRes.data) setPricingList(prcRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const handleSignOut = async () => { 
    try { 
      await signOut(); 
      toast.success('Signed out successfully'); 
      navigate('/admin/login'); 
    } catch (err) { 
      toast.error('Failed to sign out'); 
    } 
  };

  const handleSaveSettings = async () => { try { await updateSettings(settingsForm); setHasUnsavedChanges(false); } catch (err) { console.error(err); } };
  const handleSaveHero = async () => { try { await updateContent('hero', heroForm); setHasUnsavedChanges(false); } catch (err) { console.error(err); } };
  const handleSaveAbout = async () => { try { await updateContent('about', aboutForm); setHasUnsavedChanges(false); } catch (err) { console.error(err); } };
  const handleSaveServicesSection = async () => { try { await updateContent('services', servicesForm); setHasUnsavedChanges(false); } catch (err) { console.error(err); } };
  const handleSaveContact = async () => { try { await updateContent('contact', contactForm); setHasUnsavedChanges(false); } catch (err) { console.error(err); } };
  const handleSaveTestimonials = async () => { try { await updateContent('testimonials', testimonialsForm); setHasUnsavedChanges(false); } catch (err) { console.error(err); } };
  
  const handleRefresh = async () => { await refreshContent(); setHasUnsavedChanges(false); };

  const handleSettingsChange = (field: string, value: string) => { setSettingsForm(prev => ({ ...prev, [field]: value })); setHasUnsavedChanges(true); };
  const handleHeroChange = (field: string, value: string) => { setHeroForm(prev => ({ ...prev, [field]: value })); setHasUnsavedChanges(true); };
  const handleAboutChange = (field: string, value: string) => { setAboutForm(prev => ({ ...prev, [field]: value })); setHasUnsavedChanges(true); };
  const handleServicesChange = (field: string, value: string) => { setServicesForm(prev => ({ ...prev, [field]: value })); setHasUnsavedChanges(true); };
  const handleContactChange = (field: string, value: string) => { setContactForm(prev => ({ ...prev, [field]: value })); setHasUnsavedChanges(true); };
  const handleTestimonialsChange = (field: string, value: string) => { setTestimonialsForm(prev => ({ ...prev, [field]: value })); setHasUnsavedChanges(true); };

  const handleAddService = async () => {
    if (!newService.title) return toast.error('Назва обов\'язкова');
    setIsAddingService(true);
    try {
      const { data, error: err } = await supabase.from('services_items').insert([newService]).select();
      if (err) throw err;
      if (data) setServicesList(prev => [...prev, data[0]]);
      setNewService({ title: '', description: '' });
      toast.success('Послугу додано');
    } catch (err: any) { 
      toast.error(err.message); 
    } finally { 
      setIsAddingService(false); 
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Видалити послугу?')) return;
    try {
      const { error: err } = await supabase.from('services_items').delete().eq('id', id);
      if (err) throw err;
      setServicesList(prev => prev.filter(item => item.id !== id));
      toast.success('Послугу видалено');
    } catch (err: any) { 
      toast.error(err.message); 
    }
  };

  const handleAddPricing = async () => {
    if (!newPricing.category || !newPricing.name || !newPricing.price) return toast.error('Всі поля обов\'язкові');
    setIsAddingPricing(true);
    try {
      const { data, error: err } = await supabase.from('pricing_items').insert([newPricing]).select();
      if (err) throw err;
      if (data) setPricingList(prev => [...prev, data[0]]);
      setNewPricing({ category: newPricing.category, name: '', price: '' }); 
      toast.success('Ціну додано');
    } catch (err: any) { 
      toast.error(err.message); 
    } finally { 
      setIsAddingPricing(false); 
    }
  };

  const handleDeletePricing = async (id: string) => {
    if (!window.confirm('Видалити ціну?')) return;
    try {
      const { error: err } = await supabase.from('pricing_items').delete().eq('id', id);
      if (err) throw err;
      setPricingList(prev => prev.filter(item => item.id !== id));
      toast.success('Ціну видалено');
    } catch (err: any) { 
      toast.error(err.message); 
    }
  };

  const renderSaveButton = (onSave: () => void) => (
    <Button onClick={onSave} disabled={isSaving} className="bg-gradient-to-r from-rose-500 to-purple-600 text-white">
      {isSaving ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
    </Button>
  );

  if (authLoading || contentLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Aura Cosmetology</h1>
              <p className="text-xs text-slate-400">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && <Badge variant="outline" className="border-amber-500/50 text-amber-400"><AlertCircle className="w-3 h-3 mr-1" /> Unsaved</Badge>}
            <Button variant="outline" size="sm" onClick={handleRefresh} className="border-slate-700 text-slate-300 hidden sm:flex"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
            <a href="/" target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm" className="border-slate-700 text-slate-300"><Layout className="w-4 h-4 mr-2" /> Site</Button></a>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-slate-400"><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/30 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-8 p-6 bg-gradient-to-r from-rose-500/10 to-purple-600/10 rounded-2xl border border-rose-500/20">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {user?.email?.split('@')[0] || 'Admin'}!</h2>
          <p className="text-slate-400">Manage your website content below. Changes are saved directly to the database.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 flex flex-wrap h-auto gap-1">
            <TabsTrigger value="hero" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"><Sparkles className="w-4 h-4 mr-2 hidden sm:block" /> Hero</TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"><ImageIcon className="w-4 h-4 mr-2 hidden sm:block" /> Галерея</TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"><Layout className="w-4 h-4 mr-2 hidden sm:block" /> Послуги</TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"><DollarSign className="w-4 h-4 mr-2 hidden sm:block" /> Прайс</TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"><Type className="w-4 h-4 mr-2 hidden sm:block" /> Про нас</TabsTrigger>
            <TabsTrigger value="testimonials" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"><FileText className="w-4 h-4 mr-2 hidden sm:block" /> Відгуки</TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"><Mail className="w-4 h-4 mr-2 hidden sm:block" /> Контакти</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"><Settings className="w-4 h-4 mr-2 hidden sm:block" /> Налаштування</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-rose-500" /> Hero Section</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2"><Label className="text-slate-300">Subtitle</Label><Input value={heroForm.subtitle} onChange={(e) => handleHeroChange('subtitle', e.target.value)} className="bg-slate-800 border-slate-700 text-white"
