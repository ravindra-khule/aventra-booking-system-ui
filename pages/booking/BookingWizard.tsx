import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tour, Traveler, PayerDetails } from '../../types';
import { TourAddOn, SelectedAddOn, AddOnType } from '../../src/features/tours/types/tour.types';
import { TourService, BookingService, PromoCodeService } from '../../services/api';
import { AddOnService } from '../../src/features/tours/services/addon.service';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle2, 
  ChevronRight, 
  CreditCard, 
  Shield, 
  Info, 
  ArrowLeft, 
  Tag, 
  X, 
  Plus, 
  Minus, 
  Package,
  Bed,
  Utensils,
  Wrench,
  Activity,
  Car
} from 'lucide-react';
import { Button, Input, Select } from '../../src/shared/components/ui';
import { formatCurrency } from '../../src/shared/utils';

// Icon mapping for different add-on types
const ADDON_TYPE_ICONS: Record<AddOnType, React.ReactNode> = {
  [AddOnType.EXTRA_NIGHT]: <Bed className="h-8 w-8" />,
  [AddOnType.INSURANCE]: <Shield className="h-8 w-8" />,
  [AddOnType.EQUIPMENT]: <Wrench className="h-8 w-8" />,
  [AddOnType.MEAL]: <Utensils className="h-8 w-8" />,
  [AddOnType.ACTIVITY]: <Activity className="h-8 w-8" />,
  [AddOnType.TRANSPORT]: <Car className="h-8 w-8" />,
  [AddOnType.OTHER]: <Package className="h-8 w-8" />,
};

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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  // Add-ons State
  const [availableAddOns, setAvailableAddOns] = useState<TourAddOn[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<Map<string, { addOn: TourAddOn; quantity: number }>>(new Map());
  const [isLoadingAddOns, setIsLoadingAddOns] = useState(false);
  
  const steps = [
    t('booking:steps.travelersAddons'),
    t('booking:steps.details'), 
    t('booking:steps.payment'), 
    t('booking:steps.done')
  ];

  // Initial Load
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const loadTour = async () => {
      try {
        if (!isMounted) return;
        setIsLoading(true);
        setLoadError(null);

        if (!tourId) {
          if (isMounted) {
            setLoadError('Tour ID is missing. Please select a tour.');
            setIsLoading(false);
          }
          return;
        }

        // Set a timeout to catch hanging requests
        timeoutId = setTimeout(() => {
          if (isMounted && tour === null) {
            setLoadError('Tour loading timed out. Please refresh and try again.');
            setIsLoading(false);
          }
        }, 8000);

        try {
          const t = await TourService.getById(tourId);
          clearTimeout(timeoutId);

          if (!isMounted) return;

          if (!t) {
            setLoadError(`Tour not found. Please check the tour ID: ${tourId}`);
            setTour(null);
          } else {
            setTour(t);
            setDate(t.nextDate);
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          if (isMounted) {
            const errorMsg = fetchError instanceof Error ? fetchError.message : 'Failed to load tour';
            setLoadError(errorMsg);
            setTour(null);
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          const errorMsg = error instanceof Error ? error.message : 'Failed to load tour. Please try again.';
          setLoadError(errorMsg);
          setTour(null);
          setIsLoading(false);
        }
      }
    };

    loadTour();

    // Load add-ons if tour ID exists
    if (tourId) {
      setIsLoadingAddOns(true);
      AddOnService.getByTourId(tourId)
        .then((addOns) => {
          if (isMounted) {
            setAvailableAddOns(addOns);
            setIsLoadingAddOns(false);
          }
        })
        .catch((error) => {
          console.error('Add-ons loading error:', error);
          if (isMounted) {
            setIsLoadingAddOns(false);
          }
        });
    }

    // Cleanup on unmount
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
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
      setPromoError(t('booking:promo.enterCode') || 'Please enter a promo code');
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
      setPromoError(t('booking:promo.validationFailed') || 'Failed to validate promo code');
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

  // Add-on Handlers
  const handleAddOnQuantityChange = (addOn: TourAddOn, quantity: number) => {
    const newSelected = new Map(selectedAddOns);
    
    if (quantity <= 0) {
      newSelected.delete(addOn.id);
    } else {
      // Validate quantity
      const validation = AddOnService.validateQuantity(addOn, quantity);
      if (!validation.isValid) {
        alert(validation.message);
        return;
      }
      
      newSelected.set(addOn.id, { addOn, quantity });
    }
    
    setSelectedAddOns(newSelected);
  };

  const calculateAddOnsTotal = () => {
    return AddOnService.calculateAddOnsTotal(
      Array.from(selectedAddOns.values()),
      participants
    );
  };

  const handleNext = async () => {
    if (currentStep === 2) {
      // Payment & Submit
      // In development mode, create booking directly
      // For production, add Stripe payment processing here
      setIsProcessing(true);
      try {
        const baseTotal = (tour?.price || 0) * participants;
        const addOnsTotal = calculateAddOnsTotal();
        const subtotal = baseTotal + addOnsTotal;
        const finalTotal = subtotal - discountAmount;
        const depositTotal = Math.round((tour?.depositPrice || 0) * participants * (finalTotal / baseTotal));
        
        // Create booking without payment processing (development mode)
        // TODO: In production, integrate Stripe payment processing here
        console.log('Creating booking with deposit:', depositTotal);
        
        const newBooking = await BookingService.create({
              tourId: tour?.id,
              tourTitle: tour?.title,
              participants: participants,
              payer: payer,
              travelers: travelers,
              totalAmount: finalTotal,
              paidAmount: depositTotal,
              tripDate: date,
              tourImageUrl: tour?.imageUrl,
              transactionId: 'DEV-MODE-' + Date.now(),
              promoCode: appliedPromoCode || undefined,
              discountAmount: discountAmount || undefined,
              selectedAddOns: Array.from(selectedAddOns.values()).map(({ addOn, quantity }) => ({
                addOnId: addOn.id,
                addOn: addOn,
                quantity: quantity,
                totalPrice: addOn.pricePerPerson ? addOn.price * quantity * participants : addOn.price * quantity,
              })),
          });

        // Continue with rest of booking process
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
        alert(t('common:error') || 'Booking failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-gray-700 font-semibold">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-50 to-pink-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-red-200 p-6 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tour Not Found</h2>
            <p className="text-gray-600 mb-4">{loadError}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            Back to Tours
          </button>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">No Tour Selected</h2>
          <p className="text-gray-600">Please select a tour to begin booking.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            Browse Tours
          </button>
        </div>
      </div>
    );
  }

  const baseAmount = (tour.price * participants);
  const addOnsTotal = calculateAddOnsTotal();
  const subtotal = baseAmount + addOnsTotal;
  const finalAmount = subtotal - discountAmount;
  const depositTotal = Math.round((tour.depositPrice * participants) * (finalAmount / (baseAmount || 1)));
  const remainingAmount = finalAmount - depositTotal;

  // Confirmation Summary for Sidebar
  const ConfirmationSummary = () => (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200 sticky top-24">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{t('booking:confirmation.bookingConfirmed')}</h3>
          <p className="text-xs text-gray-600">{t('booking:confirmation.yourAdventureSecured')}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4 border border-green-100">
        <p className="text-xs text-gray-500 mb-1">{t('booking:confirmation.referenceNumber')}</p>
        <p className="text-xl font-mono font-bold text-gray-900">#BK-{Math.floor(Math.random() * 100000)}</p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="bg-white rounded-lg p-3 border border-green-100">
          <p className="text-xs text-gray-500 mb-1">{t('booking:confirmation.tour')}</p>
          <p className="font-semibold text-gray-900 text-sm">{tour.title}</p>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-green-100">
          <p className="text-xs text-gray-500 mb-1">{t('booking:confirmation.departure')}</p>
          <p className="font-semibold text-gray-900 text-sm">{date}</p>
        </div>

        <div className="bg-white rounded-lg p-3 border border-green-100">
          <p className="text-xs text-gray-500 mb-1">{t('booking:customize.travelers')}</p>
          <p className="font-semibold text-gray-900 text-sm">{participants} {participants === 1 ? t('booking:customize.person') : t('booking:customize.people')}</p>
        </div>
      </div>

      <div className="bg-green-600 text-white rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{t('booking:confirmation.amountPaid')}</span>
          <span className="text-2xl font-bold">{formatCurrency(depositTotal, tour.currency)}</span>
        </div>
        <div className="flex justify-between items-center text-green-100 text-xs">
          <span>{t('booking:payment.payLater')}</span>
          <span className="font-semibold">{formatCurrency(remainingAmount, tour.currency)}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-green-100">
        <div className="flex items-start gap-2 mb-3">
          <Info className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-700">
            {t('booking:confirmation.confirmationEmailSentTo')} <span className="font-semibold">{payer.email}</span>
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Shield className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-700">
            {t('booking:confirmation.bookingProtected')}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-green-200">
        <Button 
          onClick={() => navigate('/my-bookings')} 
          variant="primary" 
          fullWidth
          className="mb-2"
        >
          {t('booking:confirmation.viewMyBookings')}
        </Button>
        <Button 
          onClick={() => navigate('/')} 
          variant="outline" 
          fullWidth
        >
          {t('booking:confirmation.browseMoreTours')}
        </Button>
      </div>
    </div>
  );

  // Reusable Order Summary Component
  const OrderSummary = () => (
    <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100 sticky top-24">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{t('booking:summary.title')}</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('booking:summary.product')}</span>
          <span className="font-medium text-gray-900">{tour.title}</span>
        </div>
        <div className="flex justify-between text-sm">
           <span className="text-gray-600">{t('booking:summary.date')}</span>
           <span className="font-medium text-gray-900">{date}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('booking:summary.travelers')}</span>
          <span className="font-medium text-gray-900">{participants} {t('booking:customize.people')}</span>
        </div>
      </div>

      <div className="border-t border-orange-200 py-4 space-y-2">
        <div className="flex justify-between text-sm">
           <span className="text-gray-600">{t('booking:summary.basePrice')}</span>
           <span className="text-gray-900">{baseAmount.toLocaleString()} {tour.currency}</span>
        </div>
        
        {/* Show add-ons if any selected */}
        {selectedAddOns.size > 0 && (
          <>
            <div className="pt-2 pb-1 border-t border-orange-100">
              <span className="text-xs font-semibold text-gray-600 uppercase">{t('booking:summary.addons')}</span>
            </div>
            {Array.from(selectedAddOns.values()).map(({ addOn, quantity }) => {
              const itemTotal = addOn.pricePerPerson 
                ? addOn.price * quantity * participants 
                : addOn.price * quantity;
              return (
                <div key={addOn.id} className="flex justify-between text-sm pl-3">
                  <span className="text-gray-600">
                    {addOn.name} × {quantity}
                    {addOn.pricePerPerson && ` (${participants} ppl)`}
                  </span>
                  <span className="text-gray-900">{itemTotal.toLocaleString()} {tour.currency}</span>
                </div>
              );
            })}
            <div className="flex justify-between text-sm font-medium pt-2 border-t border-orange-100">
               <span className="text-gray-700">{t('booking:summary.subtotal')}</span>
               <span className="text-gray-900">{subtotal.toLocaleString()} {tour.currency}</span>
            </div>
          </>
        )}
        
        {/* Show discount if applied */}
        {discountAmount > 0 && (
          <>
            <div className="flex justify-between text-sm text-green-600 font-medium">
               <span className="flex items-center gap-1">
                 <Tag className="h-3 w-3" /> {t('booking:summary.discount')} ({appliedPromoCode})
               </span>
               <span>-{discountAmount.toLocaleString()} {tour.currency}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-blue-600">
               <span>{t('booking:summary.discountedTotal')}</span>
               <span>{finalAmount.toLocaleString()} {tour.currency}</span>
            </div>
          </>
        )}
        
        <div className="flex justify-between text-sm font-semibold text-gray-900 pt-2 border-t border-orange-200">
           <span>{t('booking:payment.payNow')}</span>
           <span>{depositTotal.toLocaleString()} {tour.currency}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
           <span>{t('booking:payment.payLater')}</span>
           <span>{remainingAmount.toLocaleString()} {tour.currency}</span>
        </div>
      </div>

      <div className="border-t border-orange-200 pt-4 mb-2">
         <div className="flex justify-between items-end">
            <span className="font-bold text-lg text-gray-900">{t('booking:summary.toPay')}</span>
            <span className="font-bold text-2xl text-blue-600">{depositTotal.toLocaleString()} {tour.currency}</span>
         </div>
         <p className="text-xs text-gray-500 mt-2">{t('booking:summary.vatMsg')}</p>
      </div>
      
      <div className="mt-6 flex items-center justify-center text-xs text-gray-400 gap-2">
         <Shield className="h-4 w-4" /> {t('booking:summary.secureMsg')}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
        {/* Handle Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading tour details...</p>
            </div>
          </div>
        )}
        
        {/* Handle Error State */}
        {loadError && !isLoading && (
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-md text-center">
              <h2 className="text-2xl font-bold text-red-900 mb-3">Tour Not Found</h2>
              <p className="text-red-700 mb-6">{loadError}</p>
              <Button
                onClick={() => navigate('/')}
                variant="primary"
                className="w-full"
              >
                Back to Tours
              </Button>
            </div>
          </div>
        )}
        
        {/* Handle No Tour Loaded */}
        {!tour && !isLoading && !loadError && (
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 max-w-md text-center">
              <h2 className="text-2xl font-bold text-yellow-900 mb-3">Tour Unavailable</h2>
              <p className="text-yellow-700 mb-6">Unable to load the tour details. Please try again or browse other tours.</p>
              <Button
                onClick={() => navigate('/')}
                variant="primary"
                className="w-full"
              >
                Browse Tours
              </Button>
            </div>
          </div>
        )}
        
        {/* Main Wizard (only render if tour is loaded) */}
        {tour && !isLoading && !loadError && (
          <>
        {/* Header/Nav for Wizard */}
        <div className="border-b border-gray-100 bg-white sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                    <ArrowLeft className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="font-bold text-gray-900">{t('common:cancel')}</span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-8">
                    {steps.map((step, idx) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-2 ${
                                idx < currentStep ? 'bg-green-500 text-white' : 
                                idx === currentStep ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'
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
          <div className="lg:col-span-2 flex flex-col min-h-screen lg:min-h-auto">
            
            {/* Debug: Show current step */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              Current Step: {currentStep} ({steps[currentStep]}) | Mode: {isDevelopmentMode ? 'Dev' : 'Prod'}
            </div>
            
            {/* Step 1: Payer & Traveler Details */}
            {currentStep === 1 && (
              <div className="animate-fade-in space-y-12 flex-1">
                
                {/* Payer Section */}
                <section>
                    <div className="flex items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mr-3">{t('booking:payer.title')}</h2>
                        <div className="group relative">
                             <Info className="h-5 w-5 text-gray-400 cursor-help" />
                             <div className="absolute hidden group-hover:block w-64 bg-gray-800 text-white text-xs rounded p-2 -top-10 left-6">
                                {t('booking:payer.tooltip')}
                             </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label={t('booking:payer.firstName')}
                            type="text"
                            value={payer.firstName}
                            onChange={e => handlePayerChange('firstName', e.target.value)}
                            required
                            fullWidth
                        />
                        <Input
                            label={t('booking:payer.lastName')}
                            type="text"
                            value={payer.lastName}
                            onChange={e => handlePayerChange('lastName', e.target.value)}
                            required
                            fullWidth
                        />
                        <div className="md:col-span-2">
                            <Select
                                label={t('booking:payer.country')}
                                value={payer.country}
                                onChange={e => handlePayerChange('country', e.target.value)}
                                options={[
                                    { value: 'Sweden', label: 'Sweden' },
                                    { value: 'Norway', label: 'Norway' },
                                    { value: 'Denmark', label: 'Denmark' },
                                    { value: 'United Kingdom', label: 'United Kingdom' },
                                    { value: 'USA', label: 'USA' }
                                ]}
                                required
                                fullWidth
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Input
                                label={t('booking:payer.address')}
                                type="text"
                                value={payer.address}
                                onChange={e => handlePayerChange('address', e.target.value)}
                                placeholder={t('booking:payer.streetAndNumber')}
                                required
                                fullWidth
                            />
                        </div>
                        <Input
                            label={t('booking:payer.zip')}
                            type="text"
                            value={payer.zipCode}
                            onChange={e => handlePayerChange('zipCode', e.target.value)}
                            required
                            fullWidth
                        />
                        <Input
                            label={t('booking:payer.city')}
                            type="text"
                            value={payer.city}
                            onChange={e => handlePayerChange('city', e.target.value)}
                            required
                            fullWidth
                        />
                        <Input
                            label={t('booking:payer.phone')}
                            type="tel"
                            value={payer.phone}
                            onChange={e => handlePayerChange('phone', e.target.value)}
                            required
                            fullWidth
                        />
                        <Input
                            label={t('booking:payer.email')}
                            type="email"
                            value={payer.email}
                            onChange={e => handlePayerChange('email', e.target.value)}
                            required
                            fullWidth
                        />
                    </div>
                </section>

                <hr className="border-gray-200" />

                {/* Travelers Loop */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('booking:traveler.sectionTitle')}</h2>
                    <div className="space-y-12">
                    {travelers.map((traveler, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-800">{t('booking:traveler.title')} {index + 1}</h3>
                                <div className="flex items-center bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                                    <input 
                                    type="checkbox" 
                                    id={`payer-check-${index}`}
                                    checked={traveler.isPayer}
                                    onChange={(e) => handleTravelerChange(index, 'isPayer', e.target.checked)}
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                    />
                                    <label htmlFor={`payer-check-${index}`} className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer select-none">
                                    {t('booking:traveler.sameAsPayer')}
                                    </label>
                                </div>
                            </div>

                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
                                <Input
                                    label={t('booking:payer.firstName')}
                                    type="text"
                                    value={traveler.firstName}
                                    onChange={(e) => handleTravelerChange(index, 'firstName', e.target.value)}
                                    disabled={traveler.isPayer}
                                    required
                                    fullWidth
                                />
                                <Input
                                    label={t('booking:payer.lastName')}
                                    type="text"
                                    value={traveler.lastName}
                                    onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)}
                                    disabled={traveler.isPayer}
                                    required
                                    fullWidth
                                />
                                <Input
                                    label={t('booking:payer.phone')}
                                    type="tel"
                                    value={traveler.phone}
                                    onChange={(e) => handleTravelerChange(index, 'phone', e.target.value)}
                                    disabled={traveler.isPayer}
                                    required
                                    fullWidth
                                />
                                <Input
                                    label={t('booking:payer.email')}
                                    type="email"
                                    value={traveler.email}
                                    onChange={(e) => handleTravelerChange(index, 'email', e.target.value)}
                                    disabled={traveler.isPayer}
                                    required
                                    fullWidth
                                />

                                <div className="md:col-span-2">
                                    <Input
                                        label={t('booking:payer.address')}
                                        type="text"
                                        value={traveler.address}
                                        onChange={(e) => handleTravelerChange(index, 'address', e.target.value)}
                                        disabled={traveler.isPayer}
                                        placeholder={t('booking:payer.address')}
                                        required
                                        fullWidth
                                    />
                                </div>

                                <Input
                                    label={t('booking:payer.zip')}
                                    type="text"
                                    value={traveler.zipCode}
                                    onChange={(e) => handleTravelerChange(index, 'zipCode', e.target.value)}
                                    disabled={traveler.isPayer}
                                    required
                                    fullWidth
                                />
                                <Input
                                    label={t('booking:payer.city')}
                                    type="text"
                                    value={traveler.city}
                                    onChange={(e) => handleTravelerChange(index, 'city', e.target.value)}
                                    disabled={traveler.isPayer}
                                    required
                                    fullWidth
                                />
                                
                                <div className="md:col-span-2">
                                    <Input
                                        label={t('booking:traveler.ssn')}
                                        type="text"
                                        value={traveler.ssn}
                                        onChange={(e) => handleTravelerChange(index, 'ssn', e.target.value)}
                                        placeholder={t('booking:payer.yyyymmdd')}
                                        required
                                        fullWidth
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('booking:traveler.companion')}</label>
                                    <textarea 
                                        rows={2}
                                        placeholder={t('booking:traveler.companionPlaceholder')}
                                        value={traveler.travelCompanion} 
                                        onChange={(e) => handleTravelerChange(index, 'travelCompanion', e.target.value)} 
                                        className="w-full border-gray-300 rounded-md p-3 border bg-white" 
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('booking:traveler.preferences')}</label>
                                    <textarea 
                                        rows={2}
                                        placeholder={t('booking:traveler.preferencesPlaceholder')}
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

            {/* Step 0: Add-ons & Extras */}
            {currentStep === 0 && (
              <div className="animate-fade-in flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('booking:steps.travelersAddons')}</h2>
                <p className="text-gray-600 mb-6">{t('booking:customize.subtitle')} {t('booking:addons.title')}</p>
                
                {/* Number of Travelers */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('booking:customize.travelers')}
                      </label>
                      <p className="text-xs text-gray-500">{t('booking:customize.howManyTraveling')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setParticipants(Math.max(1, participants - 1))}
                        className="w-10 h-10 rounded-full bg-white border-2 border-blue-300 text-blue-600 font-bold hover:bg-blue-50 transition flex items-center justify-center"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <div className="w-20 text-center">
                        <span className="text-3xl font-bold text-gray-900">{participants}</span>
                        <p className="text-xs text-gray-600">{t('booking:customize.travelers').toLowerCase()}</p>
                      </div>
                      <button
                        onClick={() => setParticipants(Math.min(10, participants + 1))}
                        className="w-10 h-10 rounded-full bg-white border-2 border-blue-300 text-blue-600 font-bold hover:bg-blue-50 transition flex items-center justify-center"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Add-ons Section */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">{t('booking:addons.title')}</h3>
                
                {isLoadingAddOns ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-gray-500">{t('booking:addons.loadingAddons')}</div>
                  </div>
                ) : availableAddOns.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">{t('booking:addons.noAddons')}</p>
                    <p className="text-sm text-gray-500 mt-2">{t('booking:addons.continueNextStep')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableAddOns.map((addOn) => {
                      const selected = selectedAddOns.get(addOn.id);
                      const quantity = selected?.quantity || 0;
                      const itemPrice = addOn.pricePerPerson 
                        ? addOn.price * participants 
                        : addOn.price;
                      
                      return (
                        <div
                          key={addOn.id}
                          className={`border rounded-xl p-6 transition ${
                            quantity > 0 
                              ? 'border-orange-500 bg-orange-50/50' 
                              : 'border-gray-200 bg-white hover:border-orange-300'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Icon/Image */}
                            <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              quantity > 0 ? 'bg-orange-100' : 'bg-gray-100'
                            }`}>
                              {addOn.imageUrl ? (
                                <img src={addOn.imageUrl} alt={addOn.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <div className={quantity > 0 ? 'text-orange-600' : 'text-gray-400'}>
                                  {ADDON_TYPE_ICONS[addOn.type]}
                                </div>
                              )}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{addOn.name}</h3>
                                  <span className="text-xs text-gray-500 uppercase">{addOn.type.replace('_', ' ')}</span>
                                  {addOn.isMandatory && (
                                    <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                                      {t('booking:addons.required')}
                                    </span>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold text-gray-900">
                                    {formatCurrency(itemPrice, addOn.currency)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {addOn.pricePerPerson ? t('booking:addons.perPerson') : t('booking:addons.perBooking')}
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-4">{addOn.description}</p>
                              
                              {/* Quantity Selector */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleAddOnQuantityChange(addOn, quantity - 1)}
                                    disabled={quantity === 0}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                                      quantity === 0
                                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                    }`}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  
                                  <div className="w-12 text-center">
                                    <span className="text-lg font-semibold text-gray-900">{quantity}</span>
                                  </div>
                                  
                                  <button
                                    onClick={() => handleAddOnQuantityChange(addOn, quantity + 1)}
                                    disabled={addOn.maxQuantity > 0 && quantity >= addOn.maxQuantity}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                                      addOn.maxQuantity > 0 && quantity >= addOn.maxQuantity
                                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                    }`}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                                
                                {quantity > 0 && (
                                  <div className="text-right">
                                    <div className="text-sm text-gray-600">{t('booking:addons.totalForItem')}</div>
                                    <div className="text-lg font-bold text-orange-600">
                                      {formatCurrency(
                                        addOn.pricePerPerson 
                                          ? addOn.price * quantity * participants 
                                          : addOn.price * quantity,
                                        addOn.currency
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Constraints Info */}
                              {(addOn.minQuantity > 1 || addOn.maxQuantity > 0) && (
                                <div className="mt-3 text-xs text-gray-500">
                                  {addOn.minQuantity > 1 && `${t('booking:addons.minimum')}: ${addOn.minQuantity}`}
                                  {addOn.minQuantity > 1 && addOn.maxQuantity > 0 && ' • '}
                                  {addOn.maxQuantity > 0 && `${t('booking:addons.maximum')}: ${addOn.maxQuantity}`}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Add-ons Summary */}
                    {selectedAddOns.size > 0 && (
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 mt-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">{t('booking:addons.selectedSummary')}</h3>
                        <div className="space-y-2 mb-4">
                          {Array.from(selectedAddOns.values()).map(({ addOn, quantity }) => (
                            <div key={addOn.id} className="flex justify-between text-sm">
                              <span className="text-gray-700">{addOn.name} × {quantity}</span>
                              <span className="font-medium text-gray-900">
                                {formatCurrency(
                                  addOn.pricePerPerson 
                                    ? addOn.price * quantity * participants 
                                    : addOn.price * quantity,
                                  addOn.currency
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-orange-300 pt-3 flex justify-between">
                          <span className="font-bold text-gray-900">{t('booking:addons.totalAddons')}</span>
                          <span className="font-bold text-xl text-orange-600">
                            {formatCurrency(addOnsTotal, tour.currency)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
               <div className="animate-fade-in flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('booking:payment.title')}</h2>
                  
                  {/* Payment Breakdown Card */}
                  <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8">
                     <h3 className="text-lg font-bold text-gray-900 mb-4">{t('booking:payment.scheduleTitle')}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm flex flex-col">
                            <span className="text-sm text-gray-500">{t('booking:payment.payNow')}</span>
                            <span className="text-xl font-bold text-gray-900">{depositTotal.toLocaleString()} {tour.currency}</span>
                            <span className="text-xs text-green-600 mt-1">{t('booking:payment.dueToday')}</span>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col opacity-75">
                            <span className="text-sm text-gray-500">{t('booking:payment.payLater')}</span>
                            <span className="text-xl font-bold text-gray-900">{remainingAmount.toLocaleString()} {tour.currency}</span>
                            <span className="text-xs text-gray-500 mt-1">{t('booking:payment.dueLater')}</span>
                        </div>
                     </div>
                  </div>

                  {/* Promo Code Section */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-6">
                     <div className="flex items-center gap-2 mb-4">
                        <Tag className="h-5 w-5 text-purple-600" />
                        <h3 className="text-lg font-bold text-gray-900">{t('booking:promo.havePromoCode')}</h3>
                     </div>
                     
                     {!appliedPromoCode ? (
                        <div className="flex gap-3">
                           <input 
                              type="text" 
                              placeholder={t('booking:payer.enterPromoCode')}
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                              onKeyPress={(e) => e.key === 'Enter' && handleApplyPromoCode()}
                              className="flex-1 border border-purple-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              disabled={isValidatingPromo}
                           />
                           <Button
                              onClick={handleApplyPromoCode}
                              disabled={isValidatingPromo || !promoCode.trim()}
                              loading={isValidatingPromo}
                              className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
                           >
                              {isValidatingPromo ? t('booking:promo.validating') : t('booking:promo.apply')}
                           </Button>
                        </div>
                     ) : (
                        <div className="flex items-center justify-between bg-green-100 border border-green-300 rounded-lg p-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                 <CheckCircle2 className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                 <p className="font-bold text-green-900">{appliedPromoCode}</p>
                                 <p className="text-sm text-green-700">{t('booking:promo.youSaved')} {discountAmount.toLocaleString()} {tour.currency}!</p>
                              </div>
                           </div>
                           <button
                              onClick={handleRemovePromoCode}
                              className="p-2 hover:bg-green-200 rounded-full transition"
                              title={t('booking:promo.removePromoCode')}
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

                  {/* New Payment Form Component */}
                  <PaymentSection
                     booking={{
                        id: `booking-${Date.now()}`,
                        totalAmount: finalAmount,
                        payer: payer,
                     } as any}
                     isDevelopmentMode={isDevelopmentMode}
                     onPaymentSuccess={(result) => {
                        setCurrentStep(3);
                        window.scrollTo(0, 0);
                     }}
                  />
               </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
                <div className="animate-fade-in flex-1 max-w-4xl mx-auto">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-14 w-14 text-green-600" />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">{t('booking:confirmation.title')}</h2>
                        <p className="text-xl text-gray-600">
                            {t('booking:confirmation.thankYou')}, <span className="font-semibold text-gray-900">{payer.firstName}!</span> {t('booking:confirmation.yourAdventureAwaits')}
                        </p>
                    </div>

                    {/* Booking Reference Card */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{t('booking:confirmation.ref')}</p>
                                <p className="text-3xl font-mono font-bold text-gray-900">#BK-{Math.floor(Math.random() * 100000)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600 mb-1">{t('booking:confirmation.bookingDate')}</p>
                                <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tour Details Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5 text-orange-600" />
                            {t('booking:confirmation.tourDetails')}
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-start">
                                <span className="text-gray-600">{t('booking:confirmation.tourName')}:</span>
                                <span className="font-semibold text-gray-900 text-right">{tour.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">{t('booking:confirmation.departureDate')}:</span>
                                <span className="font-semibold text-gray-900">{date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">{t('booking:confirmation.duration')}:</span>
                                <span className="font-semibold text-gray-900">{tour.durationDays} {t('home:days')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">{t('booking:confirmation.location')}:</span>
                                <span className="font-semibold text-gray-900">{tour.location}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">{t('booking:confirmation.numberOfTravelers')}:</span>
                                <span className="font-semibold text-gray-900">{participants} {participants === 1 ? t('booking:customize.person') : t('booking:customize.people')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Travelers Info */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{t('booking:confirmation.travelers')}</h3>
                        <div className="space-y-3">
                            {travelers.map((traveler, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{traveler.firstName} {traveler.lastName}</p>
                                            <p className="text-sm text-gray-500">{traveler.email}</p>
                                        </div>
                                    </div>
                                    {traveler.isPayer && (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                            {t('booking:confirmation.payer')}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add-ons (if any) */}
                    {selectedAddOns.size > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('booking:confirmation.selectedAddons')}</h3>
                            <div className="space-y-3">
                                {Array.from(selectedAddOns.values()).map(({ addOn, quantity }) => (
                                    <div key={addOn.id} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                                                {ADDON_TYPE_ICONS[addOn.type]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{addOn.name}</p>
                                                <p className="text-sm text-gray-500">{t('booking:confirmation.quantity')}: {quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            {formatCurrency(
                                                addOn.pricePerPerson 
                                                    ? addOn.price * quantity * participants 
                                                    : addOn.price * quantity,
                                                addOn.currency
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Payment Summary */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{t('booking:confirmation.paymentSummary')}</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">{t('booking:confirmation.tourBasePrice')}:</span>
                                <span className="text-gray-900">{formatCurrency(baseAmount, tour.currency)}</span>
                            </div>
                            {addOnsTotal > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">{t('booking:confirmation.addonsTotal')}:</span>
                                    <span className="text-gray-900">{formatCurrency(addOnsTotal, tour.currency)}</span>
                                </div>
                            )}
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>{t('booking:confirmation.discount')} ({appliedPromoCode}):</span>
                                    <span>-{formatCurrency(discountAmount, tour.currency)}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-3 mt-3">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-900">{t('booking:confirmation.totalAmount')}:</span>
                                    <span className="font-bold text-xl text-gray-900">{formatCurrency(finalAmount, tour.currency)}</span>
                                </div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold text-green-800">{t('booking:confirmation.paidToday')}:</span>
                                    <span className="font-bold text-green-800">{formatCurrency(depositTotal, tour.currency)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-700">{t('booking:payment.payLater')}:</span>
                                    <span className="font-semibold text-green-700">{formatCurrency(remainingAmount, tour.currency)}</span>
                                </div>
                                <p className="text-xs text-green-700 mt-2">
                                    {t('booking:confirmation.remainingBalanceDue')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{t('booking:confirmation.contactInformation')}</h3>
                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <span className="text-gray-600 min-w-24">{t('booking:confirmation.email')}:</span>
                                <span className="font-semibold text-gray-900">{payer.email}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-gray-600 min-w-24">{t('booking:confirmation.phone')}:</span>
                                <span className="font-semibold text-gray-900">{payer.phone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-gray-600 min-w-24">{t('booking:confirmation.address')}:</span>
                                <span className="font-semibold text-gray-900">
                                    {payer.address}, {payer.zipCode} {payer.city}, {payer.country}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Email Confirmation Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                        <div className="flex items-start gap-3">
                            <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-blue-900 mb-1">{t('booking:confirmation.confirmationEmailSent')}</h4>
                                <p className="text-sm text-blue-800">
                                    {t('booking:confirmation.confirmationEmailDetails')} <span className="font-semibold">{payer.email}</span>. 
                                    {t('booking:confirmation.checkInboxSpam')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{t('booking:confirmation.whatHappensNext')}</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0">
                                    1
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{t('booking:confirmation.checkYourEmail')}</p>
                                    <p className="text-sm text-gray-600">{t('booking:confirmation.reviewBookingConfirmation')}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0">
                                    2
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{t('booking:confirmation.prepareForTrip')}</p>
                                    <p className="text-sm text-gray-600">{t('booking:confirmation.visitMyPages')}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0">
                                    3
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{t('booking:confirmation.finalPayment')}</p>
                                    <p className="text-sm text-gray-600">{t('booking:confirmation.finalPaymentDetails')}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0">
                                    4
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{t('booking:confirmation.enjoyAdventure')}</p>
                                    <p className="text-sm text-gray-600">{t('booking:confirmation.getReadyExperience')} {date}.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                        <Button 
                            onClick={() => window.print()} 
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <CreditCard className="h-4 w-4" />
                            {t('booking:confirmation.printConfirmation')}
                        </Button>
            <Button 
              onClick={() => navigate('/my-bookings')} 
                            variant="primary"
                            className="flex items-center gap-2"
                        >
                            {t('booking:confirmation.viewMyBookings')}
                        </Button>
                        <Button 
                            onClick={() => navigate('/')} 
                            variant="ghost"
                        >
                            {t('booking:confirmation.browseMoreTours')}
                        </Button>
                    </div>
                </div>
            )}

            {/* Fallback for any unhandled step */}
            {currentStep !== 0 && currentStep !== 1 && currentStep !== 2 && currentStep !== 3 && (
              <div className="animate-fade-in flex-1 bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-700 font-semibold">Unknown step: {currentStep}</p>
                <button 
                  onClick={() => setCurrentStep(0)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reset to Start
                </button>
              </div>
            )}

      {/* Bottom Navigation Buttons (with Back button) */}
      {currentStep < 3 && (
        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Back Button: Only show if not on first step */}
          {currentStep > 0 && (
            <Button
              onClick={() => {
                setCurrentStep((prev) => Math.max(prev - 1, 0));
                window.scrollTo(0, 0);
              }}
              variant="outline"
              size="lg"
              className="md:w-auto shadow-none"
              icon={<ArrowLeft className="h-5 w-5" />}
            >
              {t('common:back') || 'Back'}
            </Button>
          )}
          <div className={currentStep > 0 ? 'md:ml-auto w-full md:w-auto' : 'w-full'}>
            {currentStep === 2 ? (
              <Button
                onClick={handleNext}
                disabled={isProcessing}
                loading={isProcessing}
                variant="primary"
                size="lg"
                fullWidth
                className="md:w-auto shadow-lg"
              >
                {isProcessing ? t('common:processing') : `${t('booking:payment.payBtn')} ${formatCurrency(depositTotal, tour.currency)}`}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="primary"
                size="lg"
                fullWidth
                className="md:w-auto shadow-lg"
                icon={<ChevronRight className="h-5 w-5" />}
              >
                {t('booking:payment.nextStep')}
              </Button>
            )}
          </div>
        </div>
      )}
          </div>

          {/* Sidebar Area - Summary (changes based on step) */}
          <div className="lg:col-span-1">
            {currentStep === 3 ? <ConfirmationSummary /> : <OrderSummary />}
          </div>
        </div>
      </div>
          </>
        )}
    </div>
  );
};
