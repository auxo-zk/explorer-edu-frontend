import { Campaign, CardCourse, Course, getListProjectJoinedInCampaign, IconSpinLoading, NoData, useModalFunction } from '@auxo-dev/frontend-common';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import ModalSelectCourses from './ModalSelectCourses/ModalSelectCourses';
import BoxSummaryInput from './BoxSummaryInput/BoxSummaryInput';
import { useChangeInputInvest, useInputInvestCourseValue } from './state';

export default function ParticipatingCourses({ campaign, timeForJoinCampaign }: { campaign: Campaign; timeForJoinCampaign: number }) {
    const [courses, setCourses] = React.useState<Course[]>([]);
    const [loading, setLoading] = React.useState(false);
    const inputInvest = useInputInvestCourseValue();
    const changInputInvest = useChangeInputInvest();

    const { openModal } = useModalFunction();
    async function fetchCourses() {
        setLoading(true);
        try {
            const response = await getListProjectJoinedInCampaign(campaign.campaignId);
            console.log(response);
            setCourses(response);
        } catch (error) {
            console.error(error);
            setCourses([]);
        }
        setLoading(false);
    }
    const handleOpen = () => {
        openModal({
            title: 'Select Project',
            content: <ModalSelectCourses />,
            modalProps: {
                maxWidth: 'xs',
            },
        });
    };

    useEffect(() => {
        fetchCourses();
    }, []);
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', placeItems: 'center' }} mt={5.5}>
                <Typography variant="h6">Participating Projects ({courses.length})</Typography>
                {timeForJoinCampaign == 0 ? (
                    <Button sx={{ minWidth: '184px' }} variant="contained" onClick={handleOpen}>
                        Apply Project
                    </Button>
                ) : (
                    <Button variant="contained" disabled>
                        {timeForJoinCampaign > 0 ? 'Application Ended' : 'Not time for join campaign'}
                    </Button>
                )}
            </Box>
            {loading ? (
                <Box sx={{ py: 5 }}>
                    <IconSpinLoading sx={{ fontSize: '100px' }} />
                </Box>
            ) : (
                <>
                    {courses.length == 0 ? (
                        <NoData text="No Project Found!" />
                    ) : (
                        <>
                            <Box mt={3}>
                                <TextField size="small" variant="outlined" color="secondary" label="Search project" name="project_name" sx={{ width: '100%', maxWidth: '380px', mb: 3 }} />
                                <BoxSummaryInput tokenFund={campaign.tokenFunding} courses={courses} />

                                <Grid container spacing={3}>
                                    {courses.map((item, index) => {
                                        return (
                                            <Grid key={'projectJoinedcampain' + index + item.name} item xs={12} xsm={6} md={4}>
                                                <CardCourse data={item}>
                                                    <TextField
                                                        value={inputInvest[index + ''] || ''}
                                                        onChange={(e) => changInputInvest({ id: index + '', value: e.target.value })}
                                                        sx={{ mt: 3, backgroundColor: 'white', borderRadius: '12px' }}
                                                        type="number"
                                                        label="Invest"
                                                        size="small"
                                                        fullWidth
                                                        placeholder="Input amount invest..."
                                                        InputProps={{
                                                            endAdornment: (
                                                                <Typography variant="body2" fontWeight={600}>
                                                                    {campaign.tokenFunding.symbol}
                                                                </Typography>
                                                            ),
                                                        }}
                                                    />
                                                </CardCourse>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Box>
                        </>
                    )}
                </>
            )}
        </>
    );
}
