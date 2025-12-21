import React, { useState } from 'react';
import { Save, AlertCircle, CheckCircle, X } from 'lucide-react';
import {
  CompanyInformationData,
  BusinessHour,
  LanguageContent,
} from './types/companyInfo';
import { CompanyIdentity } from './components/CompanyIdentitySection';
import { ContactInformationSection } from './components/ContactInformationSection';
import { BusinessRegistrationSection } from './components/BusinessRegistrationSection';
import { BankingInformationSection } from './components/BankingInformationSection';
import { SocialMediaSection } from './components/SocialMediaSection';
import { BusinessHoursSection } from './components/BusinessHoursSection';
import { CompanyDescriptionSection } from './components/CompanyDescriptionSection';
import { LanguageSection } from './components/LanguageSection';
import { LogoUploadModal } from './components/LogoUploadModal';

type TabType =
  | 'identity'
  | 'contact'
  | 'registration'
  | 'banking'
  | 'social'
  | 'hours'
  | 'description'
  | 'languages';

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'identity', label: 'Company Identity', icon: '🏢' },
  { id: 'contact', label: 'Contact Info', icon: '📞' },
  { id: 'registration', label: 'Registration', icon: '📋' },
  { id: 'banking', label: 'Banking', icon: '🏦' },
  { id: 'social', label: 'Social Media', icon: '🔗' },
  { id: 'hours', label: 'Business Hours', icon: '⏰' },
  { id: 'description', label: 'Description', icon: '📝' },
  { id: 'languages', label: 'Languages', icon: '🌍' },
];

