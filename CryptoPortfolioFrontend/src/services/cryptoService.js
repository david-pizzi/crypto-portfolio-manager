// src/services/cryptoService.js
import axios from 'axios';

const AZURE_FUNCTION_URL = process.env.REACT_APP_AZURE_FUNCTION_URL;
const AZURE_FUNCTION_CODE = process.env.REACT_APP_AZURE_FUNCTION_CODE;

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
