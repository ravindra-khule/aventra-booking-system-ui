# Email Settings Module - Documentation

## Overview

This is a production-quality, frontend-only Email Settings module for the Aventra Booking System. It provides a complete UI for managing email delivery, templates, providers, and delivery logs with modern React components and Tailwind CSS styling.

## Features

### ✅ 1. Email Provider Configuration
- **Dropdown selection** between SMTP and SendGrid
- **Conditional rendering** based on provider choice
- Clear descriptions for each provider

### ✅ 2. SMTP Configuration
- SMTP Host input with examples
- Port configuration (1-65535)
- Encryption type: None, SSL, or TLS
- Authentication toggle
- Username and password fields (password masked)
- Security tips and best practices

### ✅ 3. SendGrid Configuration
- API Key input (password masked)
- Sandbox Mode toggle for testing
- Validate API Key button with real-time feedback
- Provider information and tips

### ✅ 4. Sender Details
- From Name
- From Email (with validation)
- Reply-To Email (with validation)
- Live preview of sender format

### ✅ 5. Email Signature
- Enable/Disable toggle
- Rich text editor with variable buttons
- Template variables: {{COMPANY_NAME}}, {{COMPANY_ADDRESS}}, {{COMPANY_PHONE}}, {{COMPANY_WEBSITE}}, {{CURRENT_YEAR}}
- Character counter
- Live preview
- Warning for long signatures

### ✅ 6. Default Templates
- List of email templates with names and subjects
- Last updated dates
- Edit button → opens modal
- Delete button with confirmation
- Template modal includes:
  - Template name
  - Subject line
  - Rich text body with variable buttons
  - Variable options: {{CUSTOMER_NAME}}, {{BOOKING_ID}}, {{BOOKING_DATE}}, {{TOUR_NAME}}, {{TOTAL_AMOUNT}}
  - Character count
  - Email preview
  - Save functionality

### ✅ 7. Sending Limits & Throttling
- Max emails per hour (0 = unlimited)
- Max emails per day (0 = unlimited)
- Throttling toggle
- Current status display
- Recommendations for optimal delivery

### ✅ 8. Bounce & Unsubscribe Management
- **Bounce Handling:**
  - Three methods: Automatic, Webhook, Manual
  - Method-specific information cards
  - Notify on bounce toggle
- **Unsubscribe:**
  - Enable/Disable toggle
  - Custom unsubscribe page URL
  - Unsubscribe header information
- **Compliance:**
  - CAN-SPAM requirements
  - GDPR compliance info
  - DKIM/SPF guidelines

### ✅ 9. Email Logs & Activity
- Table with columns:
  - Email address
  - Subject
  - Status (sent, pending, failed, bounced, unsubscribed)
  - Provider (SMTP or SendGrid)
  - Sent time
  - View action
- Status filtering dropdown
- Email/subject search
- Statistics cards (sent, pending, failed, bounced, unsubscribed counts)
- Pagination
- View details modal with:
  - Status badge
  - Error messages (if any)
  - Recipient email
  - Subject
  - Provider and sent time
  - Log ID and timestamp
  - Resend and export buttons

### ✅ 10. Test Email
- Email input field with validation
- Send Test Email button with loading state
- Success notification
- Error handling with messages
- Enter key support
- Information about what gets tested

## File Structure

```
pages/admin/settings/
├── EmailSettings.tsx                 # Main page component
├── types/
│   └── emailSettings.ts             # TypeScript types and interfaces
└── components/
    ├── index.ts                      # Barrel export
    ├── EmailProviderSettings.tsx      # Provider selection
    ├── SMTPConfiguration.tsx          # SMTP settings
    ├── SendGridConfiguration.tsx      # SendGrid settings
    ├── SenderDetails.tsx              # Sender details
    ├── EmailSignature.tsx             # Signature editor
    ├── DefaultTemplates.tsx           # Template list
    ├── EditTemplateModal.tsx          # Template editor modal
    ├── SendingLimits.tsx              # Limits & throttling
    ├── BounceUnsubscribe.tsx          # Bounce & unsubscribe settings
    ├── EmailLogs.tsx                  # Activity logs table
    ├── EmailLogModal.tsx              # Log details modal
    └── TestEmail.tsx                  # Test email form
```

## Component Usage

### Basic Setup

```tsx
import EmailSettings from '@/pages/admin/settings/EmailSettings';

// Use in your admin dashboard
<EmailSettings />
```

### Individual Components

```tsx
import {
  SMTPConfiguration,
  SendGridConfiguration,
  EmailLogsComponent,
  DefaultTemplates,
} from '@/pages/admin/settings/components';
import { SMTPConfig } from '@/pages/admin/settings/types/emailSettings';

// SMTP Configuration
const [smtpConfig, setSmtpConfig] = useState<SMTPConfig>({...});
<SMTPConfiguration config={smtpConfig} onChange={setSmtpConfig} />

// Email Logs
<EmailLogsComponent logs={emailLogs} />
```

