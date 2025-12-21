import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

// TEMPORARY: Feature hidden - showing Coming Soon page
// TODO: Restore when client requirements are finalized

/* FUNCTIONAL CODE - KEPT FOR FUTURE USE
import { CampaignsManager } from '../../../src/features/marketing/pages/CampaignsManager';
import { CampaignProvider } from '../../../src/features/marketing/context/CampaignContext';
*/

export const CampaignManager: React.FC = () => {
  return (
    <ComingSoon
      title="Marketing Campaigns"
      description="The marketing campaigns feature is being refined based on client requirements and will be available soon."
      features={[
        'Create and manage email marketing campaigns',
        'Customer segmentation and targeting',
        'Automated campaign scheduling',
        'A/B testing for campaign optimization',
        'Campaign performance analytics',
        'Template library for quick campaign creation',
        'Integration with email service providers',
        'ROI tracking and conversion metrics'
      ]}
    />
  );
};

/* ORIGINAL IMPLEMENTATION - PRESERVED FOR FUTURE USE

export const CampaignManager_Original: React.FC = () => {
  return (
    <CampaignProvider>
      <CampaignsManager />
    </CampaignProvider>
  );
};

*/
