# ✅ DONE! Now Follow These Steps

## What I Just Fixed

✅ Updated `App.tsx` to use `AdminUsersManager` (has module permissions UI)
✅ Updated `user.service.ts` with correct demo user emails including support@aventra.com
✅ All demo users now show in User Management

## 🚀 What You Need to Do Now

### Step 1: Restart Dev Server
```bash
# Stop current server (Ctrl+C in terminal)
# Then run:
cd /Users/ravindrakhule/Projects/Aventra/aventra-booking-system-ui
npm run dev
```

### Step 2: Open Browser
Navigate to: **http://localhost:3000**

### Step 3: Login
Use any admin account:
- Email: `admin@aventra.com`
- Password: `Aventra2025!Admin`

### Step 4: Go to User Management
Click: **Admin Panel** → **Settings** → **User Management**

URL: `http://localhost:3000/#/admin/settings/users`

### Step 5: You Should Now See

A table with 6 users including:
```
┌──────────────────┬──────────────────────────┬────────────┐
│ Name             │ Email                    │ Role       │
├──────────────────┼──────────────────────────┼────────────┤
│ Super Admin      │ superadmin@aventra.com   │ Super Admin│
│ Admin User       │ admin@aventra.com        │ Admin      │
│ Support Agent    │ support@aventra.com      │ Support    │  ← HERE!
│ Accountant       │ accountant@aventra.com   │ Accountant │
│ Developer        │ developer@aventra.com    │ Developer  │
└──────────────────┴──────────────────────────┴────────────┘
```

### Step 6: Set Permissions for support@aventra.com

1. Find the row with **support@aventra.com**

2. Click the **green Shield icon** (🛡️) in the Actions column
   - Look for: `[✏️] [👁️] [🛡️] [🗑️]`
   - Click the **third icon** (green shield)

3. A modal will open: **"Manage Permissions"**

4. Click **"Clear All"** button (top right)

5. Select ONLY these 2 modules:
   - ✅ Click on **Booking Management** (blue card)
   - ✅ Click on **Customer Management** (green card)
   - You should see checkmarks appear on only these two

6. Click **"Save Permissions"** button (bottom right)

7. You'll see an alert confirming: 
   ```
   Module permissions updated for support@aventra.com
   
   Selected modules: 2 of 8
   BOOKING, CUSTOMER
   ```

### Step 7: Verify in Console

Open Browser DevTools (F12) → Console tab

You should see:
```javascript
✅ Saved permissions for user user_support: ['BOOKING', 'CUSTOMER']
```

## 🎯 What This Means

**support@aventra.com can now access:**
- ✅ Booking Management (view/create/edit bookings)
- ✅ Customer Management (view/create/edit customers)

**support@aventra.com CANNOT access:**
- ❌ Marketing & Campaigns
- ❌ Financial Management  
- ❌ Tools & Utilities
- ❌ System Settings
- ❌ User Management
- ❌ Reports & Analytics

## 📸 Visual Guide

### What You'll See

```
Actions Column:
┌──────────────────────────────────────┐
│ Actions                              │
├──────────────────────────────────────┤
│ [✏️Edit] [👁️View] [🛡️Modules] [🗑️Del] │
│                     ↑                │
│              Click this one!         │
└──────────────────────────────────────┘

Permissions Modal:
┌──────────────────────────────────────┐
│ 🛡️ Manage Permissions               │
│ Support Agent • support@aventra.com  │
├──────────────────────────────────────┤
│ 2 of 8 modules selected              │
│ [Select All] [Clear All] ← Click     │
├──────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐     │
│ │ ✅ Booking  │ │ ✅ Customer │     │
│ │ Management  │ │ Management  │     │
│ └─────────────┘ └─────────────┘     │
│                                      │
│ ┌─────────────┐ ┌─────────────┐     │
│ │ ❌ Marketing│ │ ❌ Finance  │     │
│ └─────────────┘ └─────────────┘     │
│ ... 4 more modules ...               │
├──────────────────────────────────────┤
│ [Cancel] [💾 Save Permissions]       │
│           ↑ Click to save            │
└──────────────────────────────────────┘
```

## ✨ That's It!

You're done! The permissions are now configured for support@aventra.com.

## 🔍 If You Don't See support@aventra.com

1. **Hard refresh** the page: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Clear browser cache** and refresh
3. **Check the terminal** - make sure no compilation errors
4. **Restart dev server** if needed

## 📞 Need Help?

If you encounter any issues, let me know:
- Screenshot what you see
- Copy any error messages from the console
- Tell me which step you're stuck on

---

**Last Updated:** December 21, 2025  
**Status:** Ready to use! ✅
