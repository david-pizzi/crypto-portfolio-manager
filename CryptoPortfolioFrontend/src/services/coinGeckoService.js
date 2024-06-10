// src/services/coinGeckoService.js

import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export const getCryptoData = async (page = 1, perPage = 25) => {
    try {
        const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
            params: {
                vs_currency: 'gbp',
                order: 'market_cap_desc',
                per_page: perPage,
                page: page,
                sparkline: false
            }
        });

        return {
            data: response.data,
            hasMore: response.data.length === perPage // Determines if there's potentially another page
        };
    } catch (error) {
        if (error.response && error.response.status === 429) {
            throw new Error('Too many requests. Please wait for a while before trying again.');
        }
        console.error('Error fetching data from CoinGecko API', error);
        throw error;
    }
};
