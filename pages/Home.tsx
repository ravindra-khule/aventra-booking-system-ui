import React, { useEffect, useState } from 'react';
import { Tour } from '../types';
import { TourService } from '../services/api';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { MapPin, Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react';

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
      <div className="relative bg-gray-900 h-[500px]">
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
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
              {t('home.heroSubtitle')}
            </p>
            <button 
              onClick={scrollToTours}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition transform hover:scale-105"
            >
              {t('home.exploreBtn')}
            </button>
          </div>
        </div>
      </div>

      {/* Tour Grid */}
      <div id="tour-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('home.upcomingTitle')}</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => {
              const isFullyBooked = tour.availableSpots === 0;
              return (
              <div key={tour.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col">
                <div className="relative h-48">
                  <img src={tour.imageUrl} alt={tour.title} className="w-full h-full object-cover" />
                  {isFullyBooked && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <span className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase">
                        {t('home.fullyBooked')}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 uppercase tracking-wide">
                    {tour.difficulty}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{tour.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.shortDescription}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      {tour.location}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {t('home.next')}: {tour.nextDate}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      {tour.durationDays} {t('home.days')}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">{tour.price.toLocaleString()}</span>
                      <span className="text-gray-500 text-sm ml-1">{tour.currency}</span>
                    </div>
                    <Link 
                      to={`/tour/${tour.id}`} 
                      className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800"
                    >
                      {t('common.details')} <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trust Section */}
      <div className="bg-gray-50 py-16 border-t border-gray-200">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-12">{t('home.trustedBy')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale">
               {/* Placeholders for logos */}
               <div className="h-12 bg-gray-300 rounded flex items-center justify-center font-bold text-gray-500">FORTNOX</div>
               <div className="h-12 bg-gray-300 rounded flex items-center justify-center font-bold text-gray-500">STRIPE</div>
               <div className="h-12 bg-gray-300 rounded flex items-center justify-center font-bold text-gray-500">VISITA</div>
               <div className="h-12 bg-gray-300 rounded flex items-center justify-center font-bold text-gray-500">KAMMARKOLLEGIET</div>
            </div>
         </div>
      </div>
    </div>
  );
};