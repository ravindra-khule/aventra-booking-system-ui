import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tour } from '../types';
import { TourService } from '../services/api';
import { useTranslation } from '../context/LanguageContext';
import { ArrowLeft, Check, Calendar, Users, Shield } from 'lucide-react';

export const TourDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tour, setTour] = useState<Tour | undefined>(undefined);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="min-h-screen flex items-center justify-center">{t('common.loading')}</div>;
  if (!tour) return <div className="min-h-screen flex items-center justify-center">Tour not found</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[400px]">
        <img src={tour.imageUrl} alt={tour.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 text-white transition"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold mb-2 inline-block">
                {tour.difficulty} {t('home.level')}
              </span>
              <h1 className="text-4xl font-bold text-white">{tour.title}</h1>
              <div className="flex items-center text-gray-200 mt-2 space-x-4">
                <span className="flex items-center"><Calendar className="h-4 w-4 mr-1"/> {tour.durationDays} {t('home.days')}</span>
                <span className="flex items-center"><Users className="h-4 w-4 mr-1"/> {t('tourDetails.maxPeople')}</span>
              </div>
            </div>
            <div className="text-white md:text-right">
              <p className="text-sm opacity-90">{t('tourDetails.startingFrom')}</p>
              <p className="text-3xl font-bold">{tour.price.toLocaleString()} {tour.currency}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('tourDetails.about')}</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{tour.description}</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('tourDetails.highlights')}</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <li key={i} className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>{t('tourDetails.guideIncluded')}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('tourDetails.itinerary')}</h3>
            <div className="border-l-2 border-blue-100 pl-8 space-y-8">
               {/* Mock Itinerary */}
               {[1, 2, 3].map((day) => (
                 <div key={day} className="relative">
                   <div className="absolute -left-[41px] bg-blue-100 p-1.5 rounded-full border-4 border-white">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                   </div>
                   <h4 className="font-bold text-gray-900">{t('tourDetails.day')} {day}</h4>
                   <p className="text-gray-600 text-sm mt-1">Hiking through the valley, setting up camp, and dinner by the fire.</p>
                 </div>
               ))}
            </div>
          </section>
        </div>

        {/* Sidebar / Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{t('tourDetails.bookCardTitle')}</h3>
            
            <div className="space-y-4 mb-6">
               <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                 <p className="text-sm text-gray-500 mb-1">{t('tourDetails.nextDeparture')}</p>
                 <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">{tour.nextDate}</span>
                    <span className="text-sm text-green-600 font-medium">{tour.availableSpots} {t('home.spotsLeft')}</span>
                 </div>
               </div>
            </div>

            <button 
              onClick={() => navigate(`/book/${tour.id}`)}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {t('tourDetails.bookNow')}
            </button>

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-gray-500">
                <Shield className="h-4 w-4 mr-2 text-gray-400" />
                <span>{t('tourDetails.securePayment')}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Check className="h-4 w-4 mr-2 text-gray-400" />
                <span>{t('tourDetails.freeCancel')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
