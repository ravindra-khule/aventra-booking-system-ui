/**
 * Email Templates for Payment Reminders
 * These are visual representations of the emails that would be sent
 */

import React from 'react';
import { RemainingPaymentReminderData } from '../services/email.service';
import { AlertCircle, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';

interface EmailTemplateProps {
  data: RemainingPaymentReminderData;
}

/**
 * Remaining Payment Reminder Email Template
 * Sent 30 days before trip to remind guest to pay remaining balance
 */
export const RemainingPaymentReminderEmailTemplate: React.FC<EmailTemplateProps> = ({ data }) => {
  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1a202c', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>SWETT</h1>
        <p style={{ margin: '0', fontSize: '14px', opacity: 0.9 }}>Premium Guided Tours in Scandinavia</p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '30px', backgroundColor: '#f8f9fa' }}>
        {/* Greeting */}
        <p style={{ fontSize: '16px', marginBottom: '20px', color: '#333' }}>
          Hi {data.guestName},
        </p>

        {/* Alert Box */}
        <div
          style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            borderLeft: '4px solid #ff9800',
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            <AlertCircle style={{ color: '#ff9800', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ margin: '0 0 8px 0', color: '#856404', fontSize: '16px' }}>
                Payment Reminder: Complete Your Booking
              </h3>
              <p style={{ margin: '0', color: '#856404', fontSize: '14px' }}>
                Your trip is coming up soon! Please complete your remaining payment to secure your reservation.
              </p>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', marginBottom: '24px', border: '1px solid #ddd' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1a202c' }}>Your Booking Details</h3>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
                Booking Reference
              </p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#1a202c' }}>
                {data.bookingReference}
              </p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
                Trip Date
              </p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#1a202c' }}>
                {data.tripDate}
              </p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
                Tour
              </p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#1a202c' }}>
                {data.tourName}
              </p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
                Payment Due
              </p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#ff6b6b' }}>
                {data.paymentDueDate}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div style={{ backgroundColor: '#e3f2fd', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#1565c0' }}>Amount Due</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#555' }}>Total Amount:</span>
            <span style={{ fontWeight: 'bold', color: '#1a202c' }}>
              {data.remainingAmount + (data.remainingAmount * 0.1)?.toLocaleString()} {data.currency}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '8px',
              borderTop: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a202c' }}>Pay Now:</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2196f3' }}>
              {data.remainingAmount.toLocaleString()} {data.currency}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <a
            href={data.paymentLink || data.bookingDetailsUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#2196f3',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
            }}
          >
            Complete Your Payment
          </a>
        </div>

        {/* Important Info */}
        <div style={{ backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1a202c' }}>Important Information:</h4>
          <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', color: '#555' }}>
            <li style={{ marginBottom: '8px' }}>
              Payment must be received by <strong>{data.paymentDueDate}</strong> to secure your booking
            </li>
            <li style={{ marginBottom: '8px' }}>
              You can pay online through our secure payment portal
            </li>
            <li>All payments are processed securely by Stripe</li>
          </ul>
        </div>

        {/* Footer Info */}
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
          If you have any questions or need assistance, please contact our support team. We're here to help!
        </p>

        <p style={{ fontSize: '12px', color: '#999', margin: '0' }}>
          View your booking details:{' '}
          <a href={data.bookingDetailsUrl} style={{ color: '#2196f3', textDecoration: 'none' }}>
            {data.bookingDetailsUrl}
          </a>
        </p>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#1a202c', color: 'white', padding: '20px', textAlign: 'center', fontSize: '12px' }}>
        <p style={{ margin: '0 0 8px 0' }}>© 2026 SWETT AB. All rights reserved.</p>
        <p style={{ margin: '0', opacity: 0.7 }}>Premium Guided Tours and Expeditions in Scandinavia</p>
      </div>
    </div>
  );
};

/**
 * Payment Confirmation Email Template
 * Sent after successful payment
 */
export const PaymentConfirmationEmailTemplate: React.FC<{
  data: {
    guestName: string;
    tourName: string;
    amount: number;
    currency: string;
    transactionId: string;
    paymentDate: string;
    bookingReference: string;
  };
}> = ({ data }) => {
  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1a202c', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>SWETT</h1>
        <p style={{ margin: '0', fontSize: '14px', opacity: 0.9 }}>Premium Guided Tours in Scandinavia</p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '30px', backgroundColor: '#f8f9fa' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <CheckCircle2 style={{ color: '#4caf50', width: '32px', height: '32px' }} />
          <h2 style={{ margin: '0', fontSize: '24px', color: '#4caf50' }}>Payment Received!</h2>
        </div>

        <p style={{ fontSize: '16px', marginBottom: '20px', color: '#333' }}>
          Hi {data.guestName},
        </p>

        <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
          Thank you for your payment! We've successfully received your payment for <strong>{data.tourName}</strong>.
        </p>

        {/* Confirmation Details */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', marginBottom: '24px', border: '1px solid #ddd' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1a202c' }}>Payment Confirmation Details</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
                Transaction ID
              </p>
              <p style={{ margin: '0', fontSize: '14px', fontFamily: 'monospace', color: '#1a202c' }}>
                {data.transactionId}
              </p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
                Payment Date
              </p>
              <p style={{ margin: '0', fontSize: '14px', color: '#1a202c' }}>{data.paymentDate}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
                Booking Reference
              </p>
              <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold', color: '#1a202c' }}>
                {data.bookingReference}
              </p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
                Amount Paid
              </p>
              <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold', color: '#4caf50' }}>
                {data.amount.toLocaleString()} {data.currency}
              </p>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '14px', color: '#666' }}>
          Your booking is now confirmed. A detailed itinerary will be sent to you soon. If you have any questions, please
          don't hesitate to contact us.
        </p>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#1a202c', color: 'white', padding: '20px', textAlign: 'center', fontSize: '12px' }}>
        <p style={{ margin: '0 0 8px 0' }}>© 2026 SWETT AB. All rights reserved.</p>
        <p style={{ margin: '0', opacity: 0.7 }}>Premium Guided Tours and Expeditions in Scandinavia</p>
      </div>
    </div>
  );
};
