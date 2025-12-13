# 🎯 Tours Pricing - Quick Reference Guide

## Quick Start (2 minutes)

### Access the Module
```
URL: http://localhost:3000/#/admin/tours/pricing
```

### Basic Workflow
1. **Select a tour** from the dropdown at the top
2. **Choose a pricing feature** from the tabs (Seasonal, Group Discounts, etc.)
3. **Add/Edit/Delete** pricing rules
4. **Click "Save Changes"** button
5. **View analytics** to see pricing impact

---

## Feature Quick Guide

### 🌍 Seasonal Pricing
**Purpose**: Charge different prices based on seasons

**Quick Setup**:
1. Click "Add Season"
2. Name: "Summer"
3. Dates: Jun 1 - Aug 31
4. Multiplier: 1.4 (40% increase)
5. Save

**Example Multipliers**:
- 0.5 = 50% discount
- 0.8 = 20% discount
- 1.0 = No change
- 1.2 = 20% increase
- 1.5 = 50% increase

---

### 👥 Group Discounts
**Purpose**: Encourage larger bookings with tier-based discounts

**Quick Setup**:
1. Click "Add Tier"
2. Name: "Large Group"
3. Min Size: 13
4. Max Size: (leave empty for unlimited)
5. Discount: 15%
6. Save

**Price Calculation**:
If base price is 2,500 SEK and 15% discount:
- Final price = 2,500 × (1 - 0.15) = **2,125 SEK per person**

---

### ⚡ Early Bird & Last Minute
**Purpose**: Incentivize advance or last-minute bookings

**Quick Setup**:
1. Click "Edit Rules"
2. **Early Bird**:
   - Enable: Yes
   - Days: 60 (discount applies if booked 60+ days before)
   - Discount: 12%
3. **Last Minute**:
   - Enable: Yes
   - Days: 14 (discount applies if booked within 14 days)
   - Discount: 15%
4. Save

**Timeline**:
```
        60 days before departure                14 days before
              ↓                                        ↓
┌─────────────────────────┬──────────────────────────┬─────────┐
│   Early Bird Discount   │   Regular Pricing Area   │ Last Min│
│        (12% off)        │                          │ (15% off)│
└─────────────────────────┴──────────────────────────┴─────────┘
```

---

### 📅 Blackout Dates
**Purpose**: Block dates when tours cannot be booked

**Quick Setup**:
1. Click "Add Blackout"
2. Name: "Equipment Maintenance"
3. Dates: Jan 15 - Jan 25
4. Blocks all tours: Yes
5. Reason: "Annual maintenance"
6. Save

**Use Cases**:
- Annual maintenance periods
- Holidays/seasonal closures
- Staff training
- Special events

---

### 👤 Capacity Settings
**Purpose**: Define group size constraints

**Quick Setup**:
1. Click "Edit"
2. Min Capacity: 4 (minimum people needed)
3. Max Capacity: 16 (maximum people allowed)
4. Preferred: 12 (target group size)
5. Blocked Seats: 2 (for guides/staff)
6. Save

**Visualization**:
Shows progress bar from min to preferred capacity

---

### 📊 Price Calendar
**Purpose**: View and verify pricing for all dates

**How to Use**:
- **Navigate**: Use ← → arrows to switch months
- **Color Legend**:
  - 🟢 Green: Available (low occupancy)
  - 🔵 Blue: High demand
  - 🟡 Yellow: Limited spots
  - 🔴 Red: Full or blackout
- **Click a date** to see detailed pricing rules
- Shows occupancy % for each date
- Shows price change vs base price

**What It Shows**:
```
Date: 2025-07-15
├─ Price: 3,500 SEK
├─ Deposit: 1,050 SEK (30%)
├─ Available: 8 spots
├─ Occupancy: 50%
└─ Rules Applied:
   ├─ Seasonal: 1.4x multiplier (summer)
   └─ No group discount
```

---

### 📈 Analytics Tab
**Purpose**: Analyze pricing strategy effectiveness

**Key Metrics**:
- **Average Price**: Overall pricing across period
- **Occupancy Rate**: % of capacity filled
- **Total Revenue**: Income from tour
- **Bookings**: Number of bookings
- **Demand Trend**: Increasing/Stable/Decreasing

