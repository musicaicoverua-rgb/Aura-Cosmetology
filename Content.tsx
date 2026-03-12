import { useState } from 'react';
import { Save, Globe, Phone, Mail, MapPin, Clock } from 'lucide-react';

interface ContentSection {
  id: string;
  key: string;
  label: string;
  icon: React.ElementType;
  values: Record<string, string>;
}

export const Content = () => {
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [saving, setSaving] = useState(false);

  const languages = [
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  ];

  const [content, setContent] = useState<ContentSection[]>([
    {
      id: '1',
      key: 'phone',
      label: 'Phone Number',
      icon: Phone,
      values: {
        uk: '+38 044 000 00 00',
        en: '+38 044 000 00 00',
        ru: '+38 044 000 00 00',
        es: '+38 044 000 00 00',
        fr: '+38 044 000 00 00',
        de: '+38 044 000 00 00',
        pl: '+38 044 000 00 00',
        cs: '+38 044 000 00 00',
      },
    },
    {
      id: '2',
      key: 'email',
      label: 'Email Address',
      icon: Mail,
      values: {
        uk: 'hello@auraclinic.ua',
        en: 'hello@auraclinic.ua',
        ru: 'hello@auraclinic.ua',
        es: 'hello@auraclinic.ua',
        fr: 'hello@auraclinic.ua',
        de: 'hello@auraclinic.ua',
        pl: 'hello@auraclinic.ua',
        cs: 'hello@auraclinic.ua',
      },
    },
    {
      id: '3',
      key: 'address',
      label: 'Address',
      icon: MapPin,
      values: {
        uk: 'вул. Рейтарська 12Б, Київ, Україна',
        en: '12B Reitarska St, Kyiv, Ukraine',
        ru: 'ул. Рейтарская 12Б, Киев, Украина',
        es: 'Calle Reitarska 12B, Kiev, Ucrania',
        fr: '12B Rue Reitarska, Kiev, Ukraine',
        de: 'Reitarska Str. 12B, Kiew, Ukraine',
        pl: 'ul. Reitarska 12B, Kijów, Ukraina',
        cs: 'Reitarska ul. 12B, Kyjev, Ukrajina',
      },
    },
    {
      id: '4',
      key: 'working_hours',
      label: 'Working Hours',
      icon: Clock,
      values: {
        uk: 'Пн–Пт: 09:00–20:00, Сб: 10:00–18:00, Нд: Зачинено',
        en: 'Mon–Fri: 09:00–20:00, Sat: 10:00–18:00, Sun: Closed',
        ru: 'Пн–Пт: 09:00–20:00, Сб: 10:00–18:00, Вс: Закрыто',
        es: 'Lun–Vie: 09:00–20:00, Sáb: 10:00–18:00, Dom: Cerrado',
        fr: 'Lun–Ven: 09:00–20:00, Sam: 10:00–18:00, Dim: Fermé',
        de: 'Mo–Fr: 09:00–20:00, Sa: 10:00–18:00, So: Geschlossen',
        pl: 'Pn–Pt: 09:00–20:00, Sob: 10:00–18:00, Ndz: Zamknięte',
        cs: 'Po–Pá: 09:00–20:00, So: 10:00–18:00, Ne: Zavřeno',
      },
    },
  ]);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Content saved successfully!');
  };

  const updateContent = (id: string, value: string) => {
    setContent(
      content.map((item) =>
        item.id === id
          ? { ...item, values: { ...item.values, [activeLanguage]: value } }
          : item
      )
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display">Site Content</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4A24F] text-white rounded-lg hover:bg-[#c49345] transition-colors disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Language Selector */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={18} className="text-gray-500" />
          <span className="font-medium">Select Language</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setActiveLanguage(lang.code)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeLanguage === lang.code
                  ? 'bg-[#D4A24F] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {content.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#D4A24F]/10 rounded-lg">
                  <Icon size={20} className="text-[#D4A24F]" />
                </div>
                <h3 className="font-semibold">{section.label}</h3>
              </div>
              <textarea
                value={section.values[activeLanguage]}
                onChange={(e) => updateContent(section.id, e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D4A24F] min-h-[80px]"
                placeholder={`Enter ${section.label.toLowerCase()} in ${
                  languages.find((l) => l.code === activeLanguage)?.name
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* SEO Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <h3 className="font-semibold mb-4">SEO Metadata</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
            <input
              type="text"
              defaultValue="AURA Luxe Clinic - Premium Aesthetic Medicine"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea
              defaultValue="Experience personalized aesthetic care at AURA Luxe Clinic. Our team of experts provides subtle, natural-looking results."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F] min-h-[80px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
            <input
              type="text"
              defaultValue="aesthetic clinic, beauty treatments, facial, skincare, Kyiv"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};