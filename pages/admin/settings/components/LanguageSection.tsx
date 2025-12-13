import React, { useState, useCallback } from 'react';
import { LanguageContent } from '../types/companyInfo';
import { Globe, Plus, X, Copy, Check } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface LanguageSectionProps {
  data: LanguageContent[];
  onChange: (data: LanguageContent[]) => void;
}

const commonLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
];

export const LanguageSection: React.FC<LanguageSectionProps> = ({
  data,
  onChange,
}) => {
  const [activeLanguage, setActiveLanguage] = useState<string>(
    data.length > 0 ? data[0].language : 'en'
  );
  const [copied, setCopied] = useState<string | null>(null);

  const currentLanguage = data.find(l => l.language === activeLanguage) || data[0];

  const handleLanguageSelect = (language: string) => {
    setActiveLanguage(language);
  };

  const handleAddLanguage = (language: string) => {
    if (!data.find(l => l.language === language)) {
      const firstLanguage = data[0];
      const newLanguage: LanguageContent = {
        language,
        companyName: '',
        aboutText: '',
        description: '',
      };
      onChange([...data, newLanguage]);
      setActiveLanguage(language);
    }
  };

  const handleRemoveLanguage = (language: string) => {
    if (data.length > 1) {
      const filtered = data.filter(l => l.language !== language);
      onChange(filtered);
      setActiveLanguage(filtered[0].language);
    }
  };

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(
      data.map(l =>
        l.language === activeLanguage
          ? { ...l, companyName: e.target.value }
          : l
      )
    );
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(
      data.map(l =>
        l.language === activeLanguage
          ? { ...l, description: e.target.value }
          : l
      )
    );
  };

  const handleAboutTextChange = (aboutText: string) => {
    onChange(
      data.map(l =>
        l.language === activeLanguage
          ? { ...l, aboutText }
          : l
      )
    );
  };

  const copyFromLanguage = useCallback((fromLanguage: string) => {
    const source = data.find(l => l.language === fromLanguage);
    if (source) {
      onChange(
        data.map(l =>
          l.language === activeLanguage
            ? {
              ...l,
              companyName: source.companyName,
              aboutText: source.aboutText,
              description: source.description,
            }
            : l
        )
      );
      setCopied(fromLanguage);
      setTimeout(() => setCopied(null), 2000);
    }
  }, [data, activeLanguage, onChange]);

  const availableLanguagesToAdd = commonLanguages.filter(
    lang => !data.find(l => l.language === lang.code)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Globe size={20} className="text-purple-500" />
        Multi-Language Support
      </h3>

      {/* Language Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {data.map(lang => (
            <div key={lang.language} className="relative">
              <button
                onClick={() => handleLanguageSelect(lang.language)}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeLanguage === lang.language
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {commonLanguages.find(l => l.code === lang.language)?.name ||
                  lang.language.toUpperCase()}
              </button>

              {data.length > 1 && (
                <button
                  onClick={() => handleRemoveLanguage(lang.language)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}

          {/* Add Language Button */}
          {availableLanguagesToAdd.length > 0 && (
            <div className="relative group">
              <button className="px-4 py-2 rounded-lg font-medium border-2 border-dashed border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-500 transition flex items-center gap-2">
                <Plus size={18} />
                Add Language
              </button>

              {/* Dropdown */}
              <div className="absolute left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 hidden group-hover:block min-w-max">
                {availableLanguagesToAdd.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleAddLanguage(lang.code)}
                    className="block w-full text-left px-4 py-2 hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg transition"
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Language Content */}
      {currentLanguage && (
        <div className="space-y-6">
          {/* Copy from other languages */}
          {data.length > 1 && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 mb-3">
                <strong>Copy content from another language:</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {data
                  .filter(l => l.language !== activeLanguage)
                  .map(lang => (
                    <button
                      key={lang.language}
                      onClick={() =>
                        copyFromLanguage(lang.language)
                      }
                      className={`px-3 py-2 text-sm rounded-lg transition flex items-center gap-1 ${copied === lang.language
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-100'
                        }`}
                    >
                      {copied === lang.language ? (
                        <>
                          <Check size={14} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          From{' '}
                          {commonLanguages.find(
                            l => l.code === lang.language
                          )?.name || lang.language}
                        </>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={currentLanguage.companyName}
              onChange={handleCompanyNameChange}
              placeholder="Enter company name in this language"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <textarea
              value={currentLanguage.description}
              onChange={handleDescriptionChange}
              placeholder="Brief description of your company"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* About Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Text
            </label>
            <RichTextEditor
              value={currentLanguage.aboutText}
              onChange={handleAboutTextChange}
              placeholder="Detailed about text for your company"
              rows={6}
            />
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-900">
          <strong>🌍 Localization Tips:</strong>
          <br />
          • Translate content naturally, not just word-for-word
          <br />
          • Adapt messaging for cultural relevance
          <br />
          • Use the "Copy" feature to start with existing content
          <br />• Keep translations consistent with your brand voice
        </p>
      </div>
    </div>
  );
};
