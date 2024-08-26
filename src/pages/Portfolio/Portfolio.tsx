import {
    abiCampaign,
    abiGovernor,
    abiGovernorFactory,
    BN,
    BoxIntroducePage,
    ButtonLoading,
    Campaign,
    contractAddress,
    Course,
    ErrorExeTransaction,
    formatNumber,
    getCampaigns,
    getCourse,
    getCourses,
    IconSpinLoading,
    useSwitchToSelectedChain,
} from '@auxo-dev/frontend-common';
import { Box, Button, Container, MenuItem, Select, TextField, Typography } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { abiHelper, helperAddress } from 'src/const';
import { config } from 'src/layout';
import { Address } from 'viem';
import { readContract, waitForTransactionReceipt } from 'viem/actions';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';

export default function Portfolio() {
    const { chainIdSelected } = useSwitchToSelectedChain();
    const { address } = useAccount();
    const [courseFunded, setCourseFunded] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    async function fetchData() {
        setLoading(true);
        try {
            if (address) {
                const response = await readContract(config.getClient(), {
                    abi: abiCampaign,
                    address: contractAddress[chainIdSelected].Campaign,
                    functionName: 'investedGovernorList',
                    args: [address],
                });
                console.log(response);
                const dataCourses = await getCourses();
                console.log(dataCourses);

                setCourseFunded(dataCourses.filter((course) => response.includes(course.address)));
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [address]);

    return (
        <Container sx={{ py: 5 }}>
            <BoxIntroducePage title="Portfolio" thumnail="/images/auxo-thumbnail2.png">
                {/* <TextField size="small" label="Search..." type="text" name="search_committee" color="secondary" sx={{ mt: 3, maxWidth: '479px' }} fullWidth></TextField> */}
            </BoxIntroducePage>

            {loading ? (
                <Box>
                    <IconSpinLoading sx={{ fontSize: '100px' }} />
                </Box>
            ) : (
                <ShowCourseFunded courseFunded={courseFunded} />
            )}
        </Container>
    );
}

function ShowCourseFunded({ courseFunded }: { courseFunded: Course[] }) {
    const { address } = useAccount();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(courseFunded.length ? 0 : null);
    if (selectedIndex == null) return <></>;
    if (!address) return <></>;
    return (
        <Box>
            <Select
                value={selectedIndex}
                color="primary"
                fullWidth
                sx={{ mb: 4, maxWidth: '500px' }}
                onChange={(e) => {
                    setSelectedIndex(Number(e.target.value));
                }}
            >
                {courseFunded.map((item, index) => {
                    return (
                        <MenuItem key={index} value={index}>
                            <Typography>
                                Course ID: {item.id} - {item.name}
                            </Typography>
                        </MenuItem>
                    );
                })}
            </Select>

            {selectedIndex != null ? (
                <>
                    <ShowFundDataOfProject course={courseFunded[selectedIndex]} userAddress={address} />
                </>
            ) : (
                <Typography variant="h6">No course selected!</Typography>
            )}
        </Box>
    );
}

function ShowFundDataOfProject({ course, userAddress }: { course: Course; userAddress: Address }) {
    const { chainIdSelected } = useSwitchToSelectedChain();
    const [campaignData, setCampaignData] = useState<{ [k in string]: Campaign }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const { data, isLoading, isError } = useReadContract({
        abi: abiGovernorFactory,
        address: contractAddress[chainIdSelected].GovernorFactory,
        functionName: 'getAllToken',
        args: [course.address, userAddress],
    });

    const fetchCampaign = async () => {
        setLoading(true);
        try {
            const campaigns = await getCampaigns();
            setCampaignData((prev) => {
                const _campaigns: { [k in string]: Campaign } = campaigns.reduce((prev, campaign) => {
                    return {
                        ...prev,
                        [campaign.campaignId]: campaign,
                    };
                }, {});
                console.log(_campaigns);
                return {
                    ...prev,
                    ..._campaigns,
                };
            });
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCampaign();
    }, []);

    if (isLoading || loading) {
        return (
            <Box>
                <IconSpinLoading sx={{ fontSize: '100px' }} />
            </Box>
        );
    }
    if (isError) {
        return (
            <Box>
                <Typography variant="h6">Error fetch data investment!</Typography>
            </Box>
        );
    }
    return (
        <Box>
            {data?.[0].map((item, index) => {
                return (
                    <Box
                        key={index}
                        sx={{
                            borderRadius: '12px',
                            p: 2.5,
                            bgcolor: '#F1F6F5',
                            boxShadow: '1px 1px 3px 0px rgba(0, 0, 0, 0.20)',
                            mb: 2,
                            placeItems: 'center',
                            display: 'flex',
                            gap: 2,
                            flexWrap: 'wrap',
                        }}
                    >
                        <img src={course.avatar} alt="campaign image" style={{ width: '140px', height: '140px', borderRadius: '6px' }} />

                        <ClaimableAmount
                            amountInvest={formatNumber(Number(item.value) / (10 ** campaignData[Number(item.campaignId) + 1 + '']?.tokenFunding.decimals || 1))}
                            course={course}
                            nftId={item.id}
                            campaignName={campaignData[Number(item.campaignId) + 1 + '']?.name || Number(item.campaignId) + ' (ID)'}
                            decimals={campaignData[Number(item.campaignId) + 1 + '']?.tokenFunding.decimals || 0}
                            symbol={campaignData[Number(item.campaignId) + 1 + '']?.tokenFunding.symbol || 'Token'}
                        />
                    </Box>
                );
            })}
        </Box>
    );
}

function ClaimableAmount({
    course,
    nftId,
    campaignName,
    amountInvest,
    decimals,
    symbol,
}: {
    course: Course;
    nftId: bigint;
    campaignName: string;
    amountInvest: ReactNode;
    decimals: number;
    symbol: string;
}) {
    const { data } = useReadContract({
        abi: abiHelper,
        address: helperAddress,
        functionName: 'claimable',
        args: [course.address, nftId],
    });

    return (
        <>
            <Box>
                <Typography variant="body2">NFT: No.{Number(nftId)}</Typography>
                <Typography mt={1}>Campaign: {campaignName}</Typography>
                <Typography mt={1}>
                    Amount Invest: {amountInvest} {symbol}
                </Typography>

                <Typography mt={1}>
                    Total Claimed Revenue: {formatNumber(Number(data?.[1]) / 10 ** decimals + '' || '', { fractionDigits: 4 })} {symbol}
                </Typography>
                <Typography variant="h6" mt={1}>
                    Claimable Revenue: {formatNumber(Number(data?.[0]) / 10 ** decimals + '' || '', { fractionDigits: 4 })} {symbol}
                </Typography>
            </Box>

            {Number(data?.[0]) > 0 ? <ButtonClaim course={course} nftId={nftId} /> : <> </>}
        </>
    );
}

function ButtonClaim({ course, nftId }: { course: Course; nftId: bigint }) {
    const [loading, setLoading] = useState<boolean>(false);
    const { switchToChainSelected } = useSwitchToSelectedChain();
    const { writeContractAsync } = useWriteContract();
    async function handleClaim() {
        setLoading(true);
        try {
            await switchToChainSelected();
            const response = await writeContractAsync({
                abi: abiHelper,
                address: helperAddress,
                functionName: 'claim',
                args: [course.address, nftId],
            });
            await waitForTransactionReceipt(config.getClient(), { hash: response });
            toast.success('Claim success');
        } catch (error) {
            console.error(error);
            toast.error(<ErrorExeTransaction error={error} />);
        }
        setLoading(false);
    }

    return (
        <ButtonLoading muiProps={{ sx: { ml: 'auto' }, variant: 'text', onClick: handleClaim }} isLoading={loading}>
            Claim
        </ButtonLoading>
    );
}
