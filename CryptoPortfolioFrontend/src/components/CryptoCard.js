import React from 'react';
import { Box, Typography, IconButton, Tooltip, Card, CardContent } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CryptoCard = ({ item, crypto, handleEdit, handleDelete, formatNumber }) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" gutterBottom>{item.cryptoName}</Typography>
            <Typography variant="body1">
              Amount: {formatNumber(item.amount)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Value: {crypto && crypto.price ? `£${formatNumber(item.amount * crypto.price)}` : 'N/A'}
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
  );
};

export default CryptoCard;
