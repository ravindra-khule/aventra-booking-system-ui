import React from 'react';
import { CampaignsManager } from '../../../src/features/marketing/pages/CampaignsManager';
import { CampaignProvider } from '../../../src/features/marketing/context/CampaignContext';

export const CampaignManager: React.FC = () => {
  return (
    <CampaignProvider>
      <CampaignsManager />
    </CampaignProvider>
  );
};
