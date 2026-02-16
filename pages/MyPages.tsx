import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';
import { Booking, BookingStatus, PaymentStatus } from '../types';
import { getSampleBooking } from '../src/features/bookings/services/booking.service';
import { Calendar, MapPin, Users, CreditCard, CheckCircle2, Clock, Mail, Phone, User as UserIcon, Download, ChevronDown, ChevronUp } from 'lucide-react';

export const MyPages = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBookings, setExpandedBookings] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    // Load bookings from localStorage
    const loadBookings = () => {
      try {
        const storedBookings = localStorage.getItem('userBookings');
        if (storedBookings) {
          const parsedBookings = JSON.parse(storedBookings);
          // Keep only the first booking for demo purposes
          const sampleBooking = parsedBookings.length > 0 ? [parsedBookings[0]] : [];
          setBookings(sampleBooking);
          // Update localStorage to keep only one booking
          localStorage.setItem('userBookings', JSON.stringify(sampleBooking));
        } else {
          // Initialize with one sample booking for demonstration
          const sampleBooking = [getSampleBooking()];
          setBookings(sampleBooking);
          localStorage.setItem('userBookings', JSON.stringify(sampleBooking));
        }
      } catch (error) {
        console.error('Failed to load bookings from localStorage', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const toggleBookingExpansion = (bookingId: string | number) => {
    setExpandedBookings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  const downloadBookingPDF = async (bookingId: string | number) => {
    const el = document.getElementById(`booking-${bookingId}`);
    if (!el) {
      alert(t('myPages:exportError') || 'Could not find booking to export');
      return;
    }

    try {
      // Render element to canvas
      const canvas = await html2canvas(el, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      // Create PDF and add image
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`booking-${bookingId}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      alert(t('myPages:pdfError') || 'Failed to generate PDF');
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch(status) {
      case BookingStatus.CONFIRMED: return 'bg-green-100 text-green-800 border-green-200';
      case BookingStatus.PENDING: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case BookingStatus.CANCELLED: return 'bg-red-100 text-red-800 border-red-200';
      case BookingStatus.COMPLETED: return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentColor = (status: PaymentStatus) => {
    switch(status) {
      case PaymentStatus.PAID: return 'bg-blue-100 text-blue-800';
      case PaymentStatus.PARTIAL: return 'bg-orange-100 text-orange-800';
      case PaymentStatus.UNPAID: return 'bg-red-100 text-red-800';
      case PaymentStatus.REFUNDED: return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">{t('common:loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('myPages:title')}</h1>
          <p className="text-gray-600 mt-2">{t('myPages:welcome')}</p>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('myPages:noTrips')}</h3>
            <p className="text-gray-500 mb-6">{t('myPages:exploreText')}</p>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary btn-lg"
            >
              {t('myPages:browseBtn')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">{t('myPages:upcoming')}</h2>
            
            {bookings.map((booking) => {
              const remainingAmount = booking.totalAmount - booking.paidAmount;
              const isExpanded = expandedBookings.has(booking.id);
              
              return (
                <div id={`booking-${booking.id}`} key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                  {/* Compact Header - Always Visible */}
                  <div 
                    onClick={() => toggleBookingExpansion(booking.id)}
                    className="cursor-pointer hover:bg-gray-50 transition"
                  >
                    <div className="relative h-32 bg-gray-800">
                      {booking.tourImageUrl ? (
                        <img 
                          src={booking.tourImageUrl} 
                          alt={booking.tourTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="h-12 w-12 text-white opacity-50" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex gap-2 items-center">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        {booking.promoCode && (
                          <span className="px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-red-600 text-white border border-red-700 shadow-lg">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {booking.promoCode}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Compact Info */}
                    <div className="p-4 bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{booking.tourTitle}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1.5" />
                              <span>{booking.tripDate}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1.5" />
                              <span>{booking.participants} {booking.participants === 1 ? t('myPages:traveler') : t('myPages:travelers')}</span>
                            </div>
                            <div className="flex items-center">
                              <CreditCard className="h-4 w-4 mr-1.5" />
                              <span className="font-semibold">{booking.totalAmount.toLocaleString()} SEK</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          {/* Download PDF button */}
                          <button
                            title={t('myPages:downloadPDF')}
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadBookingPDF(booking.id);
                            }}
                            className="inline-flex items-center justify-center p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm transition"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          {/* Expand/Collapse Icon */}
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600">
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details - Conditionally Visible */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                        {/* Left Column - Trip Details */}
                        <div className="flex-1">
                          {/* Promo Code Savings Badge */}
                          {booking.promoCode && booking.discountAmount && (
                            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full mb-4 shadow-md">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-bold text-sm">
                                {t('myPages:savedAmount')} {booking.discountAmount.toLocaleString()} SEK {t('myPages:withCode')} {booking.promoCode}!
                              </span>
                            </div>
                          )}
                          
                          <div className="space-y-2 mb-6">
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-2" />
                              <span className="text-sm">{t('myPages:bookedOn')}: {booking.bookingDate}</span>
                            </div>
                          </div>

                          {/* Booking Reference */}
                          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                            <p className="text-xs text-gray-500 mb-1">{t('myPages:bookingRef')}</p>
                            <p className="text-lg font-mono font-bold text-gray-900">{booking.id}</p>
                          </div>

                          {/* Payer Information */}
                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
                              <UserIcon className="h-4 w-4 mr-2" /> {t('myPages:contactPerson')}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center text-gray-600">
                                <UserIcon className="h-3 w-3 mr-2 text-gray-400" />
                                <span>{booking.payer.firstName} {booking.payer.lastName}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Mail className="h-3 w-3 mr-2 text-gray-400" />
                                <span>{booking.payer.email}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Phone className="h-3 w-3 mr-2 text-gray-400" />
                                <span>{booking.payer.phone}</span>
                              </div>
                            </div>
                          </div>

                          {/* Travelers List */}
                          {booking.travelers && booking.travelers.length > 0 && (
                            <div className="border-t border-gray-200 pt-4 mt-4">
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                                {t('myPages:travelers')} ({booking.travelers.length})
                              </h4>
                              <div className="space-y-2">
                                {booking.travelers.map((traveler, idx) => (
                                  <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg text-sm border border-gray-200">
                                    <div className="flex items-center">
                                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-blue-600 font-bold text-xs">{idx + 1}</span>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-900">{traveler.firstName} {traveler.lastName}</p>
                                        <p className="text-xs text-gray-500">{traveler.email}</p>
                                      </div>
                                    </div>
                                    {traveler.isPayer && (
                                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                        {t('myPages:payer')}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Column - Payment Info */}
                        <div className="lg:w-80">
                          <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center">
                              <CreditCard className="h-4 w-4 mr-2" /> {t('myPages:paymentDetails')}
                            </h4>
                            
                            <div className="space-y-3 mb-4">
                              {/* Show promo code if applied */}
                              {booking.promoCode && booking.discountAmount && (
                                <div className="bg-purple-100 border border-purple-200 rounded-lg p-3 -mx-2 mb-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span className="text-xs font-bold text-purple-900 uppercase tracking-wide">{t('myPages:promoApplied')}</span>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-purple-700">{t('myPages:code')}:</span>
                                      <span className="font-mono font-bold text-purple-900">{booking.promoCode}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-purple-700">{t('myPages:youSaved')}:</span>
                                      <span className="font-bold text-purple-900">{booking.discountAmount.toLocaleString()} SEK</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">{t('myPages:totalAmount')}</span>
                                <span className="font-bold text-gray-900">{booking.totalAmount.toLocaleString()} SEK</span>
                              </div>
                              <div className="flex justify-between text-sm text-green-600">
                                <span>{t('myPages:paidAmount')}</span>
                                <span className="font-bold">-{booking.paidAmount.toLocaleString()} SEK</span>
                              </div>
                              {remainingAmount > 0 && (
                                <div className="border-t border-gray-200 pt-3 flex justify-between text-sm">
                                  <span className="text-gray-700 font-medium">{t('myPages:remainingBalance')}</span>
                                  <span className="font-bold text-orange-600">{remainingAmount.toLocaleString()} SEK</span>
                                </div>
                              )}
                            </div>

                            <div className="mb-4">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentColor(booking.paymentStatus)}`}>
                                {booking.paymentStatus}
                              </span>
                            </div>

                            {booking.paymentStatus === PaymentStatus.PARTIAL && (
                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                                <p className="text-xs text-orange-800">
                                  <strong>{t('myPages:reminderTitle')}</strong><br />
                                  {t('myPages:reminderText')}
                                </p>
                              </div>
                            )}

                            {booking.paymentStatus === PaymentStatus.PAID && (
                              <div className="flex items-center justify-center text-green-600 text-sm font-medium">
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                {t('myPages:fullyPaid')}
                              </div>
                            )}

                            {booking.transactionId && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500">{t('myPages:transactionId')}</p>
                                <p className="font-mono text-xs text-gray-600 truncate">{booking.transactionId}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
