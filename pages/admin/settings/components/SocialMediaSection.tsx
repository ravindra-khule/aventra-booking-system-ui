import React from 'react';
import { SocialMediaLink } from '../types/companyInfo';
import { X, Plus } from 'lucide-react';
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from 'lucide-react';

interface SocialMediaSectionProps {
  data: SocialMediaLink[];
  onChange: (data: SocialMediaLink[]) => void;
}

const socialPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { id: 'twitter', name: 'Twitter / X', icon: Twitter, color: '#000000' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' },
] as const;

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  data,
  onChange,
}) => {
  const handleUrlChange = (platform: SocialMediaLink['platform'], url: string) => {
    const existing = data.find(link => link.platform === platform);
    if (existing) {
      onChange(data.map(link =>
        link.platform === platform ? { ...link, url } : link
      ));
    } else {
      onChange([...data, { platform, url }]);
    }
  };

  const handleRemove = (platform: SocialMediaLink['platform']) => {
    onChange(data.filter(link => link.platform !== platform));
  };

  const addSocialLink = (platform: SocialMediaLink['platform']) => {
    if (!data.find(link => link.platform === platform)) {
      onChange([...data, { platform, url: '' }]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Social Media Links</h3>

      <div className="space-y-4">
        {socialPlatforms.map(({ id, name, icon: Icon, color }) => {
          const link = data.find(l => l.platform === id as SocialMediaLink['platform']);

          return (
            <div key={id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  style={{ color }}
                  className="flex-shrink-0"
                >
                  <Icon size={20} />
                </div>
                <h4 className="text-sm font-medium text-gray-900">{name}</h4>
                {link && link.url && (
                  <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Connected
                  </span>
                )}
              </div>

              {link ? (
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) =>
                      handleUrlChange(id as SocialMediaLink['platform'], e.target.value)
                    }
                    placeholder={`https://${id}.com/yourprofile`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <button
                    onClick={() =>
                      handleRemove(id as SocialMediaLink['platform'])
                    }
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    addSocialLink(id as SocialMediaLink['platform'])
                  }
                  className="w-full px-3 py-2 border border-gray-300 border-dashed rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add {name}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 mt-6 p-3 bg-blue-50 rounded">
        💡 Tip: Enter full URLs (e.g., https://facebook.com/yourpage) to make them clickable
      </p>
    </div>
  );
};
