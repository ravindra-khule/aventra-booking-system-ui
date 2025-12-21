# Marketing Campaigns - Quick Start Guide

## Getting Started

### 1. Access the Marketing Campaigns Module

Navigate to: `http://localhost:3000/#/admin/marketing/campaigns`

### 2. Understanding the Dashboard

The campaigns manager consists of four main views:

#### **List View**
- Shows all campaigns
- Filter by status (Draft, Scheduled, Active, Completed, Paused)
- Filter by channel (Email, SMS, Social Media, Push)
- Search campaigns by name
- Pagination support

#### **Create/Edit View**
- Tabbed form interface
- 4 steps: Basic Info → Channels → Audience → Schedule
- Template library integration
- Real-time validation

#### **Details View**
- Campaign summary
- Performance metrics at a glance
- Quick actions (Edit, View Analytics)
- Notes and metadata

#### **Analytics View**
- Real-time performance tracking
- 6 key metric cards
- Performance trends chart
- Channel distribution
- Channel performance comparison
- ROI summary

## Quick Workflows

### Creating Your First Campaign

1. **Click "New Campaign"** button
2. **Fill Basic Info Tab:**
   - Name: "Summer Booking Promotion"
   - Description: "Encourage bookings during summer months"
   - Select a template (optional)
   - Add internal notes

3. **Select Channels Tab:**
   - Check Email and SMS
   - Fill email content:
     - Subject: "Limited Time: Summer Tours 20% Off"
     - Content: Your promotional HTML
     - CTA Button: "Book Now"
   - Fill SMS content:
     - Keep under 160 characters
     - Include discount and call-to-action

4. **Choose Audience Tab:**
   - Select "Previous Bookers" segment
   - Select "High-Value Customers" segment
   - View estimated audience size

5. **Set Schedule Tab:**
   - Start Date: Choose when to send
   - End Date: Campaign duration
   - Enable A/B Testing: Yes (optional)
   - Set test variants and percentages

6. **Click "Create Campaign"**

### Running A/B Tests

1. **During Campaign Creation:**
   - Check "Enable A/B Testing" on Schedule tab
   - Add 2-3 variants:
     - Variant A (Control): Original content
     - Variant B: Different subject line
     - Variant C: Different CTA text
   - Set traffic distribution:
     - Variant A: 40%
     - Variant B: 30%
     - Variant C: 30%

2. **Monitor Results:**
   - Go to Analytics view
   - Watch variant performance
   - System will identify winner

3. **Apply Winner:**
   - Once test completes
   - Click "Apply This Variant"
   - Remaining audience gets best-performing version

### Analyzing Campaign Performance

1. **Open Campaign Details**
   - Click on any campaign
   - See key metrics summary

2. **View Full Analytics**
   - Click "Analytics" button
   - Select date range:
     - Last 7 days
     - Last 30 days
     - Last 90 days
     - All time

3. **Review Metrics:**

   | Metric | What It Means |
   |--------|---------------|
   | Delivered | Messages successfully sent |
   | Opened | How many opened emails |
   | Clicked | How many clicked links |
   | Converted | How many made bookings |
   | ROI | Return on Investment % |

4. **Channel Performance:**
   - Compare email vs SMS
   - See which channel converts best
   - Optimize future campaigns

### Managing Audience Segments

Segments are pre-defined groups for targeting:

**Available Segment Types:**
- **Recent Bookers:** Active customers from last 30 days
- **High-Value Customers:** Top 20% by lifetime spend
- **Inactive Users:** No booking in 90+ days
- **Geographic:** By location
- **Seasonal Interest:** Based on tour preferences

**Using Segments:**
1. Create campaign
2. Go to "Audience" tab
3. Select relevant segments
4. View customer count for each
5. Combine multiple segments for precise targeting

### Using Campaign Templates

**Available Templates:**

| Template | Best For | Channels |
|----------|----------|----------|
| Seasonal Promotion | Holiday campaigns | Email, SMS |
| Welcome Series | New customers | Email |
| Abandoned Cart | Recover lost bookings | Email, SMS |
| Win-Back | Reactivate inactive users | Email |
| Cross-Sell | Upsell tours | Email, SMS |
| Loyalty Reward | Reward repeat customers | Email |

**To Use a Template:**
1. Start creating campaign
2. On Basic Info tab, select template
3. Content auto-populates
4. Customize as needed
5. Proceed with campaign creation

## Common Tasks

