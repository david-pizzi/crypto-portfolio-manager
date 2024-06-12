import React from 'react';
import { Box, Grid } from '@mui/material';
import CryptoCard from './CryptoCard'; // Import the CryptoCard component

const PortfolioOverview = ({ portfolioData, cryptoData, handleEdit, handleDelete, formatNumber }) => {
  return (
    <Box p={2} mb={3} bgcolor="background.paper" borderRadius={2}>
      <Grid container spacing={2}>
        {portfolioData.map(item => {
          const crypto = cryptoData.find(crypto => crypto.name === item.cryptoName);
          return (
            <Grid item xs={12} md={6} lg={4} key={item.cryptoName}>
              <CryptoCard
                item={item}
                crypto={crypto}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                formatNumber={formatNumber}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default PortfolioOverview;
