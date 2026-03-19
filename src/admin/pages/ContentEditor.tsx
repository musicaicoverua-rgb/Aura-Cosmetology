// ============================================================================
// CONTENT EDITOR - ADMIN DASHBOARD
// ============================================================================
// Dynamic CMS interface for editing all website content
// Implements pessimistic UI updates with strict error handling
// Shows success toast ONLY after database confirms the update
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
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// =============================================================================
// COMPONENT
// =============================================================================

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

  // ---------------------------------------------------------------------------
  // LOCAL STATE FOR FORM FIELDS
  // ---------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState('hero');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    clinic_name: '',
    phone: '',
    email: '',
    instagram: '',
    address: '',
    working_hours: '',
  });

  // Hero section form state
  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    description: '',
  });

  // About section form state
  const [aboutForm, setAboutForm] = useState({
    title: '',
    subtitle: '',
    description: '',
  });

  // Services section form state
  const [servicesForm, setServicesForm] = useState({
    title: '',
    subtitle: '',
    description: '',
  });

  // Contact section form state
  const [contactForm, setContactForm] = useState({
    title: '',
    subtitle: '',
    description: '',
  });

  // Testimonials section form state
  const [testimonialsForm, setTestimonialsForm] = useState({
    title: '',
    subtitle: '',
    description: '',
  });

  // ---------------------------------------------------------------------------
  // AUTH CHECK - Redirect if not authenticated
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // ---------------------------------------------------------------------------
  // INITIALIZE FORM VALUES FROM DATABASE
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (settings) {
      setSettingsForm({
        clinic_name: settings.clinic_name,
        phone: settings.phone,
        email: settings.email,
        instagram: settings.instagram,
        address: settings.address,
        working_hours: settings.working_hours,
      });
    }
  }, [settings]);

  useEffect(() => {
    const hero = getHeroContent();
    if (hero) {
      setHeroForm({
        title: hero.title,
        subtitle: hero.subtitle,
        description: hero.description,
      });
    }
  }, [siteContent, getHeroContent]);

  useEffect(() => {
    const about = getAboutContent();
    if (about) {
      setAboutForm({
        title: about.title,
        subtitle: about.subtitle,
        description: about.description,
      });
    }
  }, [siteContent, getAboutContent]);

  useEffect(() => {
    const services = getServicesContent();
    if (services) {
      setServicesForm({
        title: services.title,
        subtitle: services.subtitle,
        description: services.description,
      });
    }
  }, [siteContent, getServicesContent]);

  useEffect(() => {
    const contact = getContactContent();
    if (contact) {
      setContactForm({
        title: contact.title,
        subtitle: contact.subtitle,
        description: contact.description,
      });
    }
  }, [siteContent, getContactContent]);

  useEffect(() => {
    const testimonials = getTestimonialsContent();
    if (testimonials) {
      setTestimonialsForm({
        title: testimonials.title,
        subtitle: testimonials.subtitle,
        description: testimonials.description,
      });
    }
  }, [siteContent, getTestimonialsContent]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/admin/login');
    } catch (err) {
      toast.error('Failed to sign out');
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings(settingsForm);
      setHasUnsavedChanges(false);
    } catch (err) {
      // Error is already handled in updateSettings
      console.error('Settings save failed:', err);
    }
  };

  const handleSaveHero = async () => {
    try {
      await updateContent('hero', heroForm);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Hero save failed:', err);
    }
  };

  const handleSaveAbout = async () => {
    try {
      await updateContent('about', aboutForm);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('About save failed:', err);
    }
  };

  const handleSaveServices = async () => {
    try {
      await updateContent('services', servicesForm);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Services save failed:', err);
    }
  };

  const handleSaveContact = async () => {
    try {
      await updateContent('contact', contactForm);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Contact save failed:', err);
    }
  };

  const handleSaveTestimonials = async () => {
    try {
      await updateContent('testimonials', testimonialsForm);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Testimonials save failed:', err);
    }
  };

  const handleRefresh = async () => {
    await refreshContent();
    setHasUnsavedChanges(false);
  };

  // ---------------------------------------------------------------------------
  // FORM CHANGE HANDLERS
  // ---------------------------------------------------------------------------

  const handleSettingsChange = (field: string, value: string) => {
    setSettingsForm((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleHeroChange = (field: string, value: string) => {
    setHeroForm((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleAboutChange = (field: string, value: string) => {
    setAboutForm((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleServicesChange = (field: string, value: string) => {
    setServicesForm((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleContactChange = (field: string, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleTestimonialsChange = (field: string, value: string) => {
    setTestimonialsForm((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  // ---------------------------------------------------------------------------
  // RENDER HELPERS
  // ---------------------------------------------------------------------------

  const renderSaveButton = (onSave: () => void) => (
    <Button
      onClick={onSave}
      disabled={isSaving}
      className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white"
    >
      {isSaving ? (
        <>
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </>
      )}
    </Button>
  );

  // ---------------------------------------------------------------------------
  // LOADING STATE
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // MAIN RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  Aura Cosmetology
                </h1>
                <p className="text-xs text-slate-400">Admin Dashboard</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <Badge
                  variant="outline"
                  className="border-amber-500/50 text-amber-400"
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isSaving}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>

              <a href="/" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Layout className="w-4 h-4 mr-2" />
                  View Site
                </Button>
              </a>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/30 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Welcome Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-rose-500/10 to-purple-600/10 rounded-2xl border border-rose-500/20">
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome back, {user?.email?.split('@')[0] || 'Admin'}!
          </h2>
          <p className="text-slate-400">
            Manage your website content below. Changes are saved directly to the
            database and will be visible on the live site immediately.
          </p>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 flex flex-wrap h-auto gap-1">
            <TabsTrigger
              value="hero"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Hero
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              <Type className="w-4 h-4 mr-2" />
              About
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              <Layout className="w-4 h-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger
              value="testimonials"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Testimonials
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* HERO TAB */}
          <TabsContent value="hero">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  Hero Section
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Edit the main hero section content displayed on the homepage.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Subtitle</Label>
                  <Input
                    value={heroForm.subtitle}
                    onChange={(e) =>
                      handleHeroChange('subtitle', e.target.value)
                    }
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="e.g., Premium Aesthetic Medicine"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Main Title</Label>
                  <Input
                    value={heroForm.title}
                    onChange={(e) => handleHeroChange('title', e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white text-lg"
                    placeholder="e.g., Reveal Your Natural Beauty"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Description</Label>
                  <Textarea
                    value={heroForm.description}
                    onChange={(e) =>
                      handleHeroChange('description', e.target.value)
                    }
                    className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                    placeholder="Enter hero section description..."
                  />
                </div>
                <div className="flex justify-end">
                  {renderSaveButton(handleSaveHero)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABOUT TAB */}
          <TabsContent value="about">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Type className="w-5 h-5 text-rose-500" />
                  About Section
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Edit the about section content.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Subtitle</Label>
                  <Input
                    value={aboutForm.subtitle}
                    onChange={(e) =>
                      handleAboutChange('subtitle', e.target.value)
                    }
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="e.g., About Aura Cosmetology"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Main Title</Label>
                  <Input
                    value={aboutForm.title}
                    onChange={(e) =>
                      handleAboutChange('title', e.target.value)
                    }
                    className="bg-slate-800 border-slate-700 text-white text-lg"
                    placeholder="e.g., Where Science Meets Artistry"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Description</Label>
                  <Textarea
                    value={aboutForm.description}
                    onChange={(e) =>
                      handleAboutChange('description', e.target.value)
                    }
                    className="bg-slate-800 border-slate-700 text-white min-h-[200px]"
                    placeholder="Enter about section description..."
                  />
                </div>
                <div className="flex justify-end">
                  {renderSaveButton(handleSaveAbout)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SERVICES TAB */}
          <TabsContent value="services">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Layout className="w-5 h-5 text-rose-500" />
                  Services Section
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Edit the services section content.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Subtitle</Label>
                  <Input
                    value={servicesForm.subtitle}
                    onChange={(e) =>
                      handleServicesChange('subtitle', e.target.value)
                    }
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="e.g., Premium Services"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Main Title</Label>
                  <Input
                    value={servicesForm.title}
                    onChange={(e) =>
                      handleServicesChange('title', e.target.value)
                    }
                    className="bg-slate-800 border-slate-700 text-white text-lg"
                    placeholder="e.g., Our Signature Treatments"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Description</Label>
                  <Textarea
                    value={servicesForm.description}
                    onChange={(e) =>
                      handleServicesChange('description', e.target.value)
                    }
                    className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                    placeholder="Enter services section description..."
                  />
                </div>
                <div className="flex justify-end">
                  {renderSaveButton(handleSaveServices)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TESTIMONIALS TAB */}
          <TabsContent value="testimonials">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-500" />
                  Testimonials Section
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Edit the testimonials section content.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Subtitle</Label>
                  <Input
                    value={testimonialsForm.subtitle}
                    onChange={(e) =>
                      handleTestimonialsChange('subtitle', e.target.value)
                    }
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="e.g., Client Stories"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Main Title</Label>
                  <Input
                    value={testimonialsForm.title}
                    onChange={(e) =>
                      handleTestimonialsChange('title', e.target.value)
                    }
                    className="bg-slate-800 border-slate-700 text-white text-lg"
                    placeholder="e.g., What Our Clients Say"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Description</Label>
                  <Textarea
                    value={testimonialsForm.description}
                    onChange={(e) =>
                      handleTestimonialsChange('description', e.target.value)
                    }
                    className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                    placeholder="Enter testimonials section description..."
                  />
                </div>
                <div className="flex justify-end">
                  {renderSaveButton(handleSaveTestimonials)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONTACT TAB */}
          <TabsContent value="contact">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-rose-500" />
                  Contact Section
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Edit the contact section content.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Subtitle</Label>
                  <Input
                    value={contactForm.subtitle}
                    onChange={(e) =>
                      handleContactChange('subtitle', e.target.value)
                    }
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="e.g., Get In Touch"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Main Title</Label>
                  <Input
                    value={contactForm.title}
                    onChange={(e) =>
                      handleContactChange('title', e.target.value)
                    }
                    className="bg-slate-800 border-slate-700 text-white text-lg"
                    placeholder="e.g., Begin Your Transformation"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Description</Label>
                  <Textarea
                    value={contactForm.description}
                    onChange={(e) =>
                      handleContactChange('description', e.target.value)
                    }
                    className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                    placeholder="Enter contact section description..."
                  />
                </div>
                <div className="flex justify-end">
                  {renderSaveButton(handleSaveContact)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-rose-500" />
                  Clinic Settings
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your clinic information and contact details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Clinic Name
                    </Label>
                    <Input
                      value={settingsForm.clinic_name}
                      onChange={(e) =>
                        handleSettingsChange('clinic_name', e.target.value)
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      value={settingsForm.phone}
                      onChange={(e) =>
                        handleSettingsChange('phone', e.target.value)
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      value={settingsForm.email}
                      onChange={(e) =>
                        handleSettingsChange('email', e.target.value)
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300 flex items-center gap-2">
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </Label>
                    <Input
                      value={settingsForm.instagram}
                      onChange={(e) =>
                        handleSettingsChange('instagram', e.target.value)
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </Label>
                    <Input
                      value={settingsForm.address}
                      onChange={(e) =>
                        handleSettingsChange('address', e.target.value)
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-300 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Working Hours
                    </Label>
                    <Input
                      value={settingsForm.working_hours}
                      onChange={(e) =>
                        handleSettingsChange('working_hours', e.target.value)
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <Separator className="bg-slate-800" />

                <div className="flex justify-end">
                  {renderSaveButton(handleSaveSettings)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ContentEditor;