### Pausing a Campaign
1. Click campaign
2. Expand actions
3. Click "Pause"
4. Campaign stops delivering to remaining audience

### Resuming a Campaign
1. Click paused campaign
2. Expand actions
3. Click "Resume"
4. Campaign continues

### Duplicating a Campaign
1. Click campaign
2. Expand actions
3. Click "Duplicate"
4. New draft campaign created
5. Modify and launch

### Deleting a Campaign
1. Click campaign
2. Expand actions
3. Click "Delete"
4. Confirm deletion
⚠️ **Warning:** Cannot be undone!

## Understanding the Metrics

### Delivery Metrics
- **Sent:** Total messages sent
- **Delivered:** Successfully reached recipients
- **Bounced:** Invalid/undeliverable addresses
- **Delivery Rate:** (Delivered / Sent) × 100

### Engagement Metrics
- **Opened:** Recipients opened email (email only)
- **Clicked:** Recipients clicked link
- **Open Rate:** (Opened / Delivered) × 100
- **Click Rate:** (Clicked / Delivered) × 100

### Conversion Metrics
- **Converted:** Made a booking after campaign
- **Conversion Rate:** (Converted / Delivered) × 100
- **Revenue:** Total booking value
- **Cost per Conversion:** Campaign Cost / Conversions

### ROI Metrics
- **Campaign Cost:** Total cost to run campaign
- **Revenue:** Total booking revenue
- **Profit:** Revenue - Cost
- **ROI:** (Profit / Cost) × 100
- **ROAS:** Revenue / Cost (Return on Ad Spend)

## Best Practices

### 1. Segmentation
- ✅ Use multiple segments for targeting
- ✅ Review segment size before campaign
- ❌ Don't email unengaged users repeatedly
- ❌ Avoid sending to entire database

### 2. Content
- ✅ Personalize subject lines
- ✅ Include clear call-to-action
- ✅ Mobile-optimize email
- ❌ Don't use all caps
- ❌ Avoid spam trigger words

### 3. Testing
- ✅ Always A/B test important campaigns
- ✅ Run tests for 24-48 hours minimum
- ✅ Test one element at a time
- ❌ Don't draw conclusions from tiny samples

### 4. Scheduling
- ✅ Send when audience is most active
- ✅ Avoid late night/early morning
- ✅ Consider timezone differences
- ❌ Don't send to same segment daily

### 5. Monitoring
- ✅ Check analytics after 24 hours
- ✅ Monitor delivery issues
- ✅ Track unsubscribe rates
- ❌ Don't ignore bounce rates

## Troubleshooting

### Campaign Won't Send
- Check audience segment size (should be > 0)
- Verify email/SMS content is filled
- Ensure start date is in future
- Check for validation errors

### Low Open Rates
- Test different subject lines
- Check email list quality
- Optimize send time
- Improve email content

### Low Conversion Rates
- Review CTA clarity
- Check landing page
- Test different offers
- Analyze customer journey

### Missing Analytics
- Wait 24 hours for data
- Check campaign dates
- Verify campaign was sent
- Check backend logs

## Key Features Summary

| Feature | When to Use | Benefit |
|---------|-------------|---------|
| Templates | Quick setup | Save time |
| Segmentation | Targeted campaigns | Higher conversion |
| A/B Testing | Important campaigns | Optimize performance |
| Analytics | After campaign | Measure success |
| ROI Tracking | Budget optimization | Justify spend |
| Scheduling | Plan campaigns | Consistent delivery |
| Promo Integration | Discount campaigns | Track redemption |
| Multi-channel | Reach all devices | Higher engagement |

## Next Steps

1. **Create your first campaign** - Start simple
2. **Run A/B tests** - Optimize content
3. **Analyze results** - Learn what works
4. **Scale campaigns** - Use successful templates
5. **Integrate with promo codes** - Drive conversions

## Support Resources

- Full documentation: [MARKETING_CAMPAIGNS_IMPLEMENTATION.md](MARKETING_CAMPAIGNS_IMPLEMENTATION.md)
- Type definitions: `src/features/marketing/types/campaign.types.ts`
- API services: `src/features/marketing/services/campaign.service.ts`
- React context: `src/features/marketing/context/CampaignContext.tsx`

---

**Happy campaigning!** 🚀

For more detailed technical documentation, see the [full implementation guide](MARKETING_CAMPAIGNS_IMPLEMENTATION.md).
