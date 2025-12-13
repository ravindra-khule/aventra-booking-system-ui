# Email Settings Module - Component Reference Guide

## 📊 Component Hierarchy

```
EmailSettings.tsx (Main Page)
│
├── Tab Navigation
│   ├── Configuration Tab
│   ├── Templates Tab
│   ├── Limits & Rules Tab
│   └── Logs Tab
│
├── Configuration Tab Content
│   ├── EmailProviderSettings
│   │   └── Provider dropdown
│   │
│   ├── SMTPConfiguration (if provider === 'SMTP')
│   │   ├── Host field
│   │   ├── Port field
│   │   ├── Encryption dropdown
│   │   ├── Auth toggle
│   │   └── Username/Password (conditional)
│   │
│   ├── SendGridConfiguration (if provider === 'SendGrid')
│   │   ├── API Key input
│   │   ├── Sandbox toggle
│   │   └── Validate button
│   │
│   ├── SenderDetailsComponent
│   │   ├── From Name field
│   │   ├── From Email field
│   │   └── Reply-To Email field
│   │
│   ├── EmailSignatureComponent
│   │   ├── Enable toggle
│   │   ├── Variable buttons
│   │   ├── Textarea
│   │   └── Preview section
│   │
│   └── TestEmail
│       ├── Email input
│       ├── Send button
│       └── Notifications
│
├── Templates Tab Content
│   └── DefaultTemplates
│       ├── Template list
│       ├── Edit/Delete buttons
│       ├── Add button
│       └── EditTemplateModal (when opened)
│           ├── Name field
│           ├── Subject field
│           ├── Variable buttons
│           ├── Body textarea
│           ├── Preview section
│           └── Save/Cancel buttons
│
├── Limits & Rules Tab Content
│   ├── SendingLimitsComponent
│   │   ├── Max per hour field
│   │   ├── Max per day field
│   │   ├── Throttling toggle
│   │   └── Status display
│   │
│   └── BounceUnsubscribeComponent
│       ├── Bounce Method dropdown
│       ├── Method info cards
│       ├── Notify toggle
│       ├── Unsubscribe toggle
│       ├── Custom URL field
│       └── Compliance info
│
└── Logs Tab Content
    └── EmailLogsComponent
        ├── Search input
        ├── Status filter dropdown
        ├── Statistics cards
        ├── Email logs table
        │   ├── Email column
        │   ├── Subject column
        │   ├── Status column (badge)
        │   ├── Provider column
        │   ├── Time column
        │   └── View button
        ├── Pagination
        └── EmailLogModal (when opened)
            ├── Status badge
            ├── Error message
            ├── Email display
            ├── Subject display
            ├── Provider/Time display
            ├── Additional info
            └── Action buttons
```

---

## 🎨 Component Props Reference

### EmailSettings (Main Page)
**Props:** None (standalone)
**State:**
- `activeTab: TabType` - Current active tab
- `isSaved: boolean` - Save notification state
- `selectedProvider: EmailProvider` - SMTP or SendGrid
- `smtpConfig: SMTPConfig` - SMTP settings
- `sendGridConfig: SendGridConfig` - SendGrid settings
- `senderDetails: SenderDetails` - Sender info
- `emailSignature: EmailSignature` - Signature settings
- `templates: EmailTemplate[]` - Email templates
- `sendingLimits: SendingLimits` - Limit settings
- `bounceUnsubscribe: BounceUnsubscribeSettings` - Bounce/unsub settings
- `logs: EmailLog[]` - Email activity logs

---

### EmailProviderSettings
```tsx
interface Props {
  selectedProvider: EmailProvider;
  onProviderChange: (provider: EmailProvider) => void;
}
```
**Renders:** Provider selection dropdown with info card

---

### SMTPConfiguration
```tsx
interface Props {
  config: SMTPConfig;
  onChange: (config: SMTPConfig) => void;
}
```
**State:**
- `showPassword: boolean` - Toggle password visibility
**Renders:** SMTP form with all fields

---

### SendGridConfiguration
```tsx
interface Props {
  config: SendGridConfig;
  onChange: (config: SendGridConfig) => void;
  onValidateApiKey?: () => void;
}
```
**State:**
- `showApiKey: boolean` - Toggle API key visibility
- `isValidating: boolean` - Validation loading state
- `validationStatus: 'idle' | 'success' | 'error'` - Validation result
**Renders:** SendGrid form with validation

---

