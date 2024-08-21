import { CampaignFundraising, Course, getFundraisingInfoByProjectId, getJoinedCampaigns, IconSpinLoading, NoData } from '@auxo-dev/frontend-common';
import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import LeftBox from './LeftBox/LeftBox';
import RightBox from './RightBox/RightBox';
import { config } from 'src/layout';

export default function FundRaising({ data }: { data: Course }) {
    const [dataFundRaising, setDataFundRaising] = React.useState<CampaignFundraising[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [selectedCampaignIndex, setSelectedCampaignIndex] = React.useState<number | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await getFundraisingInfoByProjectId(data.id, data.address, config.getClient());
                setSelectedCampaignIndex(response.length > 0 ? 0 : null);
                setDataFundRaising(response);
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        })();
    }, []);

    return (
        <Box sx={{ display: 'flex', gap: 3.5, mt: 3, position: 'relative', zIndex: 0 }}>
            {loading ? (
                <IconSpinLoading sx={{ fontSize: '100px' }} />
            ) : (
                <>
                    {/* {dataFundRaising.length == 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <NoData text="The course has not participated in any campaigns." />
                        </Box>
                    ) : ( */}
                    <>
                        <LeftBox dataFundRaising={dataFundRaising} selectedCampaignIndex={selectedCampaignIndex} setSelectedCampaignIndex={setSelectedCampaignIndex} />
                        <RightBox dataFundRaising={dataFundRaising} selectedCampaignIndex={selectedCampaignIndex} />
                    </>
                    {/* )} */}
                </>
            )}
        </Box>
    );
}
