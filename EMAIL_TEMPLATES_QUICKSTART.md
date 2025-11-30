# Email Templates - Quick Start Guide

## 🚀 Getting Started

### Accessing the Feature
1. Open your browser to: `http://localhost:3000`
2. Navigate to: **Admin** → **Marketing** → **Email Templates**
3. Direct URL: `http://localhost:3000/#/admin/marketing/email-templates`

---

## 📋 Main Interface Overview

### Template List View
When you first open the page, you'll see:

```
┌─────────────────────────────────────────────────────────┐
│  Email Templates                    [+ Create Template]  │
│  Manage your email templates...                         │
├─────────────────────────────────────────────────────────┤
│  [🔍 Search] [Category ▼] [Status ▼] [Language ▼]      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ Booking     │  │ Payment     │  │ Tour        │    │
│  │ Confirmation│  │ Receipt     │  │ Reminder    │    │
│  │ 🇬🇧 🇸🇪      │  │ 🇬🇧 🇸🇪      │  │ 🇬🇧 🇸🇪      │    │
│  │ [Preview]   │  │ [Preview]   │  │ [Preview]   │    │
│  │ [Test]      │  │ [Test]      │  │ [Test]      │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Common Tasks

### 1️⃣ Viewing Templates
**Pre-designed templates are loaded automatically!**

You'll see 3 templates ready to use:
- ✉️ **Booking Confirmation** (BOOKING category)
- 💳 **Payment Receipt** (PAYMENT category)  
- ⏰ **Tour Reminder** (REMINDER category)

Each template:
- Has both English 🇬🇧 and Swedish 🇸🇪 versions
- Is marked as ACTIVE status
- Shows usage count (initially 0)
- Is tagged as "automated"

---

### 2️⃣ Previewing a Template

**Steps:**
1. Click **[Preview]** button on any template card
2. A modal opens showing the email preview
3. Use the controls at the top:
   - 🌐 **Language selector**: Switch between EN/SV
   - 💻 **Desktop icon**: Full-width preview
   - 📱 **Mobile icon**: Mobile-width preview
   - 🔄 **Refresh**: Reload preview
4. View the rendered email with sample data
5. Click ❌ to close

**What you'll see:**
```
Subject: Booking Confirmed - Arctic Aurora Adventure

Hi John,

Great news! Your booking has been confirmed...

┌─────────────────────────────────┐
│ Booking Details                 │
│ Booking ID: BK-2025-001        │
│ Tour: Arctic Aurora Adventure   │
│ Date: 2025-12-15               │
│ Total: 15,000 SEK              │
└─────────────────────────────────┘
```

---

### 3️⃣ Sending a Test Email

**Steps:**
1. Click **[Test]** button on any template
2. Select language (🇬🇧 EN or 🇸🇪 SV)
3. Enter your email address
4. Click **[Send Test Email]**
5. Check your inbox!

**Test email includes:**
- ✅ Real email formatting
- ✅ All placeholders replaced with sample data
- ✅ Professional HTML styling
- ✅ Mobile-responsive design

---

### 4️⃣ Creating a New Template

**Steps:**
1. Click **[+ Create Template]** button (top right)
2. Fill in the form:

```
Template Name: [My Custom Email]
Category: [Select one ▼]
Description: [Brief description]
Status: [DRAFT/ACTIVE ▼]
Tags: [tag1] [tag2] [+ Add]

[🇬🇧 English Tab] [🇸🇪 Swedish Tab]

Subject: [Email subject line]
Preheader: [Preview text (optional)]

