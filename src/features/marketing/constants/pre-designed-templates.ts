/**
 * Pre-designed Email Templates - Ready-to-use templates
 */

import {
  EmailTemplateCategory,
  EmailTemplateStatus,
  PreDesignedTemplate
} from '../types/email.types';

export const PRE_DESIGNED_TEMPLATES: PreDesignedTemplate[] = [
  // Booking Confirmation
  {
    name: 'Booking Confirmation',
    description: 'Confirmation email sent when a booking is successfully created',
    category: EmailTemplateCategory.BOOKING,
    tags: ['booking', 'confirmation', 'automated'],
    content: [
      {
        language: 'en',
        subject: 'Booking Confirmed - {{tourName}}',
        preheader: 'Your adventure awaits! Here are your booking details.',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">Booking Confirmed! 🎉</h1>
            </div>
            
            <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
              <p style="font-size: 16px; color: #374151;">Hi {{customerFirstName}},</p>
              
              <p style="font-size: 16px; color: #374151;">Great news! Your booking has been confirmed. We're excited to have you join us on this amazing adventure!</p>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <h2 style="margin-top: 0; color: #1f2937; font-size: 20px;">Booking Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Booking ID:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{bookingId}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Tour:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{tourName}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Departure Date:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{tourDepartureDate}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Duration:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{tourDuration}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Total Amount:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 700; font-size: 18px;">{{bookingTotal}}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #92400e;"><strong>⚠️ Important:</strong> Please complete your payment by <strong>{{paymentDate}}</strong> to secure your spot.</p>
              </div>
              
              <p style="font-size: 16px; color: #374151;">If you have any questions, feel free to contact us at {{companyEmail}} or call {{companyPhone}}.</p>
              
              <p style="font-size: 16px; color: #374151;">We can't wait to see you!</p>
              
              <p style="font-size: 16px; color: #374151;">Best regards,<br>The {{companyName}} Team</p>
            </div>
            
            <div style="background-color: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
              <p style="margin: 0;">© {{currentYear}} {{companyName}}. All rights reserved.</p>
              <p style="margin: 5px 0;">{{companyAddress}}</p>
              <p style="margin: 5px 0;"><a href="{{viewOnlineLink}}" style="color: #60a5fa;">View Online</a></p>
            </div>
          </div>
        `
      },
      {
        language: 'sv',
        subject: 'Bokning Bekräftad - {{tourName}}',
        preheader: 'Ditt äventyr väntar! Här är dina bokningsdetaljer.',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">Bokning Bekräftad! 🎉</h1>
            </div>
            
            <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
              <p style="font-size: 16px; color: #374151;">Hej {{customerFirstName}},</p>
              
              <p style="font-size: 16px; color: #374151;">Fantastiska nyheter! Din bokning har bekräftats. Vi ser fram emot att ha dig med på detta fantastiska äventyr!</p>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <h2 style="margin-top: 0; color: #1f2937; font-size: 20px;">Bokningsdetaljer</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Boknings-ID:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{bookingId}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Resa:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{tourName}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Avresedatum:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{tourDepartureDate}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Längd:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{tourDuration}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Totalt belopp:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 700; font-size: 18px;">{{bookingTotal}}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #92400e;"><strong>⚠️ Viktigt:</strong> Vänligen slutför din betalning senast <strong>{{paymentDate}}</strong> för att säkra din plats.</p>
              </div>
              
              <p style="font-size: 16px; color: #374151;">Om du har några frågor, kontakta oss gärna på {{companyEmail}} eller ring {{companyPhone}}.</p>
              
              <p style="font-size: 16px; color: #374151;">Vi ser fram emot att träffa dig!</p>
              
              <p style="font-size: 16px; color: #374151;">Med vänliga hälsningar,<br>{{companyName}}-teamet</p>
            </div>
            
            <div style="background-color: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
              <p style="margin: 0;">© {{currentYear}} {{companyName}}. Alla rättigheter förbehållna.</p>
              <p style="margin: 5px 0;">{{companyAddress}}</p>
              <p style="margin: 5px 0;"><a href="{{viewOnlineLink}}" style="color: #60a5fa;">Visa Online</a></p>
            </div>
          </div>
        `
      }
    ]
  },
  
  // Payment Receipt
  {
    name: 'Payment Receipt',
    description: 'Receipt sent after a successful payment',
    category: EmailTemplateCategory.PAYMENT,
    tags: ['payment', 'receipt', 'automated'],
    content: [
      {
        language: 'en',
        subject: 'Payment Received - {{invoiceNumber}}',
        preheader: 'Thank you for your payment. Here is your receipt.',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #059669; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">Payment Received ✓</h1>
            </div>
            
            <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
              <p style="font-size: 16px; color: #374151;">Dear {{customerFullName}},</p>
              
              <p style="font-size: 16px; color: #374151;">Thank you for your payment. We have successfully received your payment and your booking is now fully confirmed!</p>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
                <h2 style="margin-top: 0; color: #1f2937; font-size: 20px;">Payment Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Invoice Number:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{invoiceNumber}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Payment Date:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{paymentDate}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Amount Paid:</td>
                    <td style="padding: 8px 0; color: #059669; font-weight: 700; font-size: 18px;">{{paymentAmount}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Payment Method:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{paymentMethod}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Booking ID:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{bookingId}}</td>
                  </tr>
                </table>
              </div>
              
              <p style="font-size: 16px; color: #374151;">A copy of your receipt has been saved to your account for your records.</p>
              
              <p style="font-size: 16px; color: #374151;">Best regards,<br>The {{companyName}} Team</p>
            </div>
            
            <div style="background-color: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
              <p style="margin: 0;">© {{currentYear}} {{companyName}}. All rights reserved.</p>
              <p style="margin: 5px 0;">{{companyAddress}}</p>
            </div>
          </div>
        `
      },
      {
        language: 'sv',
        subject: 'Betalning Mottagen - {{invoiceNumber}}',
        preheader: 'Tack för din betalning. Här är ditt kvitto.',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #059669; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">Betalning Mottagen ✓</h1>
            </div>
            
            <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
              <p style="font-size: 16px; color: #374151;">Bästa {{customerFullName}},</p>
              
              <p style="font-size: 16px; color: #374151;">Tack för din betalning. Vi har framgångsrikt mottagit din betalning och din bokning är nu helt bekräftad!</p>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
                <h2 style="margin-top: 0; color: #1f2937; font-size: 20px;">Betalningsdetaljer</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Fakturanummer:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{invoiceNumber}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Betalningsdatum:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{paymentDate}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Betalt belopp:</td>
                    <td style="padding: 8px 0; color: #059669; font-weight: 700; font-size: 18px;">{{paymentAmount}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Betalningsmetod:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{paymentMethod}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Boknings-ID:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{bookingId}}</td>
                  </tr>
                </table>
              </div>
              
              <p style="font-size: 16px; color: #374151;">En kopia av ditt kvitto har sparats till ditt konto för dina register.</p>
              
              <p style="font-size: 16px; color: #374151;">Med vänliga hälsningar,<br>{{companyName}}-teamet</p>
            </div>
            
            <div style="background-color: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
              <p style="margin: 0;">© {{currentYear}} {{companyName}}. Alla rättigheter förbehållna.</p>
              <p style="margin: 5px 0;">{{companyAddress}}</p>
            </div>
          </div>
        `
      }
    ]
  },

  // Tour Reminder
  {
    name: 'Tour Reminder',
    description: 'Reminder email sent before tour departure',
    category: EmailTemplateCategory.REMINDER,
    tags: ['reminder', 'pre-tour', 'automated'],
    content: [
      {
        language: 'en',
        subject: 'Your Adventure Starts Soon! - {{tourName}}',
        preheader: 'Important information for your upcoming tour.',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">Your Adventure Starts Soon! ⏰</h1>
            </div>
            
            <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
              <p style="font-size: 16px; color: #374151;">Hi {{customerFirstName}},</p>
              
              <p style="font-size: 16px; color: #374151;">We're excited to remind you that your tour <strong>{{tourName}}</strong> is coming up soon!</p>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h2 style="margin-top: 0; color: #1f2937; font-size: 20px;">Tour Information</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Departure Date:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 700;">{{tourDepartureDate}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Duration:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{tourDuration}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Difficulty:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{tourDifficulty}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Booking ID:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{bookingId}}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1e40af;">📋 What to Bring:</h3>
                <ul style="margin: 10px 0; padding-left: 20px; color: #1e3a8a;">
                  <li>Valid ID or passport</li>
                  <li>Comfortable outdoor clothing</li>
                  <li>Weather-appropriate gear</li>
                  <li>Personal medications</li>
                  <li>Camera (optional)</li>
                </ul>
              </div>
              
              <p style="font-size: 16px; color: #374151;">If you have any questions, please contact us at {{companyEmail}} or {{companyPhone}}.</p>
              
              <p style="font-size: 16px; color: #374151;">See you soon!<br>The {{companyName}} Team</p>
            </div>
            
            <div style="background-color: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
              <p style="margin: 0;">© {{currentYear}} {{companyName}}. All rights reserved.</p>
            </div>
          </div>
        `
      },
      {
        language: 'sv',
        subject: 'Ditt Äventyr Startar Snart! - {{tourName}}',
        preheader: 'Viktig information för din kommande resa.',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">Ditt Äventyr Startar Snart! ⏰</h1>
            </div>
            
            <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
              <p style="font-size: 16px; color: #374151;">Hej {{customerFirstName}},</p>
              
              <p style="font-size: 16px; color: #374151;">Vi är glada att påminna dig om att din resa <strong>{{tourName}}</strong> snart börjar!</p>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h2 style="margin-top: 0; color: #1f2937; font-size: 20px;">Reseinformation</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Avresedatum:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 700;">{{tourDepartureDate}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Längd:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{tourDuration}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Svårighetsgrad:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{tourDifficulty}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Boknings-ID:</td>
                    <td style="padding: 8px 0; color: #1f2937;">{{bookingId}}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1e40af;">📋 Att Ta Med:</h3>
                <ul style="margin: 10px 0; padding-left: 20px; color: #1e3a8a;">
                  <li>Giltig ID eller pass</li>
                  <li>Bekväma utomhuskläder</li>
                  <li>Väderanpassad utrustning</li>
                  <li>Personliga mediciner</li>
                  <li>Kamera (valfritt)</li>
                </ul>
              </div>
              
              <p style="font-size: 16px; color: #374151;">Om du har några frågor, kontakta oss på {{companyEmail}} eller {{companyPhone}}.</p>
              
              <p style="font-size: 16px; color: #374151;">Vi ses snart!<br>{{companyName}}-teamet</p>
            </div>
            
            <div style="background-color: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
              <p style="margin: 0;">© {{currentYear}} {{companyName}}. Alla rättigheter förbehållna.</p>
            </div>
          </div>
        `
      }
    ]
  }
];
