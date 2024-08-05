import { BoxIntroducePage, ButtonGroup, Campaign, getCampaign, IconSpinLoading, imagePath, NoData } from '@auxo-dev/frontend-common';
import { ChevronLeftRounded } from '@mui/icons-material';
import { Box, Breadcrumbs, Container, Skeleton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Overview from './Overview/Overview';

export default function DetailCampaign() {
    const param = useParams();
    const [data, setData] = React.useState<Campaign | null>(null);
    const [selected, setSelected] = useState<number>(0);
    const [loading, setLoading] = React.useState(false);

    async function fetchCampaign(idCampaign: string) {
        setLoading(true);
        try {
            const response = await getCampaign(idCampaign);
            setData(response);
        } catch (error) {
            console.error(error);
            setData(null);
        }
        setLoading(false);
    }
    useEffect(() => {
        console.log(param);
        if (param?.idCampaign) {
            fetchCampaign(param.idCampaign);
        }
    }, []);

    if (loading) {
        return (
            <Container sx={{ pb: 5 }}>
                <Skeleton variant="rectangular" animation="wave" sx={{ width: '100%', height: 'auto', aspectRatio: '370/100', borderRadius: '0px 0px 12px 12px' }}></Skeleton>

                <Breadcrumbs sx={{ mt: 2 }}>
                    <Link color="inherit" to="/campaigns" style={{ textDecoration: 'none', color: 'unset' }}>
                        <Box sx={{ display: 'flex', placeItems: 'center' }}>
                            <ChevronLeftRounded color="primary" sx={{ fontSize: '24px' }} />
                            <Typography color={'primary.main'}>All Campaigns</Typography>
                        </Box>
                    </Link>
                    <Skeleton variant="text" width={'150px'} />
                </Breadcrumbs>
                <Box mt={5}>
                    <IconSpinLoading sx={{ fontSize: '100px' }} />
                </Box>
            </Container>
        );
    }

    if (data === null) {
        return (
            <Container sx={{ py: 5 }}>
                <BoxIntroducePage title="No Data Found" thumnail={'/images/LOGO_ICON_2D.png'}></BoxIntroducePage>
            </Container>
        );
    }

    return (
        <Container sx={{ pb: 5 }}>
            <img src={data.banner || imagePath.DEFAULT_BANNER} alt="banner project" style={{ width: '100%', height: 'auto', aspectRatio: '370/100', borderRadius: '0px 0px 12px 12px' }} />
            <Breadcrumbs sx={{ mt: 2 }}>
                <Link color="inherit" to="/campaigns" style={{ textDecoration: 'none', color: 'unset' }}>
                    <Box sx={{ display: 'flex', placeItems: 'center' }}>
                        <ChevronLeftRounded color="primary" sx={{ fontSize: '24px' }} />
                        <Typography color={'primary.main'}>All Campaigns</Typography>
                    </Box>
                </Link>
                <Typography color={'primary.main'} fontWeight={600}>
                    {data.name}
                </Typography>
            </Breadcrumbs>

            <Box sx={{ position: 'sticky', top: '64px', bgcolor: 'background.default', pb: 2, zIndex: 2 }}>
                <Box sx={{ display: 'flex', placeItems: 'center', gap: 1, mt: 2 }}>
                    <img src={data.avatar || imagePath.DEFAULT_AVATAR} alt="avatar project" style={{ width: '66px', height: '66px', borderRadius: '50%' }}></img>
                    <Box sx={{ display: 'flex', placeItems: 'baseline', gap: 1 }}>
                        <Typography variant="h3">{data.name}</Typography>
                        {/* <Typography variant="body2">Joined 24/12/2023</Typography> */}
                    </Box>
                </Box>
                <ButtonGroup
                    sx={{ mt: 3 }}
                    options={['Overview', 'Results']}
                    selected={selected}
                    changeSelected={(val) => {
                        setSelected(val);
                    }}
                    fullWidth={true}
                />
            </Box>
            {selected === 0 ? (
                <Box>
                    <Overview data={data} />
                </Box>
            ) : (
                <Box>
                    {/* <CampaignResults campaignId={idCampaign} /> */}
                    <NoData text="No Data" />
                </Box>
            )}
        </Container>
    );
}
