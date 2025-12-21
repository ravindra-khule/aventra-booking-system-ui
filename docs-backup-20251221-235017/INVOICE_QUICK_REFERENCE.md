# Invoice Management - Quick Reference Guide

## 🚀 Quick Start

### Access the Page
Navigate to: **http://localhost:3000/#/admin/finance/invoices**

## 📋 Main Features

### 1. Dashboard Overview
At the top of the page, you'll see:
- **Invoice Status Cards**: Draft, Sent, Paid, Overdue (click to filter)
- **Revenue Cards**: Total, Paid, Outstanding, Overdue amounts
- **Metrics**: Average invoice value, Average payment time
- **Collection Progress Bar**: Visual representation of payment collection

### 2. Invoice List
Below the dashboard:
- **Search**: Search by invoice number, customer name, or email
- **Filters**: Filter by status (Draft, Sent, Paid, Overdue, etc.)
- **Bulk Actions**: Select multiple invoices to send or export
- **Individual Actions**: View, Edit, Send, Download, Delete (per invoice)

### 3. Create Invoice
Click "Create Invoice" button to:
1. Enter recipient details (name, email, address, etc.)
2. Add line items (description, quantity, unit price, tax rate)
3. Apply discounts if needed
4. Set due date (default: 30 days)
5. Add notes (customer-visible and internal)
6. Save as draft

### 4. View/Preview Invoice
Click on any invoice to:
- See professional invoice layout
- Send via email
- Download as PDF
- Print invoice
- Record payment
- Send payment reminder (for overdue invoices)

## 🎯 Common Workflows

### Creating a New Invoice
```
1. Click "Create Invoice"
2. Fill recipient: Name, Email, Address
3. Add line items:
   - Description: "Island Adventure Tour"
   - Quantity: 2
   - Unit Price: 12000
   - Tax Rate: 12%
4. Set due date (e.g., 30 days from now)
5. Click "Create" → Invoice saved as DRAFT
```

### Sending an Invoice
```
1. Find invoice in list or create new
2. Click "View" or select invoice
3. Review invoice preview
4. Click "Send" button
5. Status changes to SENT
6. Email sent to customer
```

### Recording a Payment
```
1. Select SENT or OVERDUE invoice
2. Click "Record Payment" button
3. Fill payment details:
   - Payment Method: Bank Transfer
   - Amount: (auto-filled with outstanding)
   - Date: Today's date
   - Transaction ID: (optional)
4. Click "Record Payment"
5. Status changes to PAID
```

### Handling Overdue Invoices
```
1. Filter by OVERDUE status
2. Select invoice
3. Click "Send Reminder"
4. Reminder count increments
5. Email sent to customer
```

## 💡 Tips & Tricks

### Keyboard Shortcuts (Future)
- `Ctrl/Cmd + N`: Create new invoice
- `Ctrl/Cmd + F`: Focus search
- `Ctrl/Cmd + P`: Print preview
- `Esc`: Close modals

### Best Practices
1. **Always review** invoice preview before sending
2. **Use internal notes** for team communication
3. **Set reminders** for overdue invoices early
4. **Record payments promptly** to keep accurate records
5. **Use discounts** with clear reasons for audit trail

### Tax Rates (Swedish VAT)
- **0%**: Exported services, international sales
- **6%**: Books, newspapers, magazines, transportation
- **12%**: Tourism, hotels, restaurants (most tours)
- **25%**: Standard rate for most goods and services

## 📊 Test Data Available

### Invoice #1 - INV-2025-001
- **Customer**: Erik Andersson
- **Status**: PAID ✅
- **Amount**: 26,880 SEK
- **Line**: Island Adventure Tour - 2 persons

### Invoice #2 - INV-2025-002
- **Customer**: Anna Svensson
- **Status**: SENT 📤
- **Amount**: 10,145 SEK
- **Lines**: Mountain Hiking Tour + Equipment

### Invoice #3 - INV-2025-003
- **Customer**: Lars Johansson
- **Status**: OVERDUE ⚠️
- **Amount**: 25,200 SEK
- **Reminders**: 2 sent

### Invoice #4 - INV-2025-004
- **Customer**: Maria Karlsson
- **Status**: DRAFT 📝
- **Amount**: 67,200 SEK
- **Line**: Winter Wonderland Tour - 4 persons

## 🔍 Filtering Examples

### Find All Overdue Invoices
1. Click "Filters" button
2. Check "OVERDUE" status
3. View filtered list

### Find Unpaid Invoices
1. Click "Filters"
2. Check "SENT" and "OVERDUE"
3. See all unpaid invoices

### Search for Customer
1. Type customer name in search box
2. Results update in real-time
3. Click to view invoice

## 🎨 Status Colors

- **Gray** 📝 - DRAFT (editable)
- **Blue** 📤 - SENT (awaiting payment)
- **Green** ✅ - PAID (completed)
- **Red** ⚠️ - OVERDUE (needs attention)
- **Gray** ❌ - CANCELLED (inactive)
- **Orange** 🔄 - REFUNDED (money returned)

## 🚨 Important Notes

### What You CAN Do
- ✅ Create unlimited invoices
- ✅ Edit DRAFT invoices
- ✅ Delete DRAFT invoices only
- ✅ Send invoices multiple times
- ✅ Record partial payments
- ✅ Send unlimited reminders
- ✅ View invoice history

### What You CANNOT Do
- ❌ Edit PAID or SENT invoices (must be draft)
- ❌ Delete paid invoices
- ❌ Change invoice numbers
- ❌ Remove line items after sending

### Data Persistence
⚠️ **Current Setup**: Mock data (in-memory)
- Data resets on page refresh
- For testing purposes only
- Backend integration needed for production

## 🔧 Troubleshooting

### Invoice Not Showing
- Check status filters are not too restrictive
- Try clearing all filters
- Click "Refresh" button

### Cannot Edit Invoice
- Only DRAFT invoices can be edited
- Create a credit note for paid invoices

### Payment Not Recording
- Check amount is not greater than outstanding
- Verify payment date is valid
- Ensure invoice is not already paid

## 📞 Need Help?

### Common Questions
**Q: How do I change an invoice after sending?**
A: You cannot edit sent invoices. Create a credit note or cancel and create new.

**Q: Can I send an invoice without email?**
A: Currently, email is required. Manual delivery coming soon.

**Q: How do I export multiple invoices?**
A: Select invoices using checkboxes, then click "Export" button.

**Q: What happens to overdue invoices?**
A: Automatically marked as OVERDUE after due date passes. Send reminders manually.

## 🎉 You're Ready!

The invoice management system is fully functional. Start by:
1. Exploring the test data
2. Creating a test invoice
3. Going through the complete workflow
4. Familiarizing yourself with all features

**Happy Invoicing! 💰**
