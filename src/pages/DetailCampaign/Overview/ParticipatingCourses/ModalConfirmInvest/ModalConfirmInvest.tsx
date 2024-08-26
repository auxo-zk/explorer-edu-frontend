import { Box, Divider, IconButton, Typography } from '@mui/material';
import { useDeleteInputInvest, useInputInvestCourseValue, useTotalInvest } from '../state';
import { abiCampaign, BN, ButtonLoading, contractAddress, Course, DEC, ErrorExeTransaction, formatNumber, TokenInfo, useModalFunction, useSwitchToSelectedChain } from '@auxo-dev/frontend-common';
import { Clear } from '@mui/icons-material';
import { useAccount, useWriteContract } from 'wagmi';
import { erc20Abi, parseEther } from 'viem';
import { readContract, waitForTransactionReceipt } from 'viem/actions';
import { config } from 'src/layout';
import { toast } from 'react-toastify';
import { useState } from 'react';

export default function ModalConfirmInvest({ courses, tokenFund, campaignId }: { courses: Course[]; tokenFund: TokenInfo; campaignId: string }) {
    const totalInvest = useTotalInvest();
    const investData = useInputInvestCourseValue();
    const deleteInvest = useDeleteInputInvest();
    const { address } = useAccount();
    const { chainId, chainIdSelected, switchToChainSelected } = useSwitchToSelectedChain();
    const { writeContractAsync } = useWriteContract();
    const { closeModal } = useModalFunction();

    async function invest() {
        const idtoast = toast.loading('Creating transaction...', { position: 'top-center', type: 'info' });
        try {
            if (!address) throw Error('Please connect wallet');
            await switchToChainSelected();
            const allowance = await readContract(config.getClient(), {
                abi: erc20Abi,
                address: tokenFund.address,
                functionName: 'allowance',
                args: [address, contractAddress[chainIdSelected].Campaign],
            }); // get allowance
            if (BN(allowance).isLessThan(BN(totalInvest).times(DEC(tokenFund.decimals)))) {
                toast.update(idtoast, { render: 'Approve more amount to invest...' });
                const hashApprove = await writeContractAsync({
                    abi: erc20Abi,
                    address: tokenFund.address,
                    functionName: 'approve',
                    args: [contractAddress[chainIdSelected].Campaign, BigInt(totalInvest * 10 ** tokenFund.decimals)],
                }); // approve
                await waitForTransactionReceipt(config.getClient(), { hash: hashApprove });
            }
            toast.update(idtoast, { render: 'Creating transaction to invest...' });

            const arrFunds = Object.keys(investData).filter((key) => Number(investData[key]) > 0);

            const exeAction = await writeContractAsync({
                abi: abiCampaign,
                address: contractAddress[chainIdSelected].Campaign,
                functionName: 'funds',
                args: [BigInt(campaignId), arrFunds.map((key) => BigInt(courses[Number(key)].id)), arrFunds.map((key) => BigInt(Number(investData[key]) * 10 ** tokenFund.decimals))],
                // args: [BigInt(campaignId), BigInt(courses[0].id), BigInt(Number(investData[0]) * 10 ** tokenFund.decimals)],
            });
            console.log({ exeAction });

            const waitTx = await waitForTransactionReceipt(config.getClient(), { hash: exeAction });
            console.log({ waitTx });
            toast.update(idtoast, { render: 'Transaction successfull!', isLoading: false, type: 'success', autoClose: 3000, hideProgressBar: false });
            closeModal();
        } catch (error) {
            console.error(error);
            if (idtoast) {
                toast.update(idtoast, { render: <ErrorExeTransaction error={error} />, type: 'error', position: 'top-center', isLoading: false, autoClose: 4000, hideProgressBar: false });
            }
        }
    }

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

            <Box sx={{ textAlign: 'right', mt: 3 }}>
                <ButtonInvest onClick={invest} />
            </Box>
        </Box>
    );
}

function ButtonInvest({ onClick }: { onClick: () => Promise<void> }) {
    const [loading, setLoading] = useState(false);

    async function handleInvest() {
        setLoading(true);
        await onClick();
        setLoading(false);
    }

    return (
        <ButtonLoading
            muiProps={{
                variant: 'contained',
                color: 'primary',
                onClick: handleInvest,
            }}
            isLoading={loading}
        >
            Invest
        </ButtonLoading>
    );
}
