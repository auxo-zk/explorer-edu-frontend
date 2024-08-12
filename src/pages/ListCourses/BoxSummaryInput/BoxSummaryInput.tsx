import { Box, Typography } from '@mui/material';
import React from 'react';
import { useLengthInvest, useTotalInvest } from '../state';
import { formatNumber } from '@auxo-dev/frontend-common';

export default function BoxSummaryInput() {
    const totalInvest = useTotalInvest();
    const lengthInvest = useLengthInvest();
    return (
        <Box>
            <Typography textAlign={'right'} variant="h6">
                Total invest:{' '}
                <Box component={'span'} color={'secondary.main'}>
                    {formatNumber(totalInvest)}
                </Box>{' '}
                ETH, of
                <Box component={'span'} color={'secondary.main'}>
                    {lengthInvest}
                </Box>{' '}
                courses
            </Typography>
        </Box>
    );
}
