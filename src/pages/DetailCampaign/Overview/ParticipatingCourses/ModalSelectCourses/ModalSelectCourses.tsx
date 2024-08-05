import { Course, getCourses, IconSpinLoading, useModalFunction } from '@auxo-dev/frontend-common';
import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

export default function ModalSelectCourses() {
    const [projectSelected, setCourseSelected] = useState<string | null>(null);
    const [listCourses, setListCourse] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { address } = useAccount();
    const { closeModal } = useModalFunction();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const res = await getCourses(address);
                setListCourse(res);
            } catch (error) {}
            setLoading(false);
        };
        fetchCourses();
    }, [address]);
    return (
        <Box>
            <Typography variant="body1" mb={3}>
                {`Select a project to apply for this fundraising campaignYou will be required to provide answers to the organizer's questions to complete the application process`}
            </Typography>

            {loading ? (
                <IconSpinLoading sx={{ fontSize: '100px' }} />
            ) : (
                <>
                    <Autocomplete
                        options={listCourses.map((pj) => ({ label: pj.name, value: pj.id }))}
                        renderInput={(params) => <TextField {...params} color="secondary" placeholder="Select project" />}
                        onChange={(e, value) => setCourseSelected(value?.value || null)}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, justifyContent: 'flex-end' }}>
                        <Button
                            disabled={!projectSelected}
                            variant="contained"
                            onClick={() => {
                                closeModal();
                                navigate('#');
                            }}
                        >
                            Continue
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
}
