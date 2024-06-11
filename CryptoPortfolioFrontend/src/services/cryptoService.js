// src/services/cryptoService.js

import axios from 'axios';

const AZURE_FUNCTION_URL = process.env.REACT_APP_AZURE_FUNCTION_URL;

export const getCryptoData = async () => {
    try {
        const response = await axios.get(AZURE_FUNCTION_URL);
        return {
            data: response.data,
            hasMore: false // Assuming the Azure function returns all necessary data
        };
    } catch (error) {
        console.error('Error fetching data from Azure function', error);
        throw error;
    }
};