┌────────────────────────────────┐
│ [B] [I] [U] [≡] [≣] [🔗] [📷]│  ← Formatting toolbar
│                                │
│ [📧 Insert Variable ▼]         │  ← Dynamic placeholders
│                                │
│ Type your email content...    │
│                                │
└────────────────────────────────┘
```

3. **Add Content for Each Language:**
   - Click **English** tab → Add English content
   - Click **Swedish** tab → Add Swedish content
   - You can have content in one or both languages

4. **Insert Placeholders:**
   - Click **[📧 Insert Variable]**
   - Select category: All, Customer, Booking, Tour, etc.
   - Click on a placeholder to insert it
   - Example: `{{customerFirstName}}` appears as a blue badge

5. Click **[Create Template]** to save

---

### 5️⃣ Editing an Existing Template

**Steps:**
1. Find your template in the list
2. Click the **⋮** (three dots) menu
3. Select **Edit**
4. Modify any fields or content
5. Click **[Update Template]**

**Important:** Editing creates a new version automatically!

---

### 6️⃣ Using Placeholders

**Available Placeholder Categories:**

**👤 Customer**
- `{{customerFirstName}}` → John
- `{{customerFullName}}` → John Doe
- `{{customerEmail}}` → john@example.com

**📅 Booking**
- `{{bookingId}}` → BK-2025-001
- `{{bookingTotal}}` → 15,000 SEK
- `{{tourDepartureDate}}` → 2025-12-15

**🎿 Tour**
- `{{tourName}}` → Arctic Aurora Adventure
- `{{tourDuration}}` → 5 days
- `{{tourDifficulty}}` → Moderate

**💰 Payment**
- `{{invoiceNumber}}` → INV-2025-001
- `{{paymentAmount}}` → 5,000 SEK
- `{{paymentMethod}}` → Credit Card

**🏢 Company**
- `{{companyName}}` → Aventra Tours
- `{{companyEmail}}` → info@aventra.com
- `{{companyPhone}}` → +46 8 123 4567

**⚙️ System**
- `{{currentYear}}` → 2025
- `{{unsubscribeLink}}` → Unsubscribe URL
- `{{viewOnlineLink}}` → View in browser

---

### 7️⃣ Filtering Templates

**Use the filter bar to find templates:**

```
[🔍 Search...] [Category ▼] [Status ▼] [Language ▼]
```

- **Search**: Type template name or description
- **Category**: Filter by BOOKING, PAYMENT, REMINDER, etc.
- **Status**: Show ACTIVE, DRAFT, or ARCHIVED
- **Language**: Show only templates with EN or SV

Active filters appear below:
```
🔍 Active filters: [Search: "booking"] [Category: BOOKING] [Clear all]
```

---

### 8️⃣ Managing Templates

**From the ⋮ (three dots) menu:**

- **✏️ Edit** → Modify template (creates new version)
- **📋 Duplicate** → Create a copy
- **📦 Archive** → Hide from active list
- **🗑️ Delete** → Permanently remove (with confirmation)

---

### 9️⃣ Version History

**To view template history:**
1. Click ⋮ menu on template
2. Select "History" (if added to menu)
3. View all versions with:
   - Version number
   - Change description
   - Author and date
   - Content preview
4. Click **[Restore]** on any old version to bring it back

---

## 🎨 Using the Rich Text Editor

### Toolbar Features

```
[B] [I] [U] - Text formatting
[▼ Size] - Font size: Small, Normal, Large, Huge
[≡] [≣] [≔] - Text alignment: Left, Center, Right
[•] [1.] - Bullet list, Numbered list
[🔗] [📷] - Insert link, Insert image
[📧 Insert Variable] - Add dynamic placeholders
```

### Adding Formatted Text

1. **Bold**: Select text, click [B]
2. **Lists**: Click [•] and start typing
3. **Links**: Click [🔗], enter URL
4. **Placeholders**: Click [📧 Insert Variable], choose variable

---

## 📊 Template Metadata

Each template card shows:

```
┌──────────────────────────────┐
│ Booking Confirmation      ⋮ │
│ Confirmation email sent...  │
├──────────────────────────────┤
│ [BOOKING] [ACTIVE] [Default]│
│ Languages: 🇬🇧 EN  🇸🇪 SV    │
│ Version: 1    Sent: 0       │
├──────────────────────────────┤
│ [👁️ Preview] [📧 Test]      │
└──────────────────────────────┘
```

**Badges:**
- 🔵 **BOOKING** = Category
- 🟢 **ACTIVE** = Status
- 🔵 **Default** = System template
- **Version** = Current version number
- **Sent** = Number of times sent

---

## ✨ Tips & Best Practices

### 1. Start with Pre-designed Templates
- Use pre-designed templates as starting points
- Click **Duplicate** to create your own version
- Modify to match your needs

### 2. Test Before Activating
- Create templates in **DRAFT** status
- Send test emails to yourself
- Preview in both desktop and mobile views
- Switch to **ACTIVE** when ready

### 3. Use Placeholders Wisely
- Always include customer name for personalization
- Use booking/tour details for context
- Include company contact information
- Add unsubscribe link for marketing emails

### 4. Multi-language Content
- Provide both English and Swedish versions
- Keep formatting consistent between languages
- Test both language versions

### 5. Keep Templates Organized
- Use descriptive names
- Add relevant tags
- Choose correct category
- Write clear descriptions

### 6. Version Control
- Every edit creates a new version
- View history anytime
- Restore previous versions if needed
- Add change descriptions when editing

---

## 🐛 Troubleshooting

### Template Not Appearing?
- Check filter settings
- Make sure status is ACTIVE
- Clear search box

### Placeholder Not Working?
- Use exact format: `{{placeholderName}}`
- No spaces inside brackets
- Check spelling matches available placeholders

### Test Email Not Received?
- Check spam/junk folder
- Verify email address is correct
- Check browser console for errors
- Server logs will show sending status

### Can't Save Template?
- Check for validation errors (shown in red)
- At least one language needs subject and content
- Template name is required

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors (F12)
2. Verify server is running
3. Check EMAIL_TEMPLATES_COMPLETE.md for detailed docs
4. Review the error message displayed

---

## 🎉 You're Ready!

You now have a powerful email template system that:
- ✅ Manages automated emails
- ✅ Supports multiple languages
- ✅ Uses dynamic placeholders
- ✅ Provides rich text editing
- ✅ Tracks versions
- ✅ Allows testing before sending

**Start by exploring the 3 pre-designed templates!**

---

*Last Updated: November 30, 2025*
