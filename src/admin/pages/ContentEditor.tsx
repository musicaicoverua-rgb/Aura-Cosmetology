// ============================================================================
// CONTENT EDITOR - ADMIN DASHBOARD
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  RefreshCw,
  LogOut,
  Layout,
  Settings,
  Type,
  FileText,
  Sparkles,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Clock,
  Image as ImageIcon,
  Trash2,
  Upload
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
  const {
    settings,
    siteContent,
    isLoading: contentLoading,
    isSaving,
    error,
    updateSettings,
    updateContent,
    refreshContent,
    getHeroContent,
    getAboutContent,
    getServicesContent,
    getContactContent,
    getTestimonialsContent,
  } = useContent();

  const [activeTab, setActiveTab] = useState('hero');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Стейт для Галереї
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Form states
  const [settingsForm, setSettingsForm] = useState({
    clinic_name: '', phone: '', email: '', instagram: '', address: '', working_hours: '',
  });
  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '', description: '', image_url: '' });
  const [aboutForm, setAboutForm] = useState({ title: '', subtitle: '', description: '' });
  const [servicesForm, setServicesForm] = useState({ title: '', subtitle: '', description: '' });
  const [contactForm, setContactForm] = useState({ title: '', subtitle: '', description: '' });
  const [testimonialsForm, setTestimonialsForm] = useState({ title: '', subtitle: '', description: '' });

  // Auth & Data loading
  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/admin/login');
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        clinic_name: settings.clinic_name || '', phone: settings.phone || '', email: settings.email || '',
        instagram: settings.instagram || '', address: settings.address || '', working_hours: settings.working_hours || '',
      });
    }
  }, [settings]);

  useEffect(() => {
    const hero = getHeroContent();
    if (hero) setHeroForm({ title: hero.title, subtitle: hero.subtitle, description: hero.description, image_url: hero.image_url || '' });
    const about = getAboutContent();
    if (about) setAboutForm({ title: about.title, subtitle: about.subtitle, description: about.description });
    const services = getServicesContent();
    if (services) setServicesForm({ title: services.title, subtitle: services.subtitle, description: services.description });
    const contact = getContactContent();
    if (contact) setContactForm({ title: contact.title, subtitle: contact.subtitle, description: contact.description });
    const testimonials = getTestimonialsContent();
    if (testimonials) setTestimonialsForm({ title: testimonials.title, subtitle: testimonials.subtitle, description: testimonials.description });
  }, [siteContent, getHeroContent, getAboutContent, getServicesContent, getContactContent, getTestimonialsContent]);

  // Завантаження фотографій галереї при відкритті адмінки
  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (data) setGalleryImages(data);
    };
    if (isAuthenticated) fetchGallery();
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

  const handleSaveSettings = async () => { try { await updateSettings(settingsForm); setHasUnsavedChanges(false); } catch (err) {} };
  const handleSaveHero = async () => { try { await updateContent('hero', heroForm); setHasUnsavedChanges(false); } catch (err) {} };
  const handleSaveAbout = async () => { try { await updateContent('about', aboutForm); setHasUnsavedChanges(false); } catch (err) {} };
  const handleSaveServices = async () => { try { await updateContent('services', servicesForm); setHasUnsavedChanges(false); } catch (err) {} };
  const handleSaveContact = async () => { try { await updateContent('contact', contactForm); setHasUnsavedChanges(false); } catch (err) {} };
  const handleSaveTestimonials = async () => { try { await updateContent('testimonials', testimonialsForm); setHasUnsavedChanges(false); } catch (err) {} };
  const handleRefresh = async () => { await refreshContent(); setHasUnsavedChanges(false); };

  const handleSettingsChange = (field: string, value: string) => { setSettingsForm(prev => ({ ...prev, [field]: value })); setHasUnsavedChanges(true); };
  const handleHeroChange = (field: string, value: string) => { setHeroForm(prev => ({ ...prev, [field]: value })); setHasUnsavedChanges(true); };
  const handleAboutChange = (field: string, value: string) => { setAboutForm(prev => ({ ...prev, [field]: value })); setHasUnsavedChanges(true); };
  const handleServicesChange = (field: string, value: string) => { setServicesForm(prev => ({ ...prev, [field]: value })); setHasUnsavedChanges(true); };
  const handleContactChange = (field: string, value: string) => { setContactForm(prev => ({ ...prev, [field]: value })); setHasUnsavedChanges(true); };
  const handleTestimonialsChange = (field: string, value: string) => { setTestimonialsForm(prev => ({ ...prev, [field]: value })); setHasUnsavedChanges(true); };

  const renderSaveButton = (onSave: () => void) => (
    <Button onClick={onSave} disabled={isSaving} className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white">
      {isSaving ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
    </Button>
  );

  if (authLoading || contentLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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
              {hasUnsavedChanges && (
                <Badge variant="outline" className="border-amber-500/50 text-amber-400">
                  <AlertCircle className="w-3 h-3 mr-1" /> Unsaved Changes
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isSaving} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </Button>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  <Layout className="w-4 h-4 mr-2" /> View Site
                </Button>
              </a>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-slate-400 hover:text-white hover:bg-slate-800">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <TabsTrigger value="hero" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"><Sparkles className="w-4 h-4 mr-2" /> Hero</TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"><ImageIcon className="w-4 h-4 mr-2" /> Галерея</TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"><Type className="w-4 h-4 mr-2" /> About</TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"><Layout className="w-4 h-4 mr-2" /> Services</TabsTrigger>
            <TabsTrigger value="testimonials" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"><FileText className="w-4 h-4 mr-2" /> Відгуки</TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"><Mail className="w-4 h-4 mr-2" /> Contact</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"><Settings className="w-4 h-4 mr-2" /> Settings</TabsTrigger>
          </TabsList>

          {/* НОВА ВКАЛДКА: ГАЛЕРЕЯ */}
          <TabsContent value="gallery">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-500" />
                  Галерея робіт
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Завантажуйте фотографії. Вони автоматично з'являться на сторінці "Галерея" на сайті.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                
                {/* Блок завантаження */}
                <div className="p-8 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/30 flex flex-col items-center justify-center text-center hover:bg-slate-800/50 transition-colors">
                  <Upload className="w-10 h-10 text-slate-400 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Додати нове фото</h3>
                  <p className="text-slate-400 mb-6">Виберіть файл з комп'ютера або телефону</p>
                  
                  <div className="relative inline-block">
                    <Button disabled={isUploadingGallery} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-xl">
                      {isUploadingGallery ? 'Завантаження...' : 'Вибрати фото'}
                    </Button>
                    <Input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploadingGallery}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setIsUploadingGallery(true);
                          const loadingToast = toast.loading('Завантажуємо фото у хмару...');
                          const imageUrl = await uploadImage(file);
                          
                          const { error } = await supabase.from('gallery').insert([{ image_url: imageUrl, title: 'Робота до/після' }]);
                          if (error) throw error;
                          
                          const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
                          if (data) setGalleryImages(data);
                          
                          toast.dismiss(loadingToast);
                          toast.success('Фото успішно додано в галерею!');
                        } catch (error: any) {
                          toast.error(`Помилка: ${error.message}`);
                        } finally {
                          setIsUploadingGallery(false);
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                </div>

                <Separator className="bg-slate-800" />

                {/* Сітка завантажених фотографій */}
                <div>
                  <h3 className="text-xl font-medium text-white mb-6">Завантажені фотографії ({galleryImages.length})</h3>
                  {galleryImages.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">Тут поки порожньо.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {galleryImages.map((img) => (
                        <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-800 aspect-square">
                          <img src={img.image_url} alt="Gallery item" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={async () => {
                                if (!window.confirm('Ви впевнені, що хочете видалити це фото з сайту?')) return;
                                try {
                                  const { error } = await supabase.from('gallery').delete().eq('id', img.id);
                                  if (error) throw error;
                                  setGalleryImages(prev => prev.filter(p => p.id !== img.id));
                                  toast.success('Фото видалено');
                                } catch (err) {
                                  toast.error('Помилка видалення');
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Видалити
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* HERO TAB */}
          <TabsContent value="hero">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-rose-500" /> Hero Section</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2"><Label className="text-slate-300">Subtitle</Label><Input value={heroForm.subtitle} onChange={(e) => handleHeroChange('subtitle', e.target.value)} className="bg-slate-800 border-slate-700 text-white" /></div>
                <div className="space-y-2"><Label className="text-slate-300">Main Title</Label><Input value={heroForm.title} onChange={(e) => handleHeroChange('title', e.target.value)} className="bg-slate-800 border-slate-700 text-white text-lg" /></div>
                <div className="space-y-2"><Label className="text-slate-300">Description</Label><Textarea value={heroForm.description} onChange={(e) => handleHeroChange('description', e.target.value)} className="bg-slate-800 border-slate-700 text-white min-h-[120px]" /></div>
                
                <div className="space-y-2 pt-4 border-t border-slate-800">
                  <Label className="text-slate-300 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Головне фото (Hero Image)</Label>
                  <div className="flex items-center gap-4">
                    <Input type="file" accept="image/*" className="bg-slate-800 border-slate-700 text-slate-300 file:bg-slate-700 file:text-white file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 hover:file:bg-slate-600 cursor-pointer"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const loadingToast = toast.loading('Uploading image...');
                          const imageUrl = await uploadImage(file);
                          handleHeroChange('image_url', imageUrl);
                          toast.dismiss(loadingToast);
                          toast.success('Image uploaded! Click Save Changes to apply.');
                        } catch (error) { toast.error('Failed to upload image'); }
                      }}
                    />
                  </div>
                  {heroForm.image_url && (
                    <div className="mt-4 relative w-40 h-40 rounded-xl overflow-hidden border border-slate-700">
                      <img src={heroForm.image_url} alt="Hero preview" className="object-cover w-full h-full" />
                    </div>
                  )}
                </div>
                <div className="flex justify-end">{renderSaveButton(handleSaveHero)}</div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABOUT TAB */}
          <TabsContent value="about">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><Type className="w-5 h-5 text-rose-500" /> About Section</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2"><Label className="text-slate-300">Subtitle</Label><Input value={aboutForm.subtitle} onChange={(e) => handleAboutChange('subtitle', e.target.value)} className="bg-slate-800 border-slate-700 text-white" /></div>
                <div className="space-y-2"><Label className="text-slate-300">Main Title</Label><Input value={aboutForm.title} onChange={(e) => handleAboutChange('title', e.target.value)} className="bg-slate-800 border-slate-700 text-white text-lg" /></div>
                <div className="space-y-2"><Label className="text-slate-300">Description</Label><Textarea value={aboutForm.description} onChange={(e) => handleAboutChange('description', e.target.value)} className="bg-slate-800 border-slate-700 text-white min-h-[200px]" /></div>
                <div className="flex justify-end">{renderSaveButton(handleSaveAbout)}</div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SERVICES TAB */}
          <TabsContent value="services">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><Layout className="w-5 h-5 text-rose-500" /> Services Section</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2"><Label className="text-slate-300">Subtitle</Label><Input value={servicesForm.subtitle} onChange={(e) => handleServicesChange('subtitle', e.target.value)} className="bg-slate-800 border-slate-700 text-white" /></div>
                <div className="space-y-2"><Label className="text-slate-300">Main Title</Label><Input value={servicesForm.title} onChange={(e) => handleServicesChange('title', e.target.value)} className="bg-slate-800 border-slate-700 text-white text-lg" /></div>
                <div className="space-y-2"><Label className="text-slate-300">Description</Label><Textarea value={servicesForm.description} onChange={(e) => handleServicesChange('description', e.target.value)} className="bg-slate-800 border-slate-700 text-white min-h-[120px]" /></div>
                <div className="flex justify-end">{renderSaveButton(handleSaveServices)}</div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TESTIMONIALS TAB */}
          <TabsContent value="testimonials">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><FileText className="w-5 h-5 text-rose-500" /> Testimonials Section</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2"><Label className="text-slate-300">Subtitle</Label><Input value={testimonialsForm.subtitle} onChange={(e) => handleTestimonialsChange('subtitle', e.target.value)} className="bg-slate-800 border-slate-700 text-white" /></div>
                <div className="space-y-2"><Label className="text-slate-300">Main Title</Label><Input value={testimonialsForm.title} onChange={(e) => handleTestimonialsChange('title', e.target.value)} className="bg-slate-800 border-slate-700 text-white text-lg" /></div>
                <div className="space-y-2"><Label className="text-slate-300">Description</Label><Textarea value={testimonialsForm.description} onChange={(e) => handleTestimonialsChange('description', e.target.value)} className="bg-slate-800 border-slate-700 text-white min-h-[120px]" /></div>
                <div className="flex justify-end">{renderSaveButton(handleSaveTestimonials)}</div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONTACT TAB */}
          <TabsContent value="contact">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><Mail className="w-5 h-5 text-rose-500" /> Contact Section</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2"><Label className="text-slate-300">Subtitle</Label><Input value={contactForm.subtitle} onChange={(e) => handleContactChange('subtitle', e.target.value)} className="bg-slate-800 border-slate-700 text-white" /></div>
                <div className="space-y-2"><Label className="text-slate-300">Main Title</Label><Input value={contactForm.title} onChange={(e) => handleContactChange('title', e.target.value)} className="bg-slate-800 border-slate-700 text-white text-lg" /></div>
                <div className="space-y-2"><Label className="text-slate-300">Description</Label><Textarea value={contactForm.description} onChange={(e) => handleContactChange('description', e.target.value)} className="bg-slate-800 border-slate-700 text-white min-h-[120px]" /></div>
                <div className="flex justify-end">{renderSaveButton(handleSaveContact)}</div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><Settings className="w-5 h-5 text-rose-500" /> Clinic Settings</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><Label className="text-slate-300 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Clinic Name</Label><Input value={settingsForm.clinic_name} onChange={(e) => handleSettingsChange('clinic_name', e.target.value)} className="bg-slate-800 border-slate-700 text-white" /></div>
                  <div className="space-y-2"><Label className="text-slate-300 flex items-center gap-2"><Phone className="w-4 h-4" /> Phone Number</Label><Input value={settingsForm.phone} onChange={(e) => handleSettingsChange('phone', e.target.value)} className="bg-slate-800 border-slate-700 text-white" /></div>
                  <div className="space-y-2"><Label className="text-slate-300 flex items-center gap-2"><Mail className="w-4 h-4" /> Email Address</Label><Input value={settingsForm.email} onChange={(e) => handleSettingsChange('email', e.target.value)} className="bg-slate-800 border-slate-700 text-white" /></div>
                  <div className="space-y-2"><Label className="text-slate-300 flex items-center gap-2"><Instagram className="w-4 h-4" /> Instagram</Label><Input value={settingsForm.instagram} onChange={(e) => handleSettingsChange('instagram', e.target.value)} className="bg-slate-800 border-slate-700 text-white" /></div>
                  <div className="space-y-2 md:col-span-2"><Label className="text-slate-300 flex items-center gap-2"><MapPin className="w-4 h-4" /> Address</Label><Input value={settingsForm.address} onChange={(e) => handleSettingsChange('address', e.target.value)} className="bg-slate-800 border-slate-700 text-white" /></div>
                  <div className="space-y-2 md:col-span-2"><Label className="text-slate-300 flex items-center gap-2"><Clock className="w-4 h-4" /> Working Hours</Label><Input value={settingsForm.working_hours} onChange={(e) => handleSettingsChange('working_hours', e.target.value)} className="bg-slate-800 border-slate-700 text-white" /></div>
                </div>
                <Separator className="bg-slate-800" />
                <div className="flex justify-end">{renderSaveButton(handleSaveSettings)}</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ContentEditor;
