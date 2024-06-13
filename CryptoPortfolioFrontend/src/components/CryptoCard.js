import React from 'react';
import { Box, Typography, IconButton, Tooltip, Card, CardContent, CardMedia, CardActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const CryptoCard = ({ item, crypto, cryptoImage, handleEdit, handleDelete, formatNumber }) => {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 1, m: 1, maxWidth: 350 }}>
      {cryptoImage && (
        <CardMedia sx={{ width: 75, height: 75, mr: 2 }}>
          <LazyLoadImage
            src={cryptoImage.image}
            alt={item.cryptoName}
            effect="blur"
            style={{ width: '75px', height: '75px' }}
          />
        </CardMedia>
      )}
      <CardContent sx={{ flex: '1 0 auto', p: 0 }}>
        <Typography component="div" variant="h6" sx={{ width: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {crypto.symbol} ({item.cryptoName})
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Amount: {formatNumber(item.amount)} {crypto && crypto.price ? `(£${formatNumber(item.amount * crypto.price)})` : '(N/A)'}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0 }}>
        <Tooltip title="Edit" arrow>
          <IconButton color="primary" size="small" onClick={() => handleEdit(item.cryptoName)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete" arrow>
          <IconButton color="secondary" size="small" onClick={() => handleDelete(item.cryptoName)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default CryptoCard;
