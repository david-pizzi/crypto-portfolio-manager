import React from 'react';
import { Box, Typography, Card, CardContent, Grid, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PortfolioOverview = ({ portfolioData, cryptoData, handleEdit, handleDelete }) => {
  const totalBalance = portfolioData.reduce((total, item) => {
    const crypto = cryptoData.find(crypto => crypto.name === item.cryptoName);
    return total + (item.amount * (crypto ? crypto.current_price : 0));
  }, 0);

  return (
    <Box p={2} mb={3} bgcolor="background.paper" borderRadius={2}>
      <Typography variant="h4" gutterBottom>Portfolio Overview</Typography>
      <Grid container spacing={2}>
        {portfolioData.map(item => {
          const crypto = cryptoData.find(crypto => crypto.name === item.cryptoName);
          return (
            <Grid item xs={12} md={6} lg={4} key={item.cryptoName}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{item.cryptoName}</Typography>
                  <Typography variant="body1">
                    Amount: {item.amount}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Value: {crypto ? `£${(item.amount * crypto.current_price).toFixed(2)}` : 'N/A'}
                  </Typography>
                  <Box display="flex" justifyContent="flex-end" mt={2}>
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
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Typography variant="h5" mt={3}>Total Balance: £{totalBalance.toFixed(2)}</Typography>
    </Box>
  );
};

export default PortfolioOverview;
