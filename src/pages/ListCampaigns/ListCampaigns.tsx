import { BoxIntroducePage, Campaign, CardCampaign, CardCourse, Course, getCampaigns, getCourses, IconSpinLoading, NoData } from '@auxo-dev/frontend-common';
import { Box, Container, Grid, TextField } from '@mui/material';
import React, { useEffect } from 'react';

export default function ListCampaigns() {
    const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
    const [loading, setLoading] = React.useState(false);
    async function fetchCampaign() {
        setLoading(true);
        try {
            const response = await getCampaigns();
            setCampaigns(response);
        } catch (error) {
            console.error(error);
            setCampaigns([]);
        }
        setLoading(false);
    }
    useEffect(() => {
        fetchCampaign();
    }, []);
    return (
        <Container sx={{ py: 5 }}>
            <BoxIntroducePage title="Explore campaigns" thumnail="/images/auxo-thumbnail2.png">
                <TextField size="small" label="Search..." type="text" name="search_committee" color="secondary" sx={{ mt: 3, maxWidth: '479px' }} fullWidth></TextField>
            </BoxIntroducePage>

            <Box mt={5}>
                {loading ? (
                    <IconSpinLoading sx={{ fontSize: '100px' }} />
                ) : (
                    <>
                        {campaigns.length === 0 && <NoData />}
                        <Grid container spacing={2}>
                            {campaigns.map((item, index) => {
                                return (
                                    <Grid key={item.campaignId + index} item xs={12} xsm={6}>
                                        <CardCampaign data={item} toLink={'/campaigns/' + item.campaignId} />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </>
                )}
            </Box>
        </Container>
    );
}
