/**
 * Calendar Export Service - Handle calendar exports to PDF, iCal, CSV
 */

import { CalendarEvent, ExportFormat } from '../types/calendar.types';
import { Booking, BookingStatus } from '../types/booking.types';
import { jsPDF } from 'jspdf';
import { formatDateToString } from './calendar.utils';

/**
 * Generate iCal format (.ics)
 */
export const generateICal = (events: CalendarEvent[]): string => {
  const now = new Date().toISOString().replace(/[-:Z]/g, '').slice(0, -4);
  
  let icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Swett Booking System//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Swett Tours Calendar
X-WR-TIMEZONE:UTC
X-WR-CALDESC:Tours and Bookings Calendar
`;

  for (const event of events) {
    const startDate = event.startDate.toISOString().replace(/[-:.Z]/g, '').slice(0, -4);
    const endDate = event.endDate.toISOString().replace(/[-:.Z]/g, '').slice(0, -4);
    const summary = event.title;
    const description = `Booking: ${event.booking.id}\nCustomer: ${event.booking.customerName}\nStatus: ${event.booking.status}\nParticipants: ${event.booking.participants}`;
    
    icalContent += `BEGIN:VEVENT
UID:${event.id}@swett-booking.com
DTSTAMP:${now}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${summary}
DESCRIPTION:${description}
STATUS:${getICalStatus(event.booking.status)}
END:VEVENT
`;
  }

  icalContent += 'END:VCALENDAR';
  return icalContent;
};

/**
 * Generate CSV format
 */
export const generateCSV = (events: CalendarEvent[]): string => {
  const headers = [
    'Booking ID',
    'Tour Title',
    'Customer Name',
    'Start Date',
    'End Date',
    'Participants',
    'Status',
    'Payment Status',
    'Total Amount',
    'Paid Amount'
  ];

  const rows = events.map(event => [
    event.booking.id,
    event.booking.tourTitle,
    event.booking.customerName,
    formatDateToString(event.startDate),
    formatDateToString(event.endDate),
    event.booking.participants,
    event.booking.status,
    event.booking.paymentStatus,
    event.booking.totalAmount,
    event.booking.paidAmount
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
};

/**
 * Generate PDF with calendar events
 */
export const generatePDF = (events: CalendarEvent[], title: string = 'Booking Calendar'): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;

  // Title
  doc.setFontSize(18);
  doc.text(title, margin, margin + 10);

  // Export date
  doc.setFontSize(10);
  doc.text(`Exported: ${new Date().toLocaleDateString()}`, margin, margin + 20);

  // Table content
  const tableData = events.map((event, index) => [
    event.booking.id,
    event.booking.tourTitle,
    event.booking.customerName,
    formatDateToString(event.startDate),
    formatDateToString(event.endDate),
    event.booking.participants.toString(),
    event.booking.status,
  ]);

  // Create table using basic text layout
  let yPos = margin + 30;
  const colWidths = [20, 40, 30, 25, 25, 15, 25];
  const headers = ['Booking ID', 'Tour', 'Customer', 'Start Date', 'End Date', 'Pax', 'Status'];

  // Draw header
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  let xPos = margin;
  for (let i = 0; i < headers.length; i++) {
    doc.text(headers[i], xPos, yPos);
    xPos += colWidths[i];
  }

  // Draw rows
  doc.setFont('helvetica', 'normal');
  yPos += 7;
  tableData.forEach((row, index) => {
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = margin;
    }

    xPos = margin;
    row.forEach((cell, colIndex) => {
      const cellText = String(cell).substring(0, 10); // Truncate long content
      doc.text(cellText, xPos, yPos);
      xPos += colWidths[colIndex];
    });
    yPos += 7;
  });

  // Save PDF
  doc.save(`booking-calendar-${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Export calendar events
 */
export const exportCalendarEvents = (
  events: CalendarEvent[],
  format: ExportFormat,
  fileName?: string
): void => {
  const timestamp = new Date().toISOString().split('T')[0];
  const baseFileName = fileName || `booking-calendar-${timestamp}`;

  switch (format) {
    case ExportFormat.PDF:
      generatePDF(events);
      break;

    case ExportFormat.ICAL:
      const icalContent = generateICal(events);
      downloadFile(icalContent, `${baseFileName}.ics`, 'text/calendar');
      break;

    case ExportFormat.CSV:
      const csvContent = generateCSV(events);
      downloadFile(csvContent, `${baseFileName}.csv`, 'text/csv;charset=utf-8;');
      break;
  }
};

/**
 * Download file helper
 */
const downloadFile = (content: string, fileName: string, mimeType: string): void => {
  const element = document.createElement('a');
  const file = new Blob([content], { type: mimeType });
  element.href = URL.createObjectURL(file);
  element.download = fileName;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(element.href);
};

/**
 * Convert booking status to iCal status
 */
const getICalStatus = (status: BookingStatus): string => {
  switch (status) {
    case BookingStatus.CONFIRMED:
      return 'CONFIRMED';
    case BookingStatus.CANCELLED:
      return 'CANCELLED';
    case BookingStatus.PENDING:
      return 'TENTATIVE';
    case BookingStatus.COMPLETED:
      return 'CONFIRMED';
    default:
      return 'TENTATIVE';
  }
};
