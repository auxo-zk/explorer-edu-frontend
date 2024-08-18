import { Box, Divider, IconButton, Typography } from '@mui/material';
import { useDeleteInputInvest, useInputInvestCourseValue, useTotalInvest } from '../state';
import { Course, formatNumber, TokenInfo } from '@auxo-dev/frontend-common';
import { Clear } from '@mui/icons-material';

export default function ModalConfirmInvest({ courses, tokenFund }: { courses: Course[]; tokenFund: TokenInfo }) {
    const totalInvest = useTotalInvest();
    const investData = useInputInvestCourseValue();
    const deleteInvest = useDeleteInputInvest();
    return (
        <Box>
            <Box sx={{ display: 'flex', placeItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color={'text.secondary'}>
                    Project Name
                </Typography>
                <Typography variant="body2" color={'text.secondary'} mr={3}>
                    Funding vol
                </Typography>
            </Box>
            {Object.keys(investData)
                .filter((key) => Number(investData[key]) > 0)
                .map((key, index) => {
                    return (
                        <Box key={key + 'invest' + index} sx={{ display: 'flex', placeItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                            <Typography color={'text.primary'}>{courses[Number(key)]?.name}</Typography>
                            <Box sx={{ display: 'flex', placeItems: 'center' }}>
                                <Typography color={'text.primary'} fontWeight={600}>
                                    {investData[key]} {tokenFund.symbol}
                                </Typography>
                                <Clear fontSize="small" sx={{ cursor: 'pointer', ml: 1, color: 'text.secondary' }} onClick={() => deleteInvest(key)} />
                            </Box>
                        </Box>
                    );
                })}
            <Divider sx={{ mt: 2 }} color="primary.main" />
            <Typography sx={{ mt: 1, textAlign: 'right', fontWeight: 600, mr: 3 }}>
                Total Invest: {formatNumber(totalInvest)} {tokenFund.symbol}
            </Typography>
        </Box>
    );
}
