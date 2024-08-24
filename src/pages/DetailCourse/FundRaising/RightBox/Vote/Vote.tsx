import { abiGovernorFactory, ButtonLoading, CampaignFundraising, contractAddress, Course, formatNumber, IconSpinLoading, useSwitchToSelectedChain } from '@auxo-dev/frontend-common';
import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { config } from 'src/layout';
import { readContract } from 'viem/actions';
import { useAccount } from 'wagmi';

export default function Vote({ dataFundRaising, course }: { dataFundRaising: CampaignFundraising | null; course: Course }) {
    if (!dataFundRaising) {
        return <></>;
    }

    return <HaveVoted dataFundRaising={dataFundRaising} course={course} />;
}

function HaveVoted({ dataFundRaising, course }: { dataFundRaising: CampaignFundraising; course: Course }) {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isCanVote, setIsCanVote] = React.useState<boolean>(false);
    const [votingPower, setVotingPower] = React.useState<number>(0);
    const { chainIdSelected } = useSwitchToSelectedChain();
    const { address } = useAccount();
    const [proposal, setProposal] = React.useState<string>('');

    async function fetProposal() {}

    async function fetchDataVotingPower() {
        try {
            if (address) {
                const response = await readContract(config.getClient(), {
                    abi: abiGovernorFactory,
                    address: contractAddress[chainIdSelected].GovernorFactory,
                    functionName: 'getAllToken',
                    args: [course.address, address],
                });
                console.log(response);
                setVotingPower(Number(response[1]) / 10 ** dataFundRaising.tokenFunding.decimals);
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchDataVotingPower();
    }, [address, dataFundRaising.campaignId]);

    if (loading) {
        return (
            <Box>
                <IconSpinLoading sx={{ fontSize: '90px' }} />
            </Box>
        );
    }
    return (
        <Box sx={{ borderRadius: '12px', bgcolor: '#F1F6F5', boxShadow: '1px 1px 3px 0px rgba(0, 0, 0, 0.20)', mb: 3, p: 2 }}>
            <Typography variant="h5">Vote</Typography>
            <Typography sx={{ fontWeight: 600, my: 2 }}>Voting Power: {formatNumber(votingPower)}</Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <ButtonAccept onClick={async () => {}} />
                <ButtonReject onClick={async () => {}} />
            </Box>
        </Box>
    );
}

function ButtonAccept({ onClick }: { onClick: () => Promise<void> }) {
    const [loading, setLoading] = React.useState<boolean>(false);
    async function handleAccept() {
        setLoading(true);
        await onClick();

        setLoading(false);
    }
    return (
        <ButtonLoading muiProps={{ variant: 'contained', color: 'primary', onClick: handleAccept, fullWidth: true }} isLoading={loading}>
            Accept
        </ButtonLoading>
    );
}

function ButtonReject({ onClick }: { onClick: () => Promise<void> }) {
    const [loading, setLoading] = React.useState<boolean>(false);
    async function handleAccept() {
        setLoading(true);
        await onClick();

        setLoading(false);
    }
    return (
        <ButtonLoading muiProps={{ variant: 'contained', color: 'error', onClick: handleAccept, fullWidth: true }} isLoading={loading}>
            Reject
        </ButtonLoading>
    );
}
