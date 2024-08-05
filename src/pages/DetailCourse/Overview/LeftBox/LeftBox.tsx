import { Course, FontInter, formatNumber } from '@auxo-dev/frontend-common';
import { Box, Typography } from '@mui/material';
import { IconARB } from 'crypto-token-icon';

export default function LeftBox({ data }: { data: Course }) {
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h6">Claimed Amount</Typography>
                    <Box sx={{ display: 'flex', placeItems: 'center', mt: 1, gap: 1 }}>
                        <IconARB sx={{ fontSize: '40px' }} />
                        <Typography variant="h2" sx={{ fontFamily: FontInter }}>
                            {formatNumber(data.totalClaimedAmount, { fractionDigits: 2 })}
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    <Typography variant="h6">Funded Amount</Typography>
                    <Box sx={{ display: 'flex', placeItems: 'center', mt: 1, gap: 1 }}>
                        <IconARB sx={{ fontSize: '40px' }} />
                        <Typography variant="h2" fontWeight={300} color={'secondary.main'}>
                            {formatNumber(data.totalFundedAmount, { fractionDigits: 2 })}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Typography variant="h6" mt={6}>
                Description
            </Typography>
            <Box dangerouslySetInnerHTML={{ __html: data.description }}></Box>

            <Box sx={{ border: '1px solid', borderColor: 'background.primary', borderRadius: '12px', p: 3, mt: 3 }}>
                <Typography variant="h4" mb={1}>
                    Problem Statement
                </Typography>
                <Box dangerouslySetInnerHTML={{ __html: data.problemStatement }}></Box>
            </Box>
            <Box sx={{ border: '1px solid', borderColor: 'background.primary', borderRadius: '12px', p: 3, mt: 3 }}>
                <Typography variant="h4" mb={1}>
                    Solution
                </Typography>
                <Box dangerouslySetInnerHTML={{ __html: data.solution }}></Box>
            </Box>
            <Box sx={{ border: '1px solid', borderColor: 'background.primary', borderRadius: '12px', p: 3, mt: 3 }}>
                <Typography variant="h4" mb={1}>
                    Challenges & Risks{' '}
                </Typography>
                <Box dangerouslySetInnerHTML={{ __html: data.challengesAndRisk }}></Box>
            </Box>
        </Box>
    );
}