export const CompanyInformationSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('identity');
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  // Initialize with default data
  const [data, setData] = useState<CompanyInformationData>({
    identity: {
      companyName: 'Swett Booking System',
      logo: null,
    },
    contact: {
      address: '',
      phoneNumber: '',
      emailAddress: '',
    },
    businessRegistration: {
      businessRegistrationNumber: '',
      vatTaxId: '',
      additionalStatutoryIds: '',
    },
    banking: {
      bankName: '',
      accountNumber: '',
      ifscSwift: '',
      branchName: '',
    },
    socialMedia: [],
    businessHours: [
      { day: 'monday', openingTime: '09:00', closingTime: '18:00', isClosed: false },
      { day: 'tuesday', openingTime: '09:00', closingTime: '18:00', isClosed: false },
      { day: 'wednesday', openingTime: '09:00', closingTime: '18:00', isClosed: false },
      { day: 'thursday', openingTime: '09:00', closingTime: '18:00', isClosed: false },
      { day: 'friday', openingTime: '09:00', closingTime: '18:00', isClosed: false },
      { day: 'saturday', openingTime: '10:00', closingTime: '16:00', isClosed: false },
      { day: 'sunday', openingTime: '00:00', closingTime: '00:00', isClosed: true },
    ],
    description: {
      aboutText: '',
    },
    languageContent: [
      {
        language: 'en',
        companyName: 'Swett Booking System',
        aboutText: '',
        description: '',
      },
    ],
  });

  const handleLogoUpload = (preview: string, fileName: string) => {
    setData(prevData => ({
      ...prevData,
      identity: {
        ...prevData.identity,
        logo: preview,
        logoFileName: fileName,
      },
    }));
    setLogoModalOpen(false);
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    setSaveMessage('');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validate required fields
      const errors = [];
      if (!data.identity.companyName.trim()) errors.push('Company name is required');
      if (!data.contact.address.trim()) errors.push('Address is required');
      if (!data.contact.phoneNumber.trim()) errors.push('Phone number is required');
      if (!data.contact.emailAddress.trim()) errors.push('Email address is required');

      if (errors.length > 0) {
        setSaveStatus('error');
        setSaveMessage(`Please fix: ${errors.join(', ')}`);
        return;
      }

      setSaveStatus('success');
      setSaveMessage('Company information saved successfully!');

      // Log data to console (since no backend)
      console.log('Company Information Data:', data);

      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage('Failed to save. Please try again.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to discard all changes?')) {
      setData({
        identity: {
          companyName: 'Swett Booking System',
          logo: null,
        },
        contact: {
          address: '',
          phoneNumber: '',
          emailAddress: '',
        },
        businessRegistration: {
          businessRegistrationNumber: '',
          vatTaxId: '',
          additionalStatutoryIds: '',
        },
        banking: {
          bankName: '',
          accountNumber: '',
          ifscSwift: '',
          branchName: '',
        },
        socialMedia: [],
        businessHours: [
          { day: 'monday', openingTime: '09:00', closingTime: '18:00', isClosed: false },
          { day: 'tuesday', openingTime: '09:00', closingTime: '18:00', isClosed: false },
          { day: 'wednesday', openingTime: '09:00', closingTime: '18:00', isClosed: false },
          { day: 'thursday', openingTime: '09:00', closingTime: '18:00', isClosed: false },
          { day: 'friday', openingTime: '09:00', closingTime: '18:00', isClosed: false },
          { day: 'saturday', openingTime: '10:00', closingTime: '16:00', isClosed: false },
          { day: 'sunday', openingTime: '00:00', closingTime: '00:00', isClosed: true },
        ],
        description: {
          aboutText: '',
        },
        languageContent: [
          {
            language: 'en',
            companyName: 'Swett Booking System',
            aboutText: '',
            description: '',
          },
        ],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Company Information</h1>
              <p className="text-gray-600 mt-1">
                Manage your company profile, contact details, and business settings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Messages */}
        {saveStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600" />
            <p className="text-green-800">{saveMessage}</p>
            <button
              onClick={() => setSaveStatus('idle')}
              className="ml-auto text-green-600 hover:text-green-700"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-red-800">{saveMessage}</p>
            <button
              onClick={() => setSaveStatus('idle')}
              className="ml-auto text-red-600 hover:text-red-700"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {saveStatus === 'saving' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
            <div className="animate-spin">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
            <p className="text-blue-800">Saving your changes...</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'identity' && (
            <CompanyIdentity
              data={data.identity}
              onChange={identity => setData({ ...data, identity })}
              onLogoModalOpen={() => setLogoModalOpen(true)}
            />
          )}

          {activeTab === 'contact' && (
            <ContactInformationSection
              data={data.contact}
              onChange={contact => setData({ ...data, contact })}
            />
          )}

          {activeTab === 'registration' && (
            <BusinessRegistrationSection
              data={data.businessRegistration}
              onChange={businessRegistration =>
                setData({ ...data, businessRegistration })
              }
            />
          )}

          {activeTab === 'banking' && (
            <BankingInformationSection
              data={data.banking}
              onChange={banking => setData({ ...data, banking })}
            />
          )}

          {activeTab === 'social' && (
            <SocialMediaSection
              data={data.socialMedia}
              onChange={socialMedia => setData({ ...data, socialMedia })}
            />
          )}

          {activeTab === 'hours' && (
            <BusinessHoursSection
              data={data.businessHours}
              onChange={businessHours => setData({ ...data, businessHours })}
            />
          )}

          {activeTab === 'description' && (
            <CompanyDescriptionSection
              data={data.description}
              onChange={description => setData({ ...data, description })}
            />
          )}

          {activeTab === 'languages' && (
            <LanguageSection
              data={data.languageContent}
              onChange={languageContent =>
                setData({ ...data, languageContent })
              }
            />
          )}

          {/* Footer Actions */}
          <div className="flex gap-3 pt-6">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="flex-1 sm:flex-none px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition font-medium flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>

            <button
              onClick={handleReset}
              disabled={saveStatus === 'saving'}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Logo Upload Modal */}
      <LogoUploadModal
        isOpen={logoModalOpen}
        onClose={() => setLogoModalOpen(false)}
        onUpload={handleLogoUpload}
      />
    </div>
  );
};
