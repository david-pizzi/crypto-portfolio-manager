// src/components/CryptoDashboard.js

import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { getCryptoData } from '../services/coinGeckoService';

const CryptoDashboard = () => {
    const [cryptoData, setCryptoData] = useState([]);

    // Fetch cryptocurrency data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCryptoData();
                setCryptoData(data);
            } catch (error) {
                console.error('Error fetching crypto data', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Cryptocurrency Dashboard
            </Typography>
            <Grid container spacing={3}>
                {cryptoData.map((crypto) => (
                    <Grid item xs={12} sm={6} md={4} key={crypto.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {crypto.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    ${crypto.current_price}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default CryptoDashboard;
