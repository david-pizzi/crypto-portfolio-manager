// src/components/PortfolioOverview.js

import React from 'react';
import { Box, Typography, Card, CardContent, Grid, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PortfolioOverview = ({ portfolioData, cryptoData, handleEdit, handleDelete, formatNumber }) => {
  const totalBalance = portfolioData.reduce((total, item) => {
    const crypto = cryptoData.find(crypto => crypto.name === item.cryptoName);
    return total + (item.amount * (crypto ? crypto.current_price : 0));
  }, 0);

  return (
    <Box p={2} mb={3} bgcolor="background.paper" borderRadius={2}>
      <Box mt={3} p={2} mb={3} bgcolor="background.paper" borderRadius={2} textAlign="center" boxShadow={3}>
        <Typography variant="h4">Total Balance</Typography>
        <Typography variant="h2" color="primary" fontWeight="bold">£{formatNumber(totalBalance)}</Typography>
      </Box>
      <Grid container spacing={2}>
        {portfolioData.map(item => {
          const crypto = cryptoData.find(crypto => crypto.name === item.cryptoName);
          return (
            <Grid item xs={12} md={6} lg={4} key={item.cryptoName}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6" gutterBottom>{item.cryptoName}</Typography>
                      <Typography variant="body1">
                        Amount: {formatNumber(item.amount)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Value: {crypto ? `£${formatNumber(item.amount * crypto.current_price)}` : 'N/A'}
                      </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Tooltip title="Edit" arrow>
                        <IconButton 
                          color="primary" 
                          size="small" 
                          onClick={() => handleEdit(item.cryptoName)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton 
                          color="secondary" 
                          size="small" 
                          onClick={() => handleDelete(item.cryptoName)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default PortfolioOverview;
