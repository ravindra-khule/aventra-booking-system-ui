import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tour, Traveler, PayerDetails } from '../../types';
import { TourAddOn, SelectedAddOn, AddOnType } from '../../src/features/tours/types/tour.types';
import { TourService, BookingService, PromoCodeService } from '../../services/api';
import { AddOnService } from '../../src/features/tours/services/addon.service';
import { useTranslation } from '../../context/LanguageContext';
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
    'Travelers & Add-ons',
    'Details', 
    'Payment', 
    'Confirmation'
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
      
      // Load available add-ons for this tour
      setIsLoadingAddOns(true);
      AddOnService.getByTourId(tourId).then((addOns) => {
        setAvailableAddOns(addOns);
        setIsLoadingAddOns(false);
      }).catch(() => {
        setIsLoadingAddOns(false);
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
      setIsProcessing(true);
      try {
        const baseTotal = (tour?.price || 0) * participants;
        const addOnsTotal = calculateAddOnsTotal();
        const subtotal = baseTotal + addOnsTotal;
        const finalTotal = subtotal - discountAmount;
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
            selectedAddOns: Array.from(selectedAddOns.values()).map(({ addOn, quantity }) => ({
              addOnId: addOn.id,
              addOn: addOn,
              quantity: quantity,
              totalPrice: addOn.pricePerPerson ? addOn.price * quantity * participants : addOn.price * quantity,
            })),
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
          <h3 className="text-lg font-bold text-gray-900">Booking Confirmed</h3>
          <p className="text-xs text-gray-600">Your adventure is secured</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4 border border-green-100">
        <p className="text-xs text-gray-500 mb-1">Reference Number</p>
        <p className="text-xl font-mono font-bold text-gray-900">#BK-{Math.floor(Math.random() * 100000)}</p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="bg-white rounded-lg p-3 border border-green-100">
          <p className="text-xs text-gray-500 mb-1">Tour</p>
          <p className="font-semibold text-gray-900 text-sm">{tour.title}</p>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-green-100">
          <p className="text-xs text-gray-500 mb-1">Departure</p>
          <p className="font-semibold text-gray-900 text-sm">{date}</p>
        </div>

        <div className="bg-white rounded-lg p-3 border border-green-100">
          <p className="text-xs text-gray-500 mb-1">Travelers</p>
          <p className="font-semibold text-gray-900 text-sm">{participants} {participants === 1 ? 'person' : 'people'}</p>
        </div>
      </div>

      <div className="bg-green-600 text-white rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Amount Paid</span>
          <span className="text-2xl font-bold">{formatCurrency(depositTotal, tour.currency)}</span>
        </div>
        <div className="flex justify-between items-center text-green-100 text-xs">
          <span>Remaining Balance</span>
          <span className="font-semibold">{formatCurrency(remainingAmount, tour.currency)}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-green-100">
        <div className="flex items-start gap-2 mb-3">
          <Info className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-700">
            Confirmation email sent to <span className="font-semibold">{payer.email}</span>
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Shield className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-700">
            Your booking is protected and secure
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
          View My Bookings
        </Button>
        <Button 
          onClick={() => navigate('/')} 
          variant="outline" 
          fullWidth
        >
          Browse More Tours
        </Button>
      </div>
    </div>
  );

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
           <span className="text-gray-600">Base Price</span>
           <span className="text-gray-900">{baseAmount.toLocaleString()} {tour.currency}</span>
        </div>
        
        {/* Show add-ons if any selected */}
        {selectedAddOns.size > 0 && (
          <>
            <div className="pt-2 pb-1 border-t border-orange-100">
              <span className="text-xs font-semibold text-gray-600 uppercase">Add-ons</span>
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
               <span className="text-gray-700">Subtotal</span>
               <span className="text-gray-900">{subtotal.toLocaleString()} {tour.currency}</span>
            </div>
          </>
        )}
        
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
          <div className="lg:col-span-2 flex flex-col">
            
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
                        <Input
                            label={t('booking.payer.firstName')}
                            type="text"
                            value={payer.firstName}
                            onChange={e => handlePayerChange('firstName', e.target.value)}
                            required
                            fullWidth
                        />
                        <Input
                            label={t('booking.payer.lastName')}
                            type="text"
                            value={payer.lastName}
                            onChange={e => handlePayerChange('lastName', e.target.value)}
                            required
                            fullWidth
                        />
                        <div className="md:col-span-2">
                            <Select
                                label={t('booking.payer.country')}
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
                                label={t('booking.payer.address')}
                                type="text"
                                value={payer.address}
                                onChange={e => handlePayerChange('address', e.target.value)}
                                placeholder="Street and number"
                                required
                                fullWidth
                            />
                        </div>
                        <Input
                            label={t('booking.payer.zip')}
                            type="text"
                            value={payer.zipCode}
                            onChange={e => handlePayerChange('zipCode', e.target.value)}
                            required
                            fullWidth
                        />
                        <Input
                            label={t('booking.payer.city')}
                            type="text"
                            value={payer.city}
                            onChange={e => handlePayerChange('city', e.target.value)}
                            required
                            fullWidth
                        />
                        <Input
                            label={t('booking.payer.phone')}
                            type="tel"
                            value={payer.phone}
                            onChange={e => handlePayerChange('phone', e.target.value)}
                            required
                            fullWidth
                        />
                        <Input
                            label={t('booking.payer.email')}
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
                                <Input
                                    label={t('booking.payer.firstName')}
                                    type="text"
                                    value={traveler.firstName}
                                    onChange={(e) => handleTravelerChange(index, 'firstName', e.target.value)}
                                    disabled={traveler.isPayer}
                                    required
                                    fullWidth
                                />
                                <Input
                                    label={t('booking.payer.lastName')}
                                    type="text"
                                    value={traveler.lastName}
                                    onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)}
                                    disabled={traveler.isPayer}
                                    required
                                    fullWidth
                                />
                                <Input
                                    label={t('booking.payer.phone')}
                                    type="tel"
                                    value={traveler.phone}
                                    onChange={(e) => handleTravelerChange(index, 'phone', e.target.value)}
                                    disabled={traveler.isPayer}
                                    required
                                    fullWidth
                                />
                                <Input
                                    label={t('booking.payer.email')}
                                    type="email"
                                    value={traveler.email}
                                    onChange={(e) => handleTravelerChange(index, 'email', e.target.value)}
                                    disabled={traveler.isPayer}
                                    required
                                    fullWidth
                                />

                                <div className="md:col-span-2">
                                    <Input
                                        label={t('booking.payer.address')}
                                        type="text"
                                        value={traveler.address}
                                        onChange={(e) => handleTravelerChange(index, 'address', e.target.value)}
                                        disabled={traveler.isPayer}
                                        placeholder="Street Address"
                                        required
                                        fullWidth
                                    />
                                </div>

                                <Input
                                    label={t('booking.payer.zip')}
                                    type="text"
                                    value={traveler.zipCode}
                                    onChange={(e) => handleTravelerChange(index, 'zipCode', e.target.value)}
                                    disabled={traveler.isPayer}
                                    required
                                    fullWidth
                                />
                                <Input
                                    label={t('booking.payer.city')}
                                    type="text"
                                    value={traveler.city}
                                    onChange={(e) => handleTravelerChange(index, 'city', e.target.value)}
                                    disabled={traveler.isPayer}
                                    required
                                    fullWidth
                                />
                                
                                <div className="md:col-span-2">
                                    <Input
                                        label={t('booking.traveler.ssn')}
                                        type="text"
                                        value={traveler.ssn}
                                        onChange={(e) => handleTravelerChange(index, 'ssn', e.target.value)}
                                        placeholder="YYYYMMDD"
                                        required
                                        fullWidth
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

            {/* Step 0: Add-ons & Extras */}
            {currentStep === 0 && (
              <div className="animate-fade-in flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Travelers & Add-ons</h2>
                <p className="text-gray-600 mb-6">Select number of travelers and add optional extras to make your trip even more memorable</p>
                
                {/* Number of Travelers */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Travelers
                      </label>
                      <p className="text-xs text-gray-500">How many people are traveling?</p>
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
                        <p className="text-xs text-gray-600">travelers</p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Optional Add-ons</h3>
                
                {isLoadingAddOns ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-gray-500">Loading available add-ons...</div>
                  </div>
                ) : availableAddOns.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No add-ons available for this tour</p>
                    <p className="text-sm text-gray-500 mt-2">Continue to the next step</p>
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
                                      Required
                                    </span>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold text-gray-900">
                                    {formatCurrency(itemPrice, addOn.currency)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {addOn.pricePerPerson ? 'per person' : 'per booking'}
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
                                    <div className="text-sm text-gray-600">Total for this item</div>
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
                                  {addOn.minQuantity > 1 && `Minimum: ${addOn.minQuantity}`}
                                  {addOn.minQuantity > 1 && addOn.maxQuantity > 0 && ' • '}
                                  {addOn.maxQuantity > 0 && `Maximum: ${addOn.maxQuantity}`}
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
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Selected Add-ons Summary</h3>
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
                          <span className="font-bold text-gray-900">Total Add-ons</span>
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
                           <Button
                              onClick={handleApplyPromoCode}
                              disabled={isValidatingPromo || !promoCode.trim()}
                              loading={isValidatingPromo}
                              className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
                           >
                              {isValidatingPromo ? 'Validating...' : 'Apply'}
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
                        <Input
                            type="text"
                            placeholder={t('booking.payment.cardNumber')}
                            fullWidth
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="text"
                                placeholder={t('booking.payment.expiry')}
                                fullWidth
                            />
                            <Input
                                type="text"
                                placeholder={t('booking.payment.cvc')}
                                fullWidth
                            />
                        </div>
                        <Input
                            type="text"
                            placeholder={t('booking.payment.holderName')}
                            fullWidth
                        />
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
                <div className="animate-fade-in flex-1 max-w-4xl mx-auto">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-14 w-14 text-green-600" />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">Booking Confirmed!</h2>
                        <p className="text-xl text-gray-600">
                            Thank you, <span className="font-semibold text-gray-900">{payer.firstName}!</span> Your adventure awaits.
                        </p>
                    </div>

                    {/* Booking Reference Card */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
                                <p className="text-3xl font-mono font-bold text-gray-900">#BK-{Math.floor(Math.random() * 100000)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600 mb-1">Booking Date</p>
                                <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tour Details Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5 text-orange-600" />
                            Tour Details
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-start">
                                <span className="text-gray-600">Tour Name:</span>
                                <span className="font-semibold text-gray-900 text-right">{tour.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Departure Date:</span>
                                <span className="font-semibold text-gray-900">{date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Duration:</span>
                                <span className="font-semibold text-gray-900">{tour.durationDays} days</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Location:</span>
                                <span className="font-semibold text-gray-900">{tour.location}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Number of Travelers:</span>
                                <span className="font-semibold text-gray-900">{participants} {participants === 1 ? 'person' : 'people'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Travelers Info */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Travelers</h3>
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
                                            Payer
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add-ons (if any) */}
                    {selectedAddOns.size > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Selected Add-ons</h3>
                            <div className="space-y-3">
                                {Array.from(selectedAddOns.values()).map(({ addOn, quantity }) => (
                                    <div key={addOn.id} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                                                {ADDON_TYPE_ICONS[addOn.type]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{addOn.name}</p>
                                                <p className="text-sm text-gray-500">Quantity: {quantity}</p>
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
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tour Base Price:</span>
                                <span className="text-gray-900">{formatCurrency(baseAmount, tour.currency)}</span>
                            </div>
                            {addOnsTotal > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Add-ons Total:</span>
                                    <span className="text-gray-900">{formatCurrency(addOnsTotal, tour.currency)}</span>
                                </div>
                            )}
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount ({appliedPromoCode}):</span>
                                    <span>-{formatCurrency(discountAmount, tour.currency)}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-3 mt-3">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-900">Total Amount:</span>
                                    <span className="font-bold text-xl text-gray-900">{formatCurrency(finalAmount, tour.currency)}</span>
                                </div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold text-green-800">Paid Today:</span>
                                    <span className="font-bold text-green-800">{formatCurrency(depositTotal, tour.currency)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-700">Remaining Balance:</span>
                                    <span className="font-semibold text-green-700">{formatCurrency(remainingAmount, tour.currency)}</span>
                                </div>
                                <p className="text-xs text-green-700 mt-2">
                                    Remaining balance due 30 days before departure
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <span className="text-gray-600 min-w-24">Email:</span>
                                <span className="font-semibold text-gray-900">{payer.email}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-gray-600 min-w-24">Phone:</span>
                                <span className="font-semibold text-gray-900">{payer.phone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-gray-600 min-w-24">Address:</span>
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
                                <h4 className="font-semibold text-blue-900 mb-1">Confirmation Email Sent</h4>
                                <p className="text-sm text-blue-800">
                                    A detailed confirmation email with your booking details, travel documents, and next steps has been sent to <span className="font-semibold">{payer.email}</span>. 
                                    Please check your inbox and spam folder.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">What Happens Next?</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0">
                                    1
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Check Your Email</p>
                                    <p className="text-sm text-gray-600">Review your booking confirmation and save it for your records.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0">
                                    2
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Prepare for Your Trip</p>
                                    <p className="text-sm text-gray-600">Visit "My Pages" to access your trip preparation guide and packing list.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0">
                                    3
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Final Payment</p>
                                    <p className="text-sm text-gray-600">Complete your remaining payment 30 days before departure. We'll send you a reminder.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0">
                                    4
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Enjoy Your Adventure!</p>
                                    <p className="text-sm text-gray-600">Get ready for an unforgettable experience on {date}.</p>
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
                            Print Confirmation
                        </Button>
            <Button 
              onClick={() => navigate('/my-bookings')} 
                            variant="primary"
                            className="flex items-center gap-2"
                        >
                            View My Bookings
                        </Button>
                        <Button 
                            onClick={() => navigate('/')} 
                            variant="ghost"
                        >
                            Browse More Tours
                        </Button>
                    </div>
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
              {t('common.back') || 'Back'}
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
                {isProcessing ? t('common.processing') : `${t('booking.payment.payBtn')} ${formatCurrency(depositTotal, tour.currency)}`}
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
                {t('booking.payment.nextStep')}
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
    </div>
  );
};
