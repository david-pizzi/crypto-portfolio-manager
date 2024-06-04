// src/services/coinGeckoService.js

import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export const getCryptoData = async (page = 1, perPage = 10) => {
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
            total: response.headers['x-total-count'] || 0 // This may vary depending on the API's response headers
        };
    } catch (error) {
        console.error('Error fetching data from CoinGecko API', error);
        throw error;
    }
};
