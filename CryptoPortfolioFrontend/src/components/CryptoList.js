// src/components/CryptoList.js

import React from 'react';
import { Grid } from '@mui/material';
import CryptoCard from './CryptoCard';

const CryptoList = ({ cryptoData, portfolioData, handleAddOrEdit, handleDelete, isAuthenticated }) => {
    return (
        <Grid container spacing={2}>
            {cryptoData.map((crypto) => {
                const portfolioItem = portfolioData.find(item => item.cryptoName === crypto.name);
                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={crypto.id}>
                        <CryptoCard
                            crypto={crypto}
                            portfolioItem={portfolioItem}
                            handleAddOrEdit={handleAddOrEdit}
                            handleDelete={handleDelete}
                            isAuthenticated={isAuthenticated}
                        />
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default CryptoList;
