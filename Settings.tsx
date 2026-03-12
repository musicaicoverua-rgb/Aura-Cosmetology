import { useState } from 'react';
import { Save, Bell, Shield, CreditCard, Mail } from 'lucide-react';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'payments'>('general');
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    clinicName: 'AURA Luxe Clinic',
    timezone: 'Europe/Kyiv',
    currency: 'UAH',
    language: 'uk',
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    reviewNotifications: true,
    stripePublicKey: '',
    stripeSecretKey: '',
    emailProvider: 'sendgrid',
    emailApiKey: '',
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4A24F] text-white rounded-lg hover:bg-[#c49345] transition-colors disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#D4A24F] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
            <input
              type="text"
              value={settings.clinicName}
              onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
              >
                <option value="Europe/Kyiv">Europe/Kyiv (GMT+2)</option>
                <option value="Europe/Warsaw">Europe/Warsaw (GMT+1)</option>
                <option value="Europe/Berlin">Europe/Berlin (GMT+1)</option>
                <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
              >
                <option value="UAH">UAH (₴)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="PLN">PLN (zł)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
            >
              <option value="uk">Українська</option>
              <option value="en">English</option>
              <option value="ru">Русский</option>
            </select>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#D4A24F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4A24F]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#D4A24F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4A24F]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Appointment Reminders</p>
                <p className="text-sm text-gray-500">Send reminders before appointments</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.appointmentReminders}
                  onChange={(e) => setSettings({ ...settings, appointmentReminders: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#D4A24F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4A24F]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Review Notifications</p>
                <p className="text-sm text-gray-500">Get notified about new reviews</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.reviewNotifications}
                  onChange={(e) => setSettings({ ...settings, reviewNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#D4A24F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4A24F]"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Payments */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold mb-4">Payment Settings (Stripe)</h2>
          
          <div className="p-4 bg-yellow-50 rounded-lg mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Enter your Stripe API keys to enable online payments. 
              Keep your secret key secure and never share it.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Public Key</label>
            <input
              type="text"
              value={settings.stripePublicKey}
              onChange={(e) => setSettings({ ...settings, stripePublicKey: e.target.value })}
              placeholder="pk_test_..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Secret Key</label>
            <input
              type="password"
              value={settings.stripeSecretKey}
              onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
              placeholder="sk_test_..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
            />
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Mail size={18} />
              Email Provider Settings
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Provider</label>
              <select
                value={settings.emailProvider}
                onChange={(e) => setSettings({ ...settings, emailProvider: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
              >
                <option value="sendgrid">SendGrid</option>
                <option value="mailgun">Mailgun</option>
                <option value="smtp">Custom SMTP</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input
                type="password"
                value={settings.emailApiKey}
                onChange={(e) => setSettings({ ...settings, emailApiKey: e.target.value })}
                placeholder="Enter your email provider API key"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};