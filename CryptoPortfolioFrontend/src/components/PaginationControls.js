// src/components/PaginationControls.js

import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const PaginationControls = ({ page, handlePreviousPage, handleNextPage, hasMore, rateLimitError }) => {
    return (
        <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" color="primary" onClick={handlePreviousPage} disabled={page === 1 || rateLimitError}>
                Previous
            </Button>
            <Typography variant="body2" style={{ margin: '0 20px', alignSelf: 'center' }}>
                Page {page}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleNextPage} disabled={!hasMore || rateLimitError}>
                Next
            </Button>
        </Box>
    );
};

export default PaginationControls;
