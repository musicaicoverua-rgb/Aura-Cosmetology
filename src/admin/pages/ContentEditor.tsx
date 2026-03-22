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

  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [newService, setNewService] = useState({ title: '', description: '' });
  const [isAddingService, setIsAddingService] = useState(false);
  const [pricingList, setPricingList] = useState<any[]>([]);
  const [newPricing, setNewPricing] = useState({ category: '', name: '', price: '' });
  const [isAddingPricing, setIsAddingPricing] = useState(false);

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
                <div className="space-y-2"><Label className="text-slate-300">Subtitle</Label><Input value={heroForm.subtitle} onChange={(e) => handleHeroChange('subtitle', e.target.value)} className="bg-slate-800 border-slate-700 text-white" /></div>
                <div className="space-y-2"><Label className="text-slate-300">Main Title</Label><Input value={heroForm.title} onChange={(e) => handleHeroChange('title', e.target.value)} className="bg-slate-800 border-slate-700 text-white text-lg" /></div>
                <div className="space-y-2"><Label className="text-slate-300">Description</Label><Textarea value={heroForm.description} onChange={(e) => handleHeroChange('description', e.target.value)} className="bg-slate-800 border-slate-700 text-white min-h-[120px]" /></div>
                <div className="space-y-2 pt-4 border-t border-slate-800">
                  <Label className="text-slate-300">Hero Image</Label>
                  <Input type="file" accept="image/*" className="bg-slate-800 border-slate-700 text-slate-300" onChange={async (e) => {
                    const file = e.target.files?.[0]; if (!file) return;
                    try { const loadingToast = toast.loading('Uploading...'); const imageUrl = await uploadImage(file); handleHeroChange('image_url', imageUrl); toast.dismiss(loadingToast); toast.success('Image uploaded!'); } catch (err) { console.error(err); toast.error('Failed to upload'); }
                  }} />
                  {heroForm.image_url && <div className="mt-4 w-40 h-40 rounded-xl overflow-hidden border border-slate-700"><img src={heroForm.image_url} alt="Preview" className="object-cover w-full h-full" /></div>}
                </div>
                <div className="flex justify-end">{renderSaveButton(handleSaveHero)}</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><ImageIcon className="w-5 h-5 text-purple-500" /> Галерея робіт</CardTitle></CardHeader>
              <CardContent className="space-y-8">
                <div className="p-8 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/30 flex flex-col items-center">
                  <Upload className="w-10 h-10 text-slate-400 mb-4" />
                  <div className="relative inline-block">
                    <Button disabled={isUploadingGallery} className="bg-purple-600 hover:bg-purple-700 text-white px-8">{isUploadingGallery ? 'Завантаження...' : 'Вибрати фото'}</Button>
                    <Input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploadingGallery} onChange={async (e) => {
                      const file = e.target.files?.[0]; if (!file) return;
                      try { setIsUploadingGallery(true); const loadingToast = toast.loading('Завантажуємо...'); const imageUrl = await uploadImage(file); await supabase.from('gallery').insert([{ image_url: imageUrl, title: 'Робота' }]); const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false }); if (data) setGalleryImages(data); toast.dismiss(loadingToast); toast.success('Додано!'); } catch (err) { console.error(err); toast.error('Помилка'); } finally { setIsUploadingGallery(false); e.target.value = ''; }
                    }} />
                  </div>
                </div>
                <Separator className="bg-slate-800" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {galleryImages.map((img) => (
                    <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-700 aspect-square">
                      <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="destructive" size="sm" onClick={async () => {
                          if (!window.confirm('Видалити?')) return;
                          await supabase.from('gallery').delete().eq('id', img.id); setGalleryImages(prev => prev.filter(p => p.id !== img.id));
                        }}><Trash2 className="w-4 h-4 mr-2" /> Видалити</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card className="bg-slate-900 border-slate-800 mb-6">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><Layout className="w-5 h-5 text-rose-500" /> Заголовки сторінки "Послуги"</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label className="text-slate-300">Головний заголовок</Label><Input value={servicesForm.title} onChange={(e) => handleServicesChange('title', e.target.value)} className="bg-slate-800 border-slate-700 text-white" /></div>
                <div className="space-y-2"><Label className="text-slate-300">Короткий опис сторінки</Label><Textarea value={servicesForm.description} onChange={(e) => handleServicesChange('description', e.target.value)} className="bg-slate-800 border-slate-700 text-white" /></div>
                <div className="flex justify-end">{renderSaveButton(handleSaveServicesSection)}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle className="text-white">Картки послуг (Динамічні)</CardTitle><CardDescription className="text-slate-400">Додавайте та видаляйте послуги, які відображатимуться на сайті.</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-4">
                  <h3 className="text-white font-medium">Додати нову послугу</h3>
                  <Input placeholder="Назва послуги (напр. Контурна пластика)" value={newService.title} onChange={(e) => setNewService(prev => ({ ...prev, title: e.target.value }))} className="bg-slate-900 border-slate-700 text-white" />
                  <Textarea placeholder="Опис послуги" value={newService.description} onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))} className="bg-slate-900 border-slate-700 text-white h-24" />
                  <Button onClick={handleAddService} disabled={isAddingService} className="bg-rose-500 hover:bg-rose-600 text-white w-full sm:w-auto"><Plus className="w-4 h-4 mr-2" /> Додати послугу</Button>
                </div>
                
                <div className="space-y-3">
                  {servicesList.length === 0 ? <p className="text-slate-500 text-sm">Немає доданих послуг.</p> : servicesList.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-slate-800 rounded-xl border border-slate-700">
                      <div><h4 className="text-white font-medium">{item.title}</h4><p className="text-slate-400 text-sm line-clamp-1">{item.description}</p></div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteService(item.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 ml-4"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><DollarSign className="w-5 h-5 text-amber-500" /> Прайс-лист</CardTitle><CardDescription className="text-slate-400">Керуйте цінами. Сайт автоматично згрупує їх за категоріями.</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-4">
                  <h3 className="text-white font-medium">Додати нову ціну</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label className="text-slate-300">Категорія (напр. Ін'єкції)</Label><Input placeholder="Категорія" value={newPricing.category} onChange={(e) => setNewPricing(prev => ({ ...prev, category: e.target.value }))} className="bg-slate-900 border-slate-700 text-white" /></div>
                    <div className="space-y-2"><Label className="text-slate-300">Ціна (напр. 4500 грн)</Label><Input placeholder="Ціна" value={newPricing.price} onChange={(e) => setNewPricing(prev => ({ ...prev, price: e.target.value }))} className="bg-slate-900 border-slate-700 text-white" /></div>
                    <div className="space-y-2 sm:col-span-2"><Label className="text-slate-300">Назва процедури</Label><Input placeholder="Збільшення губ (Stylage M)" value={newPricing.name} onChange={(e) => setNewPricing(prev => ({ ...prev, name: e.target.value }))} className="bg-slate-900 border-slate-700 text-white" /></div>
                  </div>
                  <Button onClick={handleAddPricing} disabled={isAddingPricing} className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto"><Plus className="w-4 h-4 mr-2" /> Додати в прайс</Button>
                </div>

                <div className="space-y-3">
                  {pricingList.length === 0 ? <p className="text-slate-500 text-sm">Прайс порожній.</p> : pricingList.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg border border-slate-700">
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-1 text-amber-500 border-amber-500/30">{item.category}</Badge>
                        <h4 className="text-white text-sm font-medium">{item.name}</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-white font-bold whitespace-nowrap">{item.price}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleDeletePricing(item.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 w-8 p-0"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><Type className="w-5 h-5 text-rose-500" /> Про нас</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Label className="text-slate-300">Title</Label>
                <Input value={aboutForm.title} onChange={e => handleAboutChange('title', e.target.value)} className="bg-slate-800 border-slate-700 text-white" placeholder="Title" />
                <Label className="text-slate-300">Description</Label>
                <Textarea value={aboutForm.description} onChange={e => handleAboutChange('description', e.target.value)} className="bg-slate-800 border-slate-700 text-white h-32" placeholder="Description" />
                <div className="flex justify-end">{renderSaveButton(handleSaveAbout)}</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><FileText className="w-5 h-5 text-rose-500" /> Відгуки</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Label className="text-slate-300">Title</Label>
                <Input value={testimonialsForm.title} onChange={e => handleTestimonialsChange('title', e.target.value)} className="bg-slate-800 border-slate-700 text-white" placeholder="Title" />
                <Label className="text-slate-300">Description</Label>
                <Textarea value={testimonialsForm.description} onChange={e => handleTestimonialsChange('description', e.target.value)} className="bg-slate-800 border-slate-700 text-white h-32" placeholder="Description" />
                <div className="flex justify-end">{renderSaveButton(handleSaveTestimonials)}</div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><Mail className="w-5 h-5 text-rose-500" /> Контакти</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Label className="text-slate-300">Title</Label>
                <Input value={contactForm.title} onChange={e => handleContactChange('title', e.target.value)} className="bg-slate-800 border-slate-700 text-white" placeholder="Title" />
                <Label className="text-slate-300">Description</Label>
                <Textarea value={contactForm.description} onChange={e => handleContactChange('description', e.target.value)} className="bg-slate-800 border-slate-700 text-white h-32" placeholder="Description" />
                <div className="flex justify-end">{renderSaveButton(handleSaveContact)}</div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><Settings className="w-5 h-5 text-rose-500" /> Налаштування</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-slate-300 flex items-center gap-2"><Phone className="w-4 h-4" /> Phone</Label><Input value={settingsForm.phone} onChange={e => handleSettingsChange('phone', e.target.value)} className="bg-slate-800 border-slate-700 text-white" placeholder="Phone" /></div>
                <div className="space-y-2"><Label className="text-slate-300 flex items-center gap-2"><Instagram className="w-4 h-4" /> Instagram</Label><Input value={settingsForm.instagram} onChange={e => handleSettingsChange('instagram', e.target.value)} className="bg-slate-800 border-slate-700 text-white" placeholder="Instagram link" /></div>
                <div className="space-y-2 col-span-2"><Label className="text-slate-300 flex items-center gap-2"><MapPin className="w-4 h-4" /> Address</Label><Input value={settingsForm.address} onChange={e => handleSettingsChange('address', e.target.value)} className="bg-slate-800 border-slate-700 text-white" placeholder="Address" /></div>
                <div className="space-y-2 col-span-2"><Label className="text-slate-300 flex items-center gap-2"><Clock className="w-4 h-4" /> Working Hours</Label><Input value={settingsForm.working_hours} onChange={e => handleSettingsChange('working_hours', e.target.value)} className="bg-slate-800 border-slate-700 text-white" placeholder="Working Hours" /></div>
                <div className="col-span-2 flex justify-end">{renderSaveButton(handleSaveSettings)}</div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default ContentEditor;
