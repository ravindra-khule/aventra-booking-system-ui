import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tour, Traveler, PayerDetails } from '../../types';
import { TourService, BookingService, PromoCodeService } from '../../services/api';
import { useTranslation } from '../../context/LanguageContext';
import { CheckCircle2, ChevronRight, CreditCard, Shield, Info, ArrowLeft, Tag, X, Loader2 } from 'lucide-react';

const EMPTY_PAYER: PayerDetails = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  zipCode: '',
  city: '',
  country: 'Sweden' // Default
};

const EMPTY_TRAVELER: Traveler = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  zipCode: '',
  city: '',
  country: 'Sweden',
  ssn: '',
  travelCompanion: '',
  roomPreference: '',
  isPayer: false
};

export const BookingWizard = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [tour, setTour] = useState<Tour | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Booking State
  const [date, setDate] = useState('');
  const [participants, setParticipants] = useState(1);
  const [payer, setPayer] = useState<PayerDetails>(EMPTY_PAYER);
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  
  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  
  const steps = [
    t('booking.steps.overview'), 
    t('booking.steps.details'), 
    t('booking.steps.payment'), 
    t('booking.steps.done')
  ];

  // Initial Load
  useEffect(() => {
    if (tourId) {
      TourService.getById(tourId).then((t) => {
        if (t) {
            setTour(t);
            setDate(t.nextDate);
        }
      });
    }
  }, [tourId]);

  // Sync Logic: When Payer changes, update any Traveler marked as "Same as Payer"
  useEffect(() => {
    setTravelers(prevTravelers => {
      return prevTravelers.map(t => {
        if (t.isPayer) {
          return {
            ...t,
            firstName: payer.firstName,
            lastName: payer.lastName,
            email: payer.email,
            phone: payer.phone,
            address: payer.address,
            zipCode: payer.zipCode,
            city: payer.city,
            country: payer.country
          };
        }
        return t;
      });
    });
  }, [payer]);

  // Sync travelers array size with participants count
  useEffect(() => {
    setTravelers(prev => {
      if (prev.length === participants) return prev;
      
      const newTravelers = [...prev];
      if (participants > prev.length) {
        // Add new travelers
        for (let i = prev.length; i < participants; i++) {
          // Default the first traveler to be the payer if it's the first time
          const isFirstAndEmpty = i === 0 && prev.length === 0;
          newTravelers.push({ ...EMPTY_TRAVELER, isPayer: isFirstAndEmpty });
        }
      } else {
        // Remove excess
        newTravelers.splice(participants);
      }
      return newTravelers;
    });
  }, [participants]);


  const handlePayerChange = (field: keyof PayerDetails, value: string) => {
    setPayer(prev => ({ ...prev, [field]: value }));
  };

  const handleTravelerChange = (index: number, field: keyof Traveler, value: any) => {
    const updatedTravelers = [...travelers];
    
    // If toggling "Same as Payer" to TRUE
    if (field === 'isPayer' && value === true) {
      updatedTravelers[index] = {
        ...updatedTravelers[index],
        isPayer: true,
        firstName: payer.firstName,
        lastName: payer.lastName,
        email: payer.email,
        phone: payer.phone,
        address: payer.address,
        zipCode: payer.zipCode,
        city: payer.city,
        country: payer.country
      };
    } else {
      updatedTravelers[index] = { ...updatedTravelers[index], [field]: value };
    }
    
    setTravelers(updatedTravelers);
  };

  // Promo Code Handlers
  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    setIsValidatingPromo(true);
    setPromoError('');
    setPromoMessage('');

    try {
      const totalAmount = (tour?.price || 0) * participants;
      const validation = await PromoCodeService.validatePromoCode(
        promoCode.trim(),
        tour?.id || '',
        totalAmount
      );

      if (validation.isValid) {
        setAppliedPromoCode(promoCode.trim().toUpperCase());
        setDiscountAmount(validation.discountAmount || 0);
        setPromoMessage(validation.message);
        setPromoError('');
      } else {
        setPromoError(validation.message);
        setAppliedPromoCode('');
        setDiscountAmount(0);
      }
    } catch (error) {
      setPromoError('Failed to validate promo code');
      console.error('Promo code validation error:', error);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromoCode = () => {
    setPromoCode('');
    setAppliedPromoCode('');
    setDiscountAmount(0);
    setPromoMessage('');
    setPromoError('');
  };

  const handleNext = async () => {
    if (currentStep === 2) {
      // Payment & Submit
      setIsProcessing(true);
      try {
        const baseTotal = (tour?.price || 0) * participants;
        const finalTotal = baseTotal - discountAmount;
        const depositTotal = Math.round((tour?.depositPrice || 0) * participants * (finalTotal / baseTotal));
        
        const newBooking = await BookingService.create({
            tourId: tour?.id,
            tourTitle: tour?.title,
            participants: participants,
            payer: payer,
            travelers: travelers,
            totalAmount: finalTotal,
            paidAmount: depositTotal, // Initial payment
            tripDate: date,
            tourImageUrl: tour?.imageUrl,
            promoCode: appliedPromoCode || undefined,
            discountAmount: discountAmount || undefined,
        });
        
        // Increment promo code usage
        if (appliedPromoCode) {
          await PromoCodeService.incrementUsage(appliedPromoCode);
        }
        
        // Save booking to localStorage
        try {
          const existingBookings = localStorage.getItem('userBookings');
          const bookings = existingBookings ? JSON.parse(existingBookings) : [];
          bookings.push(newBooking);
          localStorage.setItem('userBookings', JSON.stringify(bookings));
        } catch (storageError) {
          console.error('Failed to save booking to localStorage', storageError);
        }
        
        setCurrentStep(3); 
      } catch (e) {
        alert('Booking failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  if (!tour) return <div className="min-h-screen flex justify-center items-center">{t('common.loading')}</div>;

  const baseAmount = (tour.price * participants);
  const finalAmount = baseAmount - discountAmount;
  const depositTotal = Math.round((tour.depositPrice * participants) * (finalAmount / baseAmount));
  const remainingAmount = finalAmount - depositTotal;

  // Reusable Order Summary Component
  const OrderSummary = () => (
    <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100 sticky top-24">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{t('booking.summary.title')}</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('booking.summary.product')}</span>
          <span className="font-medium text-gray-900">{tour.title}</span>
        </div>
        <div className="flex justify-between text-sm">
           <span className="text-gray-600">{t('booking.summary.date')}</span>
           <span className="font-medium text-gray-900">{date}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('booking.summary.travelers')}</span>
          <span className="font-medium text-gray-900">{participants} {t('booking.customize.people')}</span>
        </div>
      </div>

      <div className="border-t border-orange-200 py-4 space-y-2">
        <div className="flex justify-between text-sm">
           <span className="text-gray-600">{t('booking.summary.totalPrice')}</span>
           <span className="text-gray-900">{baseAmount.toLocaleString()} {tour.currency}</span>
        </div>
        
        {/* Show discount if applied */}
        {discountAmount > 0 && (
          <>
            <div className="flex justify-between text-sm text-green-600 font-medium">
               <span className="flex items-center gap-1">
                 <Tag className="h-3 w-3" /> Discount ({appliedPromoCode})
               </span>
               <span>-{discountAmount.toLocaleString()} {tour.currency}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-blue-600">
               <span>Discounted Total</span>
               <span>{finalAmount.toLocaleString()} {tour.currency}</span>
            </div>
          </>
        )}
        
        <div className="flex justify-between text-sm font-semibold text-gray-900 pt-2 border-t border-orange-200">
           <span>{t('booking.payment.payNow')}</span>
           <span>{depositTotal.toLocaleString()} {tour.currency}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
           <span>{t('booking.payment.payLater')}</span>
           <span>{remainingAmount.toLocaleString()} {tour.currency}</span>
        </div>
      </div>

      <div className="border-t border-orange-200 pt-4 mb-2">
         <div className="flex justify-between items-end">
            <span className="font-bold text-lg text-gray-900">{t('booking.summary.toPay')}</span>
            <span className="font-bold text-2xl text-blue-600">{depositTotal.toLocaleString()} {tour.currency}</span>
         </div>
         <p className="text-xs text-gray-500 mt-2">{t('booking.summary.vatMsg')}</p>
      </div>
      
      <div className="mt-6 flex items-center justify-center text-xs text-gray-400 gap-2">
         <Shield className="h-4 w-4" /> {t('booking.summary.secureMsg')}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
        {/* Header/Nav for Wizard */}
        <div className="border-b border-gray-100 bg-white sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                    <ArrowLeft className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="font-bold text-gray-900">{t('common.cancel')}</span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-8">
                    {steps.map((step, idx) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-2 ${
                                idx < currentStep ? 'bg-green-500 text-white' : 
                                idx === currentStep ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                            }`}>
                                {idx < currentStep ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                            </div>
                            <span className={`hidden md:block text-sm font-medium ${
                                idx <= currentStep ? 'text-gray-900' : 'text-gray-400'
                            }`}>{step}</span>
                        </div>
                    ))}
                </div>
                <div className="w-16"></div> {/* Spacer for centering */}
            </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Form Area */}
          <div className="lg:col-span-2 flex flex-col">
            
            {/* Step 0: Overview & Selection */}
            {currentStep === 0 && (
              <div className="animate-fade-in space-y-8 flex-1">
                 <h2 className="text-3xl font-bold text-gray-900">{t('booking.customize.title')}</h2>
                 <p className="text-gray-500 text-lg">{t('booking.customize.subtitle')} <span className="text-blue-600 font-semibold">{tour.title}</span>.</p>

                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('booking.customize.departureDate')}</label>
                        <select 
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="block w-full border-gray-300 rounded-lg shadow-sm p-4 border focus:ring-blue-500 focus:border-blue-500 text-lg"
                        >
                            <option value={tour.nextDate}>{tour.nextDate} (Available)</option>
                            <option value="2024-08-01">2024-08-01 (Waitlist)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('booking.customize.travelers')}</label>
                        <div className="flex items-center space-x-4">
                            <input 
                                type="number" 
                                min="1" 
                                max="10"
                                value={participants}
                                onChange={e => setParticipants(parseInt(e.target.value) || 1)}
                                className="block w-32 border-gray-300 rounded-lg shadow-sm p-4 border focus:ring-blue-500 focus:border-blue-500 text-lg"
                            />
                            <span className="text-gray-500">{t('booking.customize.people')}</span>
                        </div>
                    </div>
                 </div>
              </div>
            )}

            {/* Step 1: Payer & Traveler Details */}
            {currentStep === 1 && (
              <div className="animate-fade-in space-y-12 flex-1">
                
                {/* Payer Section */}
                <section>
                    <div className="flex items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mr-3">{t('booking.payer.title')}</h2>
                        <div className="group relative">
                             <Info className="h-5 w-5 text-gray-400 cursor-help" />
                             <div className="absolute hidden group-hover:block w-64 bg-gray-800 text-white text-xs rounded p-2 -top-10 left-6">
                                {t('booking.payer.tooltip')}
                             </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{t('booking.payer.firstName')} <span className="text-red-500">*</span></label>
                            <input type="text" value={payer.firstName} onChange={e => handlePayerChange('firstName', e.target.value)} className="w-full border-gray-300 rounded-md p-3 border" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{t('booking.payer.lastName')} <span className="text-red-500">*</span></label>
                            <input type="text" value={payer.lastName} onChange={e => handlePayerChange('lastName', e.target.value)} className="w-full border-gray-300 rounded-md p-3 border" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">{t('booking.payer.country')} <span className="text-red-500">*</span></label>
                            <select value={payer.country} onChange={e => handlePayerChange('country', e.target.value)} className="w-full border-gray-300 rounded-md p-3 border bg-white">
                                <option>Sweden</option>
                                <option>Norway</option>
                                <option>Denmark</option>
                                <option>United Kingdom</option>
                                <option>USA</option>
                            </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">{t('booking.payer.address')} <span className="text-red-500">*</span></label>
                            <input type="text" value={payer.address} onChange={e => handlePayerChange('address', e.target.value)} className="w-full border-gray-300 rounded-md p-3 border" placeholder="Street and number" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{t('booking.payer.zip')} <span className="text-red-500">*</span></label>
                            <input type="text" value={payer.zipCode} onChange={e => handlePayerChange('zipCode', e.target.value)} className="w-full border-gray-300 rounded-md p-3 border" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{t('booking.payer.city')} <span className="text-red-500">*</span></label>
                            <input type="text" value={payer.city} onChange={e => handlePayerChange('city', e.target.value)} className="w-full border-gray-300 rounded-md p-3 border" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{t('booking.payer.phone')} <span className="text-red-500">*</span></label>
                            <input type="tel" value={payer.phone} onChange={e => handlePayerChange('phone', e.target.value)} className="w-full border-gray-300 rounded-md p-3 border" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{t('booking.payer.email')} <span className="text-red-500">*</span></label>
                            <input type="email" value={payer.email} onChange={e => handlePayerChange('email', e.target.value)} className="w-full border-gray-300 rounded-md p-3 border" />
                        </div>
                    </div>
                </section>

                <hr className="border-gray-200" />

                {/* Travelers Loop */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('booking.traveler.sectionTitle')}</h2>
                    <div className="space-y-12">
                    {travelers.map((traveler, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-800">{t('booking.traveler.title')} {index + 1}</h3>
                                <div className="flex items-center bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                                    <input 
                                    type="checkbox" 
                                    id={`payer-check-${index}`}
                                    checked={traveler.isPayer}
                                    onChange={(e) => handleTravelerChange(index, 'isPayer', e.target.checked)}
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                    />
                                    <label htmlFor={`payer-check-${index}`} className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer select-none">
                                    {t('booking.traveler.sameAsPayer')}
                                    </label>
                                </div>
                            </div>

                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('booking.payer.firstName')} <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        value={traveler.firstName} 
                                        onChange={(e) => handleTravelerChange(index, 'firstName', e.target.value)} 
                                        disabled={traveler.isPayer}
                                        className="w-full border-gray-300 rounded-md p-3 border disabled:bg-gray-100 disabled:text-gray-500" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('booking.payer.lastName')} <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        value={traveler.lastName} 
                                        onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)} 
                                        disabled={traveler.isPayer}
                                        className="w-full border-gray-300 rounded-md p-3 border disabled:bg-gray-100 disabled:text-gray-500" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('booking.payer.phone')} <span className="text-red-500">*</span></label>
                                    <input 
                                        type="tel" 
                                        value={traveler.phone} 
                                        onChange={(e) => handleTravelerChange(index, 'phone', e.target.value)} 
                                        disabled={traveler.isPayer}
                                        className="w-full border-gray-300 rounded-md p-3 border disabled:bg-gray-100 disabled:text-gray-500" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('booking.payer.email')} <span className="text-red-500">*</span></label>
                                    <input 
                                        type="email" 
                                        value={traveler.email} 
                                        onChange={(e) => handleTravelerChange(index, 'email', e.target.value)} 
                                        disabled={traveler.isPayer}
                                        className="w-full border-gray-300 rounded-md p-3 border disabled:bg-gray-100 disabled:text-gray-500" 
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('booking.payer.address')} <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        value={traveler.address}
                                        onChange={(e) => handleTravelerChange(index, 'address', e.target.value)}
                                        disabled={traveler.isPayer}
                                        className="w-full border-gray-300 rounded-md p-3 border disabled:bg-gray-100 disabled:text-gray-500" 
                                        placeholder="Street Address"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('booking.payer.zip')} <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        value={traveler.zipCode}
                                        onChange={(e) => handleTravelerChange(index, 'zipCode', e.target.value)}
                                        disabled={traveler.isPayer}
                                        className="w-full border-gray-300 rounded-md p-3 border disabled:bg-gray-100 disabled:text-gray-500" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('booking.payer.city')} <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        value={traveler.city}
                                        onChange={(e) => handleTravelerChange(index, 'city', e.target.value)}
                                        disabled={traveler.isPayer}
                                        className="w-full border-gray-300 rounded-md p-3 border disabled:bg-gray-100 disabled:text-gray-500" 
                                    />
                                </div>
                                
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('booking.traveler.ssn')} <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        placeholder="YYYYMMDD"
                                        value={traveler.ssn} 
                                        onChange={(e) => handleTravelerChange(index, 'ssn', e.target.value)} 
                                        className="w-full border-gray-300 rounded-md p-3 border bg-white" 
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('booking.traveler.companion')}</label>
                                    <textarea 
                                        rows={2}
                                        placeholder={t('booking.traveler.companionPlaceholder')}
                                        value={traveler.travelCompanion} 
                                        onChange={(e) => handleTravelerChange(index, 'travelCompanion', e.target.value)} 
                                        className="w-full border-gray-300 rounded-md p-3 border bg-white" 
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('booking.traveler.preferences')}</label>
                                    <textarea 
                                        rows={2}
                                        placeholder={t('booking.traveler.preferencesPlaceholder')}
                                        value={traveler.roomPreference} 
                                        onChange={(e) => handleTravelerChange(index, 'roomPreference', e.target.value)} 
                                        className="w-full border-gray-300 rounded-md p-3 border bg-white" 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </section>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
               <div className="animate-fade-in flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('booking.payment.title')}</h2>
                  
                  {/* Payment Breakdown Card */}
                  <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8">
                     <h3 className="text-lg font-bold text-gray-900 mb-4">{t('booking.payment.scheduleTitle')}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm flex flex-col">
                            <span className="text-sm text-gray-500">{t('booking.payment.payNow')}</span>
                            <span className="text-xl font-bold text-gray-900">{depositTotal.toLocaleString()} {tour.currency}</span>
                            <span className="text-xs text-green-600 mt-1">{t('booking.payment.dueToday')}</span>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col opacity-75">
                            <span className="text-sm text-gray-500">{t('booking.payment.payLater')}</span>
                            <span className="text-xl font-bold text-gray-900">{remainingAmount.toLocaleString()} {tour.currency}</span>
                            <span className="text-xs text-gray-500 mt-1">{t('booking.payment.dueLater')}</span>
                        </div>
                     </div>
                  </div>

                  {/* Promo Code Section */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-6">
                     <div className="flex items-center gap-2 mb-4">
                        <Tag className="h-5 w-5 text-purple-600" />
                        <h3 className="text-lg font-bold text-gray-900">Have a Promo Code?</h3>
                     </div>
                     
                     {!appliedPromoCode ? (
                        <div className="flex gap-3">
                           <input 
                              type="text" 
                              placeholder="Enter promo code"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                              onKeyPress={(e) => e.key === 'Enter' && handleApplyPromoCode()}
                              className="flex-1 border border-purple-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              disabled={isValidatingPromo}
                           />
                           <button
                              onClick={handleApplyPromoCode}
                              disabled={isValidatingPromo || !promoCode.trim()}
                              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                           >
                              {isValidatingPromo ? (
                                 <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Validating...
                                 </>
                              ) : (
                                 'Apply'
                              )}
                           </button>
                        </div>
                     ) : (
                        <div className="flex items-center justify-between bg-green-100 border border-green-300 rounded-lg p-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                 <CheckCircle2 className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                 <p className="font-bold text-green-900">{appliedPromoCode}</p>
                                 <p className="text-sm text-green-700">You saved {discountAmount.toLocaleString()} {tour.currency}!</p>
                              </div>
                           </div>
                           <button
                              onClick={handleRemovePromoCode}
                              className="p-2 hover:bg-green-200 rounded-full transition"
                              title="Remove promo code"
                           >
                              <X className="h-5 w-5 text-green-700" />
                           </button>
                        </div>
                     )}
                     
                     {/* Messages */}
                     {promoMessage && !appliedPromoCode && (
                        <p className="mt-3 text-sm text-green-600 flex items-center gap-2">
                           <CheckCircle2 className="h-4 w-4" /> {promoMessage}
                        </p>
                     )}
                     {promoError && (
                        <p className="mt-3 text-sm text-red-600 flex items-center gap-2">
                           <X className="h-4 w-4" /> {promoError}
                        </p>
                     )}
                  </div>

                  <div className="bg-white border border-gray-300 rounded-xl p-6 mb-6">
                     <div className="flex items-center space-x-3 mb-6">
                        <input type="radio" checked className="w-5 h-5 text-blue-600" readOnly />
                        <span className="font-bold text-gray-800">{t('booking.payment.cardDetails')}</span>
                        <div className="flex space-x-2 ml-4">
                            {/* Icons */}
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                        </div>
                     </div>
                     
                     <div className="space-y-4 max-w-md">
                        <input type="text" placeholder={t('booking.payment.cardNumber')} className="w-full border border-gray-300 rounded p-3" />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder={t('booking.payment.expiry')} className="w-full border border-gray-300 rounded p-3" />
                            <input type="text" placeholder={t('booking.payment.cvc')} className="w-full border border-gray-300 rounded p-3" />
                        </div>
                        <input type="text" placeholder={t('booking.payment.holderName')} className="w-full border border-gray-300 rounded p-3" />
                     </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span>{t('booking.payment.agree')} <a href="#" className="text-blue-600 underline">{t('booking.payment.terms')}</a> och <a href="#" className="text-blue-600 underline">{t('booking.payment.privacy')}</a>.</span>
                  </div>
               </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
                <div className="text-center py-12 animate-fade-in flex-1">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('booking.confirmation.title')}</h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
                        {t('common.submit')} {payer.firstName}! {t('booking.confirmation.subtitle')} <span className="font-bold text-gray-900">{tour.title}</span> {t('booking.confirmation.secured')}.
                    </p>
                    <div className="bg-gray-50 max-w-md mx-auto p-6 rounded-lg mb-8 text-left">
                        <p className="text-sm text-gray-500 mb-1">{t('booking.confirmation.ref')}</p>
                        <p className="text-lg font-mono font-bold text-gray-900 mb-4">#BK-{Math.floor(Math.random() * 10000)}</p>
                        <div className="space-y-2 border-t border-gray-200 pt-4 mt-4">
                            <div className="flex justify-between text-sm">
                                <span>{t('booking.confirmation.totalPaid')}</span>
                                <span className="font-bold">{depositTotal.toLocaleString()} {tour.currency}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>{t('booking.confirmation.remaining')}</span>
                                <span>{remainingAmount.toLocaleString()} {tour.currency}</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-4">{t('booking.confirmation.emailSent')} <span className="text-gray-900 font-medium">{payer.email}</span></p>
                    </div>
                    <div className="flex justify-center space-x-4">
                        <button onClick={() => navigate('/')} className="text-gray-600 font-medium hover:text-gray-900">{t('booking.confirmation.homeBtn')}</button>
                        <button onClick={() => navigate('/my-pages')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">{t('booking.confirmation.myPagesBtn')}</button>
                    </div>
                </div>
            )}

            {/* Bottom Navigation Buttons (Moved here from Sidebar) */}
            {currentStep < 3 && (
                <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
                    {currentStep === 2 ? (
                        <button 
                            onClick={handleNext}
                            disabled={isProcessing}
                            className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center"
                        >
                            {isProcessing ? t('common.processing') : `${t('booking.payment.payBtn')} ${depositTotal.toLocaleString()} ${tour.currency}`}
                        </button>
                    ) : (
                        <button 
                            onClick={handleNext}
                            className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center"
                        >
                            {t('booking.payment.nextStep')} <ChevronRight className="h-5 w-5 ml-2" />
                        </button>
                    )}
                </div>
            )}

          </div>

          {/* Sidebar Area - Order Summary (Visible on Steps 0, 1, 2) */}
          <div className="lg:col-span-1">
             {currentStep < 3 && <OrderSummary />}
          </div>
        </div>
      </div>
    </div>
  );
};