## TypeScript Interfaces

All interfaces are defined in `types/emailSettings.ts`:

```tsx
type EmailProvider = 'SMTP' | 'SendGrid';
type EncryptionType = 'None' | 'SSL' | 'TLS';
type BounceHandlingMethod = 'automatic' | 'manual' | 'webhook';
type EmailLogStatus = 'sent' | 'failed' | 'bounced' | 'unsubscribed' | 'pending';

interface SMTPConfig {
  host: string;
  port: number;
  encryption: EncryptionType;
  useAuthentication: boolean;
  username: string;
  password: string;
}

interface SendGridConfig {
  apiKey: string;
  sandboxMode: boolean;
}

interface SenderDetails {
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

// ... and more
```

## Styling

### Tailwind CSS Classes Used

- **Layout:** `max-w-6xl`, `grid`, `space-y-6`, `flex`, `gap-2`
- **Cards:** `bg-white`, `rounded-lg`, `shadow`, `p-6`, `border`
- **Colors:** 
  - Primary: `blue-600`, `blue-700`, `blue-50`
  - Success: `green-50`, `green-200`, `green-800`
  - Error: `red-50`, `red-200`, `red-800`
  - Warning: `yellow-50`, `yellow-200`, `yellow-800`
- **Forms:** `border-gray-300`, `focus:ring-2`, `focus:ring-blue-500`, `rounded-lg`
- **Status Badges:** Color-coded status indicators
- **Responsive:** `sm:px-6`, `lg:px-8`, `grid-cols-1 md:grid-cols-2`

## Features

### Form Validation
- Email validation (pattern matching)
- Port number validation (1-65535)
- Required field indicators
- Real-time error messages
- Validation feedback on SendGrid API key

### User Experience
- Smooth transitions and hover states
- Loading states for async operations
- Confirmation dialogs for destructive actions
- Success/error notifications
- Tab navigation for content organization
- Pagination for large datasets
- Search and filter functionality
- Copy-friendly input highlighting

### Accessibility
- Semantic HTML
- ARIA labels on interactive elements
- Color not the only indicator (icons + text for status)
- Keyboard navigation support (Enter key for sending test email)
- Clear focus states
- Label associations with form inputs

## Integration Notes

### Backend Integration (When Ready)

To integrate with a backend API:

1. **Replace mock data** in components with API calls
2. **Add loading/error states** in parent component
3. **Implement save functionality** in `EmailSettings.tsx`
4. **Add API endpoints for:**
   - Save provider configuration
   - Validate API keys
   - Send test email
   - Manage templates (CRUD)
   - Fetch email logs
   - Update limits and rules

Example:
```tsx
const handleSave = async () => {
  try {
    await api.emailSettings.save({
      provider: selectedProvider,
      smtpConfig,
      sendGridConfig,
      senderDetails,
      // ...
    });
    setIsSaved(true);
  } catch (error) {
    showError('Failed to save settings');
  }
};
```

### State Management (Optional Redux/Zustand)

For larger applications, consider moving state to a store:

```tsx
// Example with Zustand
const useEmailStore = create((set) => ({
  selectedProvider: 'SMTP',
  smtpConfig: {...},
  setSmtpConfig: (config) => set({ smtpConfig: config }),
  // ...
}));
```

## Customization

### Colors & Branding
Edit Tailwind classes in components to match your brand:
```tsx
// Change primary color from blue to your brand color
className="bg-blue-600" // Change to your color
```

### Form Fields
Add or remove fields in respective components easily:
```tsx
// In SMTPConfiguration.tsx
<input
  // Add new field here
/>
```

### Templates Variables
Modify available variables in `EditTemplateModal.tsx`:
```tsx
<button onClick={() => handleChange('body', formData.body + '{{YOUR_VARIABLE}}')}>
  {{'{YOUR_VARIABLE}'}}
</button>
```

## Performance Considerations

- Components use React.memo for optimization (can be added if needed)
- Pagination in logs prevents rendering too many rows
- Modals are conditionally rendered only when needed
- No unnecessary re-renders with proper state management

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (12+)
- Mobile browsers: ✅ Responsive design

## Future Enhancements

Potential additions:
- [ ] Email template preview with real data
- [ ] Drag & drop template reordering
- [ ] Email log export to CSV/PDF
- [ ] Scheduled email tests
- [ ] Provider health status
- [ ] IP whitelist management
- [ ] Rate limit monitoring
- [ ] Webhook configuration UI
- [ ] Email domain verification
- [ ] A/B testing templates

## License

Part of Aventra Booking System - All rights reserved.
