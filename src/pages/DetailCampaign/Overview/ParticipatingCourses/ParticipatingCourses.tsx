import { CardCourse, Course, getListProjectJoinedInCampaign, IconSpinLoading, NoData, useModalFunction } from '@auxo-dev/frontend-common';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import ModalSelectCourses from './ModalSelectCourses/ModalSelectCourses';

export default function ParticipatingCourses({ campaignId, timeForJoinCampaign }: { campaignId: string; timeForJoinCampaign: number }) {
    const [courses, setCourses] = React.useState<Course[]>([]);
    const [loading, setLoading] = React.useState(false);
    const { openModal } = useModalFunction();
    async function fetchCourses() {
        setLoading(true);
        try {
            const response = await getListProjectJoinedInCampaign(campaignId);
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

                                <Grid container spacing={3}>
                                    {courses.map((item, index) => {
                                        return (
                                            <Grid key={'projectJoinedcampain' + index + item.name} item xs={12} xsm={6} md={4}>
                                                <CardCourse data={item}></CardCourse>
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
