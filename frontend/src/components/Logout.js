// src/components/Logout.js

import React from 'react';
import { Button, Typography, Container } from '@mui/material';
import { useAuth0 } from "@auth0/auth0-react";

const Logout = () => {
    const { logout, isAuthenticated } = useAuth0();

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Logout
            </Typography>
            <Button variant="contained" color="primary" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                Logout
            </Button>
        </Container>
    );
};

export default Logout;
