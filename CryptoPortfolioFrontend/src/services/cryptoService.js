// src/services/cryptoService.js
import config from '../config';
import axios from 'axios';

const AZURE_FUNCTION_URL = config.REACT_APP_AZURE_FUNCTION_URL;
const AZURE_FUNCTION_CODE = config.REACT_APP_AZURE_FUNCTION_CODE;
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export const getCryptoData = async () => {
    try {
        const response = await axios.get(`${AZURE_FUNCTION_URL}/GetCryptoData?code=${AZURE_FUNCTION_CODE}`);
        return {
            data: response.data,
            hasMore: false // Assuming the Azure function returns all necessary data
        };
    } catch (error) {
        console.error('Error fetching data from Azure function', error);
        throw error;
    }
};

export const getCryptoHistory = async (coinId) => {
    try {
        const response = await axios.get(`${AZURE_FUNCTION_URL}/GetCryptoHistory/${coinId}?code=${AZURE_FUNCTION_CODE}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching crypto history', error);
        throw error;
    }
};

export const getCryptoImages = async () => {
    try {
        const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
            params: {
                vs_currency: 'GBP',
            }
        });
        return response.data.map(crypto => ({
            id: crypto.id,
            name: crypto.name,
            symbol: crypto.symbol,
            image: crypto.image
        }));
    } catch (error) {
        console.error('Error fetching data from CoinGecko API', error);
        throw error;
    }
};
