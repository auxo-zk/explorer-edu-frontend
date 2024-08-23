import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useLengthInvest, useTotalInvest } from '../state';
import { Course, formatNumber, TokenInfo, useModalFunction } from '@auxo-dev/frontend-common';
import ModalConfirmInvest from '../ModalConfirmInvest/ModalConfirmInvest';

export default function BoxSummaryInput({ tokenFund, courses, campaignId }: { tokenFund: TokenInfo; courses: Course[]; campaignId: string }) {
    const totalInvest = useTotalInvest();
    const lengthInvest = useLengthInvest();
    const { openModal } = useModalFunction();
    return (
        <Box mb={2} sx={{ display: 'flex', gap: 2, justifyContent: 'end', alignItems: 'center' }}>
            <Typography textAlign={'right'} variant="h6" fontWeight={400}>
                Total invest:{' '}
                <Box component={'span'} color={'secondary.main'} fontWeight={600}>
                    {formatNumber(totalInvest)}
                </Box>{' '}
                {tokenFund?.symbol || 'Token'}, of{' '}
                <Box component={'span'} color={'secondary.main'} fontWeight={600}>
                    {lengthInvest}
                </Box>{' '}
                courses
            </Typography>
            <Button
                variant="outlined"
                size="small"
                onClick={() =>
                    openModal({ title: 'Confirm investments', content: <ModalConfirmInvest campaignId={campaignId} tokenFund={tokenFund} courses={courses} />, modalProps: { maxWidth: 'xs' } })
                }
            >
                Invest
            </Button>
        </Box>
    );
}
