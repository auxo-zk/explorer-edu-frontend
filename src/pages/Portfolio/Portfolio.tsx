import { BoxIntroducePage } from '@auxo-dev/frontend-common';
import { Box, Container, TextField } from '@mui/material';

export default function Portfolio() {
    return (
        <Container sx={{ py: 5 }}>
            <BoxIntroducePage title="Portfolio" thumnail="/images/auxo-thumbnail2.png">
                <TextField size="small" label="Search..." type="text" name="search_committee" color="secondary" sx={{ mt: 3, maxWidth: '479px' }} fullWidth></TextField>
            </BoxIntroducePage>
        </Container>
    );
}
