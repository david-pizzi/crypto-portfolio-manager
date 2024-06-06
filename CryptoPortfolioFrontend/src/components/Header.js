// src/components/Header.js

import React from 'react';
import { Typography } from '@mui/material';

const Header = ({ error, rateLimitError, refreshTime }) => {
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Cryptocurrency Dashboard
            </Typography>
            {error && (
                <Typography variant="body2" color="error" gutterBottom>
                    {error}
                </Typography>
            )}
            {rateLimitError && (
                <Typography variant="body2" color="error" gutterBottom>
                    Too many requests. Please wait for 10 seconds.
                </Typography>
            )}
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Data will refresh in {refreshTime} seconds
            </Typography>
        </div>
    );
};

export default Header;
