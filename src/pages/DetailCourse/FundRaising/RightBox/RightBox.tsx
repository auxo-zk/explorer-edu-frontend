import { BoxListDocuments, CampaignFundraising, Course } from '@auxo-dev/frontend-common';
import React from 'react';
import Vote from './Vote/Vote';
import { Box } from '@mui/material';

export default function RightBox({ dataFundRaising, selectedCampaignIndex, course }: { dataFundRaising: CampaignFundraising[]; selectedCampaignIndex: number | null; course: Course }) {
    return (
        <Box>
            <Vote dataFundRaising={selectedCampaignIndex == null ? null : dataFundRaising[selectedCampaignIndex]} course={course} />
            <BoxListDocuments documents={selectedCampaignIndex == null ? [] : dataFundRaising[selectedCampaignIndex]?.documents || []} members={[]}></BoxListDocuments>
        </Box>
    );
}
