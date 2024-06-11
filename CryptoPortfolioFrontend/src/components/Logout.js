import React from 'react';
import { Button, Typography, Container, Box } from '@mui/material';
import { useAuth0 } from "@auth0/auth0-react";

const Logout = () => {
    const { logout, isAuthenticated } = useAuth0();

    return (
        <Container>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
                <Typography variant="h4" gutterBottom>
                    Logout
                </Typography>
                <Button variant="contained" color="primary" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                    Logout
                </Button>
            </Box>
        </Container>
    );
};

export default Logout;
