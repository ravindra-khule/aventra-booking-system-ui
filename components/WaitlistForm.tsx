import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tour } from '../types';
import { WaitlistService } from '../services/api';
import { useTranslation } from '../context/LanguageContext';
import { CheckCircle2 } from 'lucide-react';
import { Modal, Button, Input } from '../src/shared/components/ui';

interface WaitlistFormProps {
  tour: Tour;
  onClose: () => void;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ tour, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    participants: 1,
    preferredDate: '',
    message: ''
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await WaitlistService.create({
        tourId: tour.id,
        tourTitle: tour.title,
        ...formData
      });
      
      setIsSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        navigate('/');
      }, 2000);
    } catch (error) {
      alert('Failed to submit waitlist request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Modal isOpen={true} onClose={onClose} size="sm" showCloseButton={false}>
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('waitlist.successTitle')}</h2>
          <p className="text-gray-600">{t('waitlist.successMessage')}</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={t('waitlist.title')}
      size="lg"
    >
      {/* Tour Info */}
      <div className="mb-4">
        <p className="text-gray-600">{tour.title}</p>
      </div>

      {/* Info Banner */}
      <div className="bg-orange-50 border border-orange-100 rounded-lg px-4 py-3 mb-6">
        <p className="text-sm text-orange-800">
          <strong>{t('waitlist.infoTitle')}</strong> {t('waitlist.infoText')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('booking.payer.firstName')}
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              fullWidth
            />

            <Input
              label={t('booking.payer.lastName')}
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              fullWidth
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('booking.payer.email')}
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              fullWidth
            />

            <Input
              label={t('booking.payer.phone')}
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              fullWidth
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('waitlist.participants')}
              type="number"
              min={1}
              max={20}
              required
              value={formData.participants}
              onChange={(e) => handleChange('participants', parseInt(e.target.value) || 1)}
              fullWidth
            />

            <Input
              label={t('waitlist.preferredDate')}
              type="date"
              value={formData.preferredDate}
              onChange={(e) => handleChange('preferredDate', e.target.value)}
              fullWidth
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('waitlist.message')}
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder={t('waitlist.messagePlaceholder')}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
            >
              {t('waitlist.submitBtn')}
            </Button>
          </div>
        </form>
    </Modal>
  );
};
