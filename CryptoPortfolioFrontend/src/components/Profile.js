// src/components/Profile.js

import React from 'react';
import { Typography, Card, CardContent, Avatar } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
    const { user, isAuthenticated } = useAuth0();

    if (!isAuthenticated) {
        return <div>Please log in to view your profile.</div>;
    }

    return (
        <Card>
            <CardContent>
                <Avatar alt={user.name} src={user.picture} style={{ width: 100, height: 100, margin: 'auto' }} />
                <Typography variant="h5" component="div" align="center" style={{ marginTop: 20 }}>
                    {user.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center">
                    {user.email}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Profile;