**Charts**:
1. **Revenue & Bookings**: Bar chart over months
2. **Price & Occupancy**: Line chart showing relationship
3. **Discount Distribution**: Pie chart of discount types
4. **Price History**: Line chart of price changes

**How to Read**:
- Upward price trend + high occupancy = good demand
- Flat price + decreasing bookings = may need discount
- High discounts without revenue boost = ineffective

---

## Common Scenarios

### Scenario 1: Summer Peak Season
```
Seasonal:     1.4x (40% premium)
Group:        15% off for 13+
Early Bird:   60 days = 12% off
Capacity:     Max 16, prefer 12
```
**Effect**: High prices in summer, but group bookings offset cost

### Scenario 2: Off-Season Promotion
```
Seasonal:     0.8x (20% discount)
Group:        10% off for 7+
Last Minute:  14 days = 20% off
Capacity:     Min 2, prefer 6
```
**Effect**: Maximize bookings through aggressive discounting

### Scenario 3: Luxury Exclusive Tour
```
Capacity:     Min 2, Max 4 only
Early Bird:   90 days = 10% off
Last Minute:  Disabled
Blackout:     All winter months
```
**Effect**: Premium positioning, exclusive experience

---

## Data Management

### Save & Restore
- **Save**: Click "Save Changes" button (top right)
- **Undo**: Refresh page to discard unsaved changes
- **Indicator**: Yellow bar shows unsaved changes

### What Gets Saved
```
✓ Seasonal pricing periods
✓ Group discount tiers
✓ Early bird/last minute rules
✓ Blackout periods
✓ Capacity settings
✓ All manual changes
```

### What's Auto-Generated
```
- Price calendar (recalculated from rules)
- Analytics (from historical data)
- Price history (from changes)
```

---

## Tips & Tricks

### 💡 Pro Tips
1. **Test Before Saving**: Use price calendar to preview all changes
2. **Use Colors**: Assign different colors to seasons for quick identification
3. **Reasonable Multipliers**: Keep between 0.5 and 2.0 for consistency
4. **Capacity Matching**: Set min/max to reflect actual guide capacity
5. **Seasonal Planning**: Set up full year at once

### ⚠️ Common Mistakes
1. ❌ Overlapping season dates (system will use first match)
2. ❌ Max capacity < min capacity (will cause issues)
3. ❌ Too many discount tiers (confusing for customers)
4. ❌ Blackout dates not aligned with actual closures
5. ❌ Forgetting to save changes

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Save | (No shortcut - use button) |
| Add/Edit | Tab through form, Enter to save |
| Cancel | Escape key or Cancel button |
| Next Month | → Arrow key (in calendar) |
| Previous Month | ← Arrow key (in calendar) |

---

## FAQ

**Q: What if I want to remove a pricing rule?**
A: Click the delete icon (trash) next to the rule to remove it.

**Q: Can I have overlapping seasonal periods?**
A: Yes, but the system uses the first matching rule. Order matters!

**Q: How do discounts stack?**
A: All applicable discounts combine:
- Group discount applies to season-adjusted price
- Early bird applies to group-discounted price
- Final = Base × Season × Group × Time

**Q: What if I change capacity after bookings?**
A: Changes apply immediately. Check analytics for impact.

**Q: Can I set minimum or maximum price?**
A: Not in current version, but service layer supports this for future use.

**Q: How often should I review pricing?**
A: Monthly recommended. Use analytics to identify underperforming periods.

**Q: Can multiple tours share pricing rules?**
A: Not automatically, but you can manually configure identical rules.

---

## Support Commands

### Reset to Defaults
1. Go to Pricing page
2. Refresh browser (F5)
3. Click "Discard changes"
4. Will reload mock data

### Export Pricing
1. Go to Analytics tab
2. Price calendar data shown in calendar
3. (Export feature coming in future)

### Contact Support
- Check [TOUR_PRICING_COMPLETE.md](./TOUR_PRICING_COMPLETE.md) for full documentation
- Review [pricing.types.ts](./src/features/tours/types/pricing.types.ts) for data structure
- Check [pricing.service.ts](./src/features/tours/services/pricing.service.ts) for API

---

**Last Updated**: December 13, 2025
**Version**: 1.0.0
**Status**: Production Ready
