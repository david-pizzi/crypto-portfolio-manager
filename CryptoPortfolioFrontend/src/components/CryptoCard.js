import React from 'react';
import { Card, CardContent, CardMedia, CardActions, Typography, Button } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const CryptoCard = ({ item, crypto, cryptoImage, handleEdit, handleDelete, formatNumber, style }) => {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1, m: 1, width: '100%', maxWidth: 350, bgcolor: '#4791db3d', margin: '0 auto', ...style }}>
      <CardContent sx={{ flex: '1 0 auto', p: 1 }}>
        <Typography component="div" variant="h6">{crypto.symbol} ({item.cryptoName})</Typography>
        <Typography variant="body2" color="textSecondary">
          Amount: {formatNumber(item.amount)} {crypto && crypto.price ? `(£${formatNumber(item.amount * crypto.price)})` : '(N/A)'}
        </Typography>
      </CardContent>
      {cryptoImage && (
        <CardMedia sx={{ width: 80, height: 80, mt: 1 }}>
          <LazyLoadImage
            src={cryptoImage.image}
            alt={item.cryptoName}
            effect="blur"
            style={{ width: '100%', height: '100%' }}
          />
        </CardMedia>
      )}
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 1 }}>
        <Button variant="outlined" size="small" onClick={() => handleEdit(item.cryptoName)}>Edit</Button>
        <Button variant="contained" color="secondary" size="small" onClick={() => handleDelete(item.cryptoName)}>Delete</Button>
      </CardActions>
    </Card>
  );
};

export default CryptoCard;
