import React from 'react';
import { Box } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CryptoCard from './CryptoCard'; // Import the CryptoCard component

const PortfolioOverview = ({ portfolioData, cryptoData, cryptoImages, handleEdit, handleDelete, formatNumber }) => {
  return (
    <Box p={2} mb={3} bgcolor="background.paper" borderRadius={2} sx={{ maxWidth: '100%', overflow: 'hidden' }}>
      <Carousel
        showThumbs
        showIndicators
        infiniteLoop
        centerMode
        autoPlay
        centerSlidePercentage={33}
        emulateTouch
      >
        {portfolioData.map(item => {
          const crypto = cryptoData.find(crypto => crypto.name.toLowerCase() === item.cryptoName.toLowerCase());
          const cryptoImage = cryptoImages.find(img => img.symbol.toLowerCase() === item.cryptoName.toLowerCase());
          return (
            <div key={item.cryptoName} style={{ padding: '0 15px', boxSizing: 'border-box' }}>
              <CryptoCard
                item={item}
                crypto={crypto}
                cryptoImage={cryptoImage}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                formatNumber={formatNumber}
                style={{ maxWidth: '100%' }}
              />
            </div>
          );
        })}
      </Carousel>
    </Box>
  );
};

export default PortfolioOverview;
