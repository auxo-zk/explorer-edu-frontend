import { Course } from '@auxo-dev/frontend-common';
import { Box } from '@mui/material';
import LeftBox from './LeftBox/LeftBox';
import RightBox from './RightBox/RightBox';

export default function Overview({ data }: { data: Course }) {
    return (
        <Box sx={{ display: 'flex', gap: 3.5, mt: 3 }}>
            <LeftBox data={data} />
            <RightBox data={data} />
        </Box>
    );
}
