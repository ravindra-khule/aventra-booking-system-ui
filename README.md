# Aventra Booking System UI

A comprehensive booking management system for tour operators, built with React, TypeScript, and modern web technologies.

## 🚀 Quick Start

**Prerequisites:** Node.js 16+ and npm

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env.local` (if applicable)
   - Set required environment variables

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Local: `http://localhost:3000` (or your configured port)

## 📋 Project Overview

This is a full-featured booking management system with:

### Core Features
- **Tour Management** - Create, edit, and manage tour packages
- **Booking System** - Comprehensive booking flow with calendar integration
- **Customer Management** - Customer groups, communications, and tracking
- **Invoice Management** - Generate and manage invoices
- **User Management** - Role-based access control (Admin, Manager, Support)
- **Email Templates** - Customizable email communications
- **Marketing Analytics** - Campaign tracking and analytics
- **Financial Reports** - Revenue and booking reports
- **Itinerary Builder** - Create detailed tour itineraries

### Tech Stack
- **Frontend:** React + TypeScript
- **Styling:** Tailwind CSS / Custom CSS
- **State Management:** React Context / Hooks
- **UI Components:** Custom component library
- **Build Tool:** Vite / Webpack (check package.json)

## 🏗️ Project Structure

```
aventra-booking-system-ui/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   │   ├── admin/       # Admin dashboard pages
│   │   └── ...          # Other pages
│   ├── shared/          # Shared utilities and types
│   │   └── types/       # TypeScript type definitions
│   └── ...
├── public/              # Static assets
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🛠️ Development

### Available Scripts

Check `package.json` for all available scripts. Common ones:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests (if configured)
- `npm run lint` - Lint code

### Code Style

- TypeScript for type safety
- Follow existing component patterns
- Use shared types from `src/shared/types/`

## 📦 Building for Production

```bash
npm run build
```

The build output will be in the `dist` or `build` folder.

## 🔑 Key Modules

### Admin Settings
Located in `pages/admin/settings/`:
- Company Information
- Email Settings
- User Management

### Booking Flow
- Calendar-based booking selection
- Customer information collection
- Payment and confirmation

### Customer Communications
- Email template management
- Automated notifications
- Custom messaging

## 📚 Additional Documentation

- **Architecture Plan:** See `ARCHITECTURE_PLAN.md` for system design details
- **Backup Documentation:** Previous documentation moved to `docs-backup-*` directory

## 🤝 Contributing

1. Follow existing code patterns
2. Use TypeScript types
3. Test changes thoroughly
4. Keep components modular and reusable

## 📄 License

[Add your license information here]

## 📞 Support

[Add contact/support information here]
