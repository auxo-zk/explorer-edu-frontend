import { abiCampaign, BoxIntroducePage, contractAddress, Course, getCourse, getCourses, useSwitchToSelectedChain } from '@auxo-dev/frontend-common';
import { Box, Container, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { config } from 'src/layout';
import { readContract } from 'viem/actions';
import { useAccount } from 'wagmi';

export default function Portfolio() {
    const { chainIdSelected } = useSwitchToSelectedChain();
    const { address } = useAccount();
    const [courseFunded, setCourseFunded] = useState<Course[]>([]);
    async function fetchData() {
        try {
            if (address) {
                const response = await readContract(config.getClient(), {
                    abi: abiCampaign,
                    address: contractAddress[chainIdSelected].Campaign,
                    functionName: 'investedGovernorList',
                    args: [address],
                });
                console.log(response);
                const dataCourses = (await getCourses()).filter((course) => response.includes(course.address));
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [address]);

    return (
        <Container sx={{ py: 5 }}>
            <BoxIntroducePage title="Portfolio" thumnail="/images/auxo-thumbnail2.png">
                <TextField size="small" label="Search..." type="text" name="search_committee" color="secondary" sx={{ mt: 3, maxWidth: '479px' }} fullWidth></TextField>
            </BoxIntroducePage>
        </Container>
    );
}
