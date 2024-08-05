import { BoxListDocuments, CampaignFundraising, Course } from '@auxo-dev/frontend-common';
import React from 'react';

export default function RightBox({ dataFundRaising, selectedCampaignIndex }: { dataFundRaising: CampaignFundraising[]; selectedCampaignIndex: number | null }) {
    return <BoxListDocuments documents={selectedCampaignIndex == null ? [] : dataFundRaising[selectedCampaignIndex]?.documents || []} members={[]}></BoxListDocuments>;
}
