// src/components/PortfolioOverview.js

import React from 'react';
import { Box, Typography } from '@mui/material';

const PortfolioOverview = ({ portfolioData, cryptoData }) => {
  const totalBalance = portfolioData.reduce((total, item) => {
    const crypto = cryptoData.find(crypto => crypto.name === item.cryptoName);
    return total + (item.amount * (crypto ? crypto.current_price : 0));
  }, 0);

  return (
    <Box p={2} mb={3} bgcolor="background.paper" borderRadius={2}>
      <Typography variant="h5" gutterBottom>Portfolio Overview</Typography>
      {portfolioData.map(item => {
        const crypto = cryptoData.find(crypto => crypto.name === item.cryptoName);
        return (
          <Typography key={item.cryptoName} variant="body1">
            {item.cryptoName}: {item.amount} ({crypto ? `£${(item.amount * crypto.current_price).toFixed(2)}` : 'N/A'})
          </Typography>
        );
      })}
      <Typography variant="h6" mt={2}>Total Balance: £{totalBalance.toFixed(2)}</Typography>
    </Box>
  );
};

export default PortfolioOverview;