### SenderDetailsComponent
```tsx
interface Props {
  details: SenderDetails;
  onChange: (details: SenderDetails) => void;
}
```
**Renders:** Sender info form with email validation and preview

---

### EmailSignatureComponent
```tsx
interface Props {
  signature: EmailSignature;
  onChange: (signature: EmailSignature) => void;
}
```
**State:**
- `characterCount: number` - Signature length
**Renders:** Signature editor with variables and preview

---

### DefaultTemplates
```tsx
interface Props {
  templates: EmailTemplate[];
  onEditTemplate: (template: EmailTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
}
```
**State:**
- `selectedTemplate: EmailTemplate | null` - Currently editing template
- `isModalOpen: boolean` - Modal visibility
**Renders:** Template list with edit/delete buttons + modal

---

### EditTemplateModal
```tsx
interface Props {
  isOpen: boolean;
  template: EmailTemplate;
  onClose: () => void;
  onSave: (template: EmailTemplate) => void;
}
```
**State:**
- `formData: EmailTemplate` - Form state
- `charCount: number` - Body character count
**Renders:** Template editor modal

---

### SendingLimitsComponent
```tsx
interface Props {
  limits: SendingLimits;
  onChange: (limits: SendingLimits) => void;
}
```
**Renders:** Sending limits form with status display

---

### BounceUnsubscribeComponent
```tsx
interface Props {
  settings: BounceUnsubscribeSettings;
  onChange: (settings: BounceUnsubscribeSettings) => void;
}
```
**Renders:** Bounce and unsubscribe settings with compliance info

---

### EmailLogsComponent
```tsx
interface Props {
  logs: EmailLog[];
}
```
**State:**
- `selectedLog: EmailLog | null` - Currently viewing log
- `isModalOpen: boolean` - Modal visibility
- `filterStatus: string` - Status filter selection
- `searchTerm: string` - Search text
- `currentPage: number` - Current page
**Renders:** Email logs table with filtering and pagination

---

### EmailLogModal
```tsx
interface Props {
  isOpen: boolean;
  log: EmailLog;
  onClose: () => void;
}
```
**Renders:** Log details modal

---

### TestEmail
```tsx
interface Props {
  None (functional component)
}
```
**State:**
- `testEmail: string` - Input email
- `isSending: boolean` - Sending state
- `sendStatus: 'idle' | 'success' | 'error'` - Result status
- `errorMessage: string` - Error text
**Renders:** Test email form with send functionality

---

## 🎯 Type Definitions Reference

### EmailProvider
```tsx
type EmailProvider = 'SMTP' | 'SendGrid';
```

### EncryptionType
```tsx
type EncryptionType = 'None' | 'SSL' | 'TLS';
```

### BounceHandlingMethod
```tsx
type BounceHandlingMethod = 'automatic' | 'manual' | 'webhook';
```

### EmailLogStatus
```tsx
type EmailLogStatus = 'sent' | 'failed' | 'bounced' | 'unsubscribed' | 'pending';
```

### SMTPConfig
```tsx
interface SMTPConfig {
  host: string;
  port: number;
  encryption: EncryptionType;
  useAuthentication: boolean;
  username: string;
  password: string;
}
```

### SendGridConfig
```tsx
interface SendGridConfig {
  apiKey: string;
  sandboxMode: boolean;
}
```

### SenderDetails
```tsx
interface SenderDetails {
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
}
```

### EmailSignature
```tsx
interface EmailSignature {
  enabled: boolean;
  content: string;
}
```

### EmailTemplate
```tsx
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}
```

### SendingLimits
```tsx
interface SendingLimits {
  maxPerHour: number;
  maxPerDay: number;
  throttlingEnabled: boolean;
}
```

### BounceUnsubscribeSettings
```tsx
interface BounceUnsubscribeSettings {
  bounceHandling: {
    method: BounceHandlingMethod;
    notifyOnBounce: boolean;
  };
  unsubscribe: {
    enabled: boolean;
    customUrl: string;
  };
}
```

### EmailLog
```tsx
interface EmailLog {
  id: string;
  email: string;
  subject: string;
  status: EmailLogStatus;
  sentTime: string;
  provider: EmailProvider;
  errorMessage?: string;
}
```

---

## 🎨 Color Reference

### Status Colors
| Status | Background | Text | Icon |
|--------|-----------|------|------|
| Sent | `bg-green-50` | `text-green-800` | ✓ |
| Pending | `bg-yellow-50` | `text-yellow-800` | ⏳ |
| Failed | `bg-red-50` | `text-red-800` | ✗ |
| Bounced | `bg-orange-50` | `text-orange-800` | ⚠ |
| Unsubscribed | `bg-gray-50` | `text-gray-800` | 🚫 |

