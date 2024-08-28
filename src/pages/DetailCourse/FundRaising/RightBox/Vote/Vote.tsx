import {
    abiGovernor,
    abiGovernorFactory,
    BN,
    ButtonLoading,
    CampaignFundraising,
    contractAddress,
    Course,
    DEC,
    ErrorExeTransaction,
    formatNumber,
    IconSpinLoading,
    useSwitchToSelectedChain,
} from '@auxo-dev/frontend-common';
import { Box, Typography } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { config } from 'src/layout';
import { bytes32ToString } from 'src/utils';
import { Address } from 'viem';
import { readContract, waitForTransactionReceipt } from 'viem/actions';
import { useAccount, useReadContracts, useWriteContract } from 'wagmi';

export default function Vote({ dataFundRaising, course }: { dataFundRaising: CampaignFundraising | null; course: Course }) {
    const { address } = useAccount();
    if (!dataFundRaising || !address) {
        return <></>;
    }

    return <HaveVoted dataFundRaising={dataFundRaising} course={course} userAddress={address} />;
}

function HaveVoted({ dataFundRaising, course, userAddress }: { dataFundRaising: CampaignFundraising; course: Course; userAddress: Address }) {
    const [isCanVote, setIsCanVote] = React.useState<boolean>(false);
    const { writeContractAsync } = useWriteContract();
    const { chainIdSelected, switchToChainSelected } = useSwitchToSelectedChain();
    const { data, isLoading, isError } = useReadContracts({
        allowFailure: false,
        contracts: [
            {
                abi: abiGovernorFactory,
                address: contractAddress[chainIdSelected].GovernorFactory,
                functionName: 'getAllToken',
                args: [course.address, userAddress],
            },
            {
                abi: abiGovernorFactory,
                address: contractAddress[chainIdSelected].GovernorFactory,
                functionName: 'lastProposal',
                args: [course.address],
            },
        ],
    });

    async function voteOrReject(vote: 'Reject' | 'Accept') {
        try {
            await switchToChainSelected();
            const response = await writeContractAsync({
                abi: abiGovernor,
                address: course.address,
                functionName: 'castVoteBatch',
                args: [data?.[1][1] || BigInt(0), data?.[0][0].map((item) => item.id) || [], vote == 'Reject' ? 0 : 1],
            });
            await waitForTransactionReceipt(config.getClient(), { hash: response });
            toast.success('Vote success');
        } catch (error) {
            console.error(error);
            toast.error(<ErrorExeTransaction error={error} />);
        }
    }

    if (isLoading) {
        return (
            <Box>
                <IconSpinLoading sx={{ fontSize: '90px' }} />
            </Box>
        );
    }

    if (BN(bytes32ToString(data?.[1]?.[0]?.descriptionHash || '') || 0).isEqualTo(0)) {
        return <></>;
    }

    return (
        <Box sx={{ borderRadius: '12px', bgcolor: '#F1F6F5', boxShadow: '1px 1px 3px 0px rgba(0, 0, 0, 0.20)', mb: 3, p: 2 }}>
            <Typography variant="h5">Vote</Typography>

            {isError ? (
                <Typography>Error Fetch Voting Power!</Typography>
            ) : (
                <>
                    <Typography mt={2}>
                        Active vesting request: {formatNumber(BN(bytes32ToString(data?.[1]?.[0].descriptionHash || '')).div(DEC(dataFundRaising.tokenFunding.decimals)))}{' '}
                        {dataFundRaising.tokenFunding.symbol}
                    </Typography>
                    <Typography sx={{ fontWeight: 600, my: 2 }}>Voting Power: {formatNumber(BN(data?.[0][1]).div(DEC(dataFundRaising.tokenFunding.decimals)))}</Typography>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <ButtonAccept onClick={() => voteOrReject('Accept')} />
                        <ButtonReject onClick={() => voteOrReject('Reject')} />
                    </Box>
                </>
            )}
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
