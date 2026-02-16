import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tour } from '../types';
import { TourService } from '../services/api';
import { useTranslation } from 'react-i18next';
import { WaitlistForm } from '../components/WaitlistForm';
import { ArrowLeft, Check, Calendar, Users, Shield, AlertCircle } from 'lucide-react';
import { Button, Badge, Card } from '../src/shared/components/ui';
import { formatCurrency, formatDate } from '../src/shared/utils';

export const TourDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tour, setTour] = useState<Tour | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      if (id) {
        const data = await TourService.getById(id);
        setTour(data);
      }
      setLoading(false);
    };
    fetchTour();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">{t('common:loading')}</div>;
  if (!tour) return <div className="min-h-screen flex items-center justify-center">{t('tourDetails:tourNotFound')}</div>;

  const isFullyBooked = tour.availableSpots === 0;

  return (
    <div className="min-h-screen">
      {showWaitlistForm && <WaitlistForm tour={tour} onClose={() => setShowWaitlistForm(false)} />}
      {/* Hero Image */}
      <div className="relative h-[400px]">
        <img src={tour.imageUrl} alt={tour.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 backdrop-blur-md !p-2 rounded-full"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#fff' }}
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Badge variant="info" size="md" className="mb-2">
                {tour.difficulty} {t('home:level')}
              </Badge>
              <h1 className="text-4xl font-bold text-white">{tour.title}</h1>
              <div className="flex items-center mt-2 space-x-4" style={{ color: '#e5e7eb' }}>
                <span className="flex items-center"><Calendar className="h-4 w-4 mr-1"/> {tour.durationDays} {t('home:days')}</span>
                <span className="flex items-center"><Users className="h-4 w-4 mr-1"/> {t('tourDetails:maxPeople')}</span>
              </div>
            </div>
            <div className="text-white md:text-right">
              <p className="text-sm opacity-90">{t('tourDetails:startingFrom')}</p>
              <p className="text-3xl font-bold">{formatCurrency(tour.price, tour.currency)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#000' }}>{t('tourDetails:about')}</h2>
            <p className="leading-relaxed text-lg" style={{ color: '#6b7280' }}>{tour.description}</p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#000' }}>{t('tourDetails:highlights')}</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <li key={i} className="flex items-center" style={{ color: '#374151' }}>
                  <Check className="h-5 w-5 mr-2" style={{ color: '#16a34a' }} />
                  <span>{t('tourDetails:guideIncluded')}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#000' }}>{t('tourDetails:itinerary')}</h3>
            <div className="border-l-2 pl-8 space-y-8" style={{ borderColor: '#ffe5df' }}>
               {/* Mock Itinerary */}
               {[1, 2, 3].map((day) => (
                 <div key={day} className="relative">
                   <div className="absolute -left-[41px] p-1.5 rounded-full border-4 border-white" style={{ backgroundColor: '#ffe5df' }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff1b00' }}></div>
                   </div>
                   <h4 className="font-bold" style={{ color: '#000' }}>{t('tourDetails:day')} {day}</h4>
                   <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Hiking through the valley, setting up camp, and dinner by the fire.</p>
                 </div>
               ))}
            </div>
          </section>
        </div>

        {/* Sidebar / Booking Card */}
        <div className="lg:col-span-1">
          <Card shadow="xl" className="sticky top-24">
            <h3 className="text-xl font-bold mb-6" style={{ color: '#000' }}>{t('tourDetails:bookCardTitle')}</h3>
            
            <div className="space-y-4 mb-6">
               <div className={`p-4 rounded-lg border ${isFullyBooked ? '' : ''}`} style={isFullyBooked ? { backgroundColor: '#fff7ed', borderColor: '#fed7aa' } : { backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
                 <p className="text-sm mb-1" style={{ color: '#6b7280' }}>{t('tourDetails:nextDeparture')}</p>
                 <div className="flex justify-between items-center">
                    <span className="font-semibold" style={{ color: '#000' }}>{formatDate(tour.nextDate)}</span>
                    {isFullyBooked ? (
                      <Badge variant="warning" size="sm" className="uppercase">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {t('tourDetails:fullyBooked')}
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">{tour.availableSpots} {t('home:spotsLeft')}</Badge>
                    )}
                 </div>
               </div>
            </div>

            {isFullyBooked ? (
              <>
                <div className="border rounded-lg p-4 mb-4" style={{ backgroundColor: '#fff7ed', borderColor: '#fed7aa' }}>
                  <p className="text-sm" style={{ color: '#9a3412' }}>
                    <strong>{t('tourDetails:fullyBookedInfo')}</strong> {t('tourDetails:joinWaitlistInfo')}
                  </p>
                </div>
                <Button 
                  onClick={() => setShowWaitlistForm(true)}
                  variant="primary"
                  size="lg"
                  fullWidth
                >
                  {t('tourDetails:joinWaitlist')}
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate(`/book/${tour.id}`)}
                variant="primary"
                size="lg"
                fullWidth
              >
                {t('tourDetails:bookNow')}
              </Button>
            )}

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm" style={{ color: '#6b7280' }}>
                <Shield className="h-4 w-4 mr-2" style={{ color: '#9ca3af' }} />
                <span>{t('tourDetails:securePayment')}</span>
              </div>
              <div className="flex items-center text-sm" style={{ color: '#6b7280' }}>
                <Check className="h-4 w-4 mr-2" style={{ color: '#9ca3af' }} />
                <span>{t('tourDetails:freeCancel')}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
