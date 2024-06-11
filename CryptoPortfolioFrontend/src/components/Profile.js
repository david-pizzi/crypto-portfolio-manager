import React from 'react';
import { Typography, Card, CardContent, Avatar, Box } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
    const { user, isAuthenticated } = useAuth0();

    if (!isAuthenticated) {
        return <div>Please log in to view your profile.</div>;
    }

    return (
        <Card sx={{ maxWidth: 400, margin: 'auto', mt: 5 }}>
            <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar alt={user.name} src={user.picture} sx={{ width: 100, height: 100 }} />
                    <Typography variant="h5" component="div" align="center" sx={{ mt: 2 }}>
                        {user.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" align="center">
                        {user.email}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Profile;
