import { BoxIntroducePage, CardCourse, Course, getCourses, IconSpinLoading, NoData } from '@auxo-dev/frontend-common';
import { Box, Container, Grid, TextField } from '@mui/material';
import React, { useEffect } from 'react';

export default function ListCourses() {
    const [courses, setCourses] = React.useState<Course[]>([]);
    const [loading, setLoading] = React.useState(false);

    async function fetchCourses() {
        setLoading(true);
        try {
            const response = await getCourses();
            console.log(response);
            setCourses(response);
        } catch (error) {
            console.error(error);
            setCourses([]);
        }
        setLoading(false);
    }
    useEffect(() => {
        fetchCourses();
    }, []);
    return (
        <Container sx={{ py: 5 }}>
            <BoxIntroducePage title="Explore courses" thumnail="/images/auxo-thumbnail1.png">
                <TextField size="small" label="Search..." type="text" name="search_committee" color="secondary" sx={{ mt: 3, maxWidth: '479px' }} fullWidth></TextField>
            </BoxIntroducePage>

            <Box mt={5}>
                {loading ? (
                    <IconSpinLoading sx={{ fontSize: '100px' }} />
                ) : (
                    <>
                        {courses.length === 0 ? (
                            <NoData />
                        ) : (
                            <>
                                <Grid container spacing={2} mt={1}>
                                    {courses.map((course, index) => {
                                        return (
                                            <Grid key={course.id + index} item xs={12} xsm={6} sm={4} lg={3}>
                                                <CardCourse data={course} toLink={'/courses/' + course.id}></CardCourse>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </>
                        )}
                    </>
                )}
            </Box>
        </Container>
    );
}
