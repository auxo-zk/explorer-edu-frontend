import { CampaignFundraising, Course, formatDate, formatNumber } from '@auxo-dev/frontend-common';
import { Avatar, Box, Grid, MenuItem, Select, Typography } from '@mui/material';
import { Icon, IconARB } from 'crypto-token-icon';
import CustomAccordion from 'src/components/CustomAccordion/CustomAccordion';

export default function LeftBox({
    dataFundRaising,
    selectedCampaignIndex,
    setSelectedCampaignIndex,
}: {
    dataFundRaising: CampaignFundraising[];
    selectedCampaignIndex: number | null;
    setSelectedCampaignIndex: React.Dispatch<React.SetStateAction<number | null>>;
}) {
    return (
        <Box sx={{ width: '100%' }}>
            <Select
                value={selectedCampaignIndex}
                color="secondary"
                fullWidth
                sx={{ mb: 4 }}
                onChange={(e) => {
                    setSelectedCampaignIndex(Number(e.target.value));
                }}
            >
                {dataFundRaising.map((item, index) => {
                    return (
                        <MenuItem key={index} value={index}>
                            <Typography>
                                Campaign ID: {item.campaignId} - {item.campaignName}
                            </Typography>
                        </MenuItem>
                    );
                })}
            </Select>

            {selectedCampaignIndex != null ? (
                <>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography variant="h6">Funded Amount</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', my: 2 }}>
                                <Avatar src="" alt="" sx={{ width: '36px', height: '36px', p: 0 }}>
                                    <Icon tokenName={dataFundRaising[selectedCampaignIndex]?.tokenFunding.symbol as any} sx={{ fontSize: '2.5rem' }} />
                                </Avatar>
                                <Box sx={{ ml: 1 }}>
                                    <Typography variant="h4" color={'primary.light'}>
                                        {formatNumber(dataFundRaising[selectedCampaignIndex]?.fundedAmount || 0)}
                                    </Typography>
                                    <Typography variant="body2" color={'text.secondary'}></Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h6">Taget Amount</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', my: 2 }}>
                                <Avatar src="" alt="" sx={{ width: '36px', height: '36px', p: 0 }}>
                                    <Icon tokenName={dataFundRaising[selectedCampaignIndex]?.tokenFunding.symbol as any} sx={{ fontSize: '2.5rem' }} />
                                </Avatar>
                                <Box sx={{ ml: 1 }}>
                                    <Typography variant="h4" color={'primary.light'}>
                                        {formatNumber(dataFundRaising[selectedCampaignIndex]?.targetAmount || 0)}
                                    </Typography>
                                    <Typography variant="body2" color={'text.secondary'}>
                                        {/* $336.578.854 */}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box sx={{ width: '100%', backgroundColor: '#FFF8F6', borderRadius: 2, overflow: 'hidden', mb: 7 }}>
                        <Box sx={{ backgroundColor: 'secondary.light', p: 2, my: 0 }}>
                            <Grid container>
                                <Grid item xs={3}>
                                    <Typography variant="body2" color={'text.secondary'}>
                                        Scope
                                    </Typography>
                                </Grid>
                                <Grid item xs={4.5}>
                                    <Typography variant="body2" color={'text.secondary'}>
                                        Budget Required
                                    </Typography>
                                </Grid>
                                <Grid item xs={4.5}>
                                    <Typography variant="body2" color={'text.secondary'}>
                                        ETC
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={{ m: 0, p: 2 }}>
                            {dataFundRaising[selectedCampaignIndex]?.scopeOfWorks?.map((item, index) => {
                                return (
                                    <Grid key={index} container sx={{ my: 2 }}>
                                        <Grid item xs={3}>
                                            <Typography variant="body1">{index + 1}</Typography>
                                        </Grid>
                                        <Grid item xs={4.5}>
                                            <Typography variant="body1" fontWeight={600}>
                                                {formatNumber(item.raisingAmount, { fractionDigits: 2 })} MINA
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4.5}>
                                            <Typography variant="body1" fontWeight={300}>
                                                {item.deadline ? formatDate(item.deadline, 'dd MMM yyyy') : 'Not specific'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                );
                            })}
                        </Box>
                    </Box>

                    {dataFundRaising[selectedCampaignIndex]?.questions.map((item, index) => {
                        return (
                            <Box key={'qa' + index} sx={{ my: 1 }}>
                                <CustomAccordion title={item.question} content={dataFundRaising[selectedCampaignIndex]?.answers[index] || ''} />
                            </Box>
                        );
                    })}
                </>
            ) : (
                <></>
            )}
        </Box>
    );
}