### Semantic Colors
| Purpose | Tailwind | Hex |
|---------|----------|-----|
| Primary | `bg-blue-600` | #2563eb |
| Primary Hover | `bg-blue-700` | #1d4ed8 |
| Success | `bg-green-600` | #16a34a |
| Error | `bg-red-600` | #dc2626 |
| Warning | `bg-yellow-600` | #ca8a04 |
| Disabled | `bg-gray-400` | #9ca3af |
| Background | `bg-gray-100` | #f3f4f6 |
| Border | `border-gray-300` | #d1d5db |

---

## 📐 Spacing Reference

### Standard Spacing
- Card padding: `p-6` (24px)
- Section gap: `space-y-6` (24px)
- Form field gap: `space-y-4` (16px)
- Small gap: `gap-2` (8px)
- Medium gap: `gap-3` (12px)
- Large gap: `gap-4` (16px)

### Container
- Max width: `max-w-6xl` (64rem)
- Horizontal padding: `px-4 sm:px-6 lg:px-8`
- Vertical padding: `py-8`

---

## 🔄 Common Patterns

### Form Field Pattern
```tsx
<div>
  <label htmlFor="field-id" className="block text-sm font-medium text-gray-700 mb-2">
    Field Label *
  </label>
  <input
    id="field-id"
    type="text"
    value={value}
    onChange={(e) => handleChange('field', e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />
  <p className="mt-1 text-sm text-gray-500">Helper text</p>
</div>
```

### Info Card Pattern
```tsx
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
  <p className="text-sm text-blue-800">
    <span className="font-semibold">Label:</span> Content here
  </p>
</div>
```

### Toggle Pattern
```tsx
<label className="flex items-center space-x-3">
  <input
    type="checkbox"
    checked={value}
    onChange={(e) => handleChange('field', e.target.checked)}
    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
  />
  <span className="text-sm font-medium text-gray-700">Toggle Label</span>
</label>
```

### Button Pattern
```tsx
<button
  onClick={handleClick}
  disabled={isLoading}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
>
  {isLoading ? 'Loading...' : 'Button Text'}
</button>
```

### Status Badge Pattern
```tsx
<span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
  {getStatusIcon(status)} {capitalize(status)}
</span>
```

---

## 🧪 Testing Tips

### To Test SMTP Configuration:
1. Fill in the form with real SMTP details
2. Toggle authentication on/off
3. Toggle password visibility
4. Verify validation works

### To Test SendGrid Configuration:
1. Enter test API key
2. Click "Validate API Key" button
3. See success/error feedback
4. Toggle sandbox mode

### To Test Email Signature:
1. Enable signature
2. Click variable buttons
3. See variables insert
4. Check character count
5. Review preview

### To Test Templates:
1. View sample templates
2. Click edit button
3. Modify template
4. Check preview
5. Click save/cancel

### To Test Email Logs:
1. View sample logs
2. Filter by status
3. Search by email
4. Paginate through results
5. Click view details
6. See modal information

### To Test Test Email:
1. Enter valid email
2. Click send button
3. See loading state
4. Get success/error
5. Reset form on success

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Full-width inputs and buttons
- Stacked form groups
- Horizontal scroll for tables
- Simplified table view (hide non-essential columns)

### Tablet (768px - 1024px)
- 2-column grid for stats
- Standard form layout
- Table visible with scroll
- Side-by-side form fields

### Desktop (> 1024px)
- Multi-column layouts
- Full table display
- Grid-based arrangement
- Max-width containers

---

## 🔗 Integration Checklist

- [ ] Verify all imports resolve correctly
- [ ] Check Tailwind CSS is configured
- [ ] Test in development environment
- [ ] Check responsive design on mobile
- [ ] Verify all form validations work
- [ ] Test modal open/close functionality
- [ ] Test tab switching
- [ ] Test pagination
- [ ] Test filtering and search
- [ ] Add backend API integration (when ready)

---

## 🎓 Learning Resources

For customizing and extending:
1. React documentation: https://react.dev
2. TypeScript handbook: https://www.typescriptlang.org/docs/
3. Tailwind CSS docs: https://tailwindcss.com/docs
4. Form patterns: See patterns section above
5. Component examples: Check existing components

---

This guide provides complete reference for all components, types, and patterns used in the Email Settings module.
