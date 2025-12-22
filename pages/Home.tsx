import React, { useEffect, useState } from 'react';
import { Tour } from '../types';
import { TourService } from '../services/api';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { MapPin, Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Button, Badge, Card } from '../src/shared/components/ui';
import { formatCurrency, formatDate } from '../src/shared/utils';

export const Home = () => {
  const { t } = useTranslation();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await TourService.getAll();
        setTours(data);
      } catch (err) {
        console.error("Failed to load tours", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const scrollToTours = () => {
    const element = document.getElementById('tour-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-[500px]" style={{ backgroundColor: '#000' }}>
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" 
          alt="Hero" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              {t('home.heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto" style={{ color: '#fff' }}>
              {t('home.heroSubtitle')}
            </p>
            <Button 
              onClick={scrollToTours}
              variant="primary"
              size="xl"
            >
              {t('home.exploreBtn')}
            </Button>
          </div>
        </div>
      </div>

      {/* Tour Grid */}
      <div id="tour-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-8" style={{ color: '#000' }}>{t('home.upcomingTitle')}</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin" style={{ color: '#ff1b00' }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => {
              const isFullyBooked = tour.availableSpots === 0;
              return (
              <Card key={tour.id} padding="none" hover clickable className="flex flex-col">
                <div className="relative h-48">
                  <img src={tour.imageUrl} alt={tour.title} className="w-full h-full object-cover" />
                  {isFullyBooked && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <Badge variant="warning" size="lg" className="uppercase">
                        {t('home.fullyBooked')}
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge variant="default" size="sm" className="uppercase tracking-wide" style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#000' }}>
                      {tour.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold" style={{ color: '#000' }}>{tour.title}</h3>
                  </div>
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: '#6b7280' }}>{tour.shortDescription}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm" style={{ color: '#6b7280' }}>
                      <MapPin className="h-4 w-4 mr-2" />
                      {tour.location}
                    </div>
                    <div className="flex items-center text-sm" style={{ color: '#6b7280' }}>
                      <Calendar className="h-4 w-4 mr-2" />
                      {t('home.next')}: {formatDate(tour.nextDate)}
                    </div>
                    <div className="flex items-center text-sm" style={{ color: '#6b7280' }}>
                      <Clock className="h-4 w-4 mr-2" />
                      {tour.durationDays} {t('home.days')}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
                    <div>
                      <span className="text-2xl font-bold" style={{ color: '#000' }}>{formatCurrency(tour.price, tour.currency)}</span>
                    </div>
                    <Link 
                      to={`/tour/${tour.id}`} 
                      className="inline-flex items-center font-semibold"
                      style={{ color: '#ff1b00' }}
                    >
                      {t('common.details')} <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Trust Section */}
      <div className="py-16 border-t" style={{ backgroundColor: '#fff', borderColor: '#e5e7eb' }}>
         <div className="max-w-7xl mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-12" style={{ color: '#000' }}>{t('home.trustedBy')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale">
               {/* Placeholders for logos */}
               <div className="h-12 rounded flex items-center justify-center font-bold" style={{ backgroundColor: '#e5e7eb', color: '#6b7280' }}>FORTNOX</div>
               <div className="h-12 rounded flex items-center justify-center font-bold" style={{ backgroundColor: '#e5e7eb', color: '#6b7280' }}>STRIPE</div>
               <div className="h-12 rounded flex items-center justify-center font-bold" style={{ backgroundColor: '#e5e7eb', color: '#6b7280' }}>VISITA</div>
               <div className="h-12 rounded flex items-center justify-center font-bold" style={{ backgroundColor: '#e5e7eb', color: '#6b7280' }}>KAMMARKOLLEGIET</div>
            </div>
         </div>
      </div>
    </div>
  );
};