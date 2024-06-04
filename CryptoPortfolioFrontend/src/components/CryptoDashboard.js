// src/components/CryptoDashboard.js

import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, CardContent, Typography, Grid, Button, Modal, TextField, Box, Pagination } from '@mui/material';
import { getCryptoData } from '../services/coinGeckoService';

const CryptoDashboard = () => {
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    const [cryptoData, setCryptoData] = useState([]);
    const [portfolioData, setPortfolioData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [amount, setAmount] = useState("");
    const [purchasePrice, setPurchasePrice] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [refreshTime, setRefreshTime] = useState(30);
    const [error, setError] = useState(null);
    const perPage = 10;

    // Fetch crypto data on mount and page change
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, total } = await getCryptoData(page, perPage);
                setCryptoData(data);
                setTotal(total);
                setRefreshTime(30); // Reset refresh timer
                setError(null); // Clear any previous errors
            } catch (error) {
                console.error('Error fetching crypto data', error);
                setError('Error while fetching data...');
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Fetch every 30 seconds
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [page]);

    // Countdown timer for refresh
    useEffect(() => {
        if (refreshTime > 0) {
            const timer = setTimeout(() => setRefreshTime(refreshTime - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [refreshTime]);

    // Fetch portfolio data if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const fetchPortfolio = async () => {
                try {
                    const token = await getAccessTokenSilently();
                    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/portfolio`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    setPortfolioData(data);
                } catch (error) {
                    console.error('Error fetching portfolio data', error);
                }
            };

            fetchPortfolio();
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    // Open modal to add or edit portfolio item
    const handleAddOrEdit = (crypto) => {
        setSelectedCrypto(crypto);
        const existingItem = portfolioData.find(item => item.cryptoName === crypto.name);
        if (existingItem) {
            setAmount(existingItem.amount);
            setPurchasePrice(existingItem.purchasePrice);
            setEditingId(existingItem.id);
        } else {
            setAmount("");
            setPurchasePrice(crypto.current_price);
            setEditingId(null);
        }
        setModalOpen(true);
    };

    // Handle form submission to add or edit portfolio item
    const handleSubmit = async () => {
        if (selectedCrypto) {
            try {
                const token = await getAccessTokenSilently();
                const method = editingId ? 'PUT' : 'POST';
                const url = editingId
                    ? `${process.env.REACT_APP_API_BASE_URL}/api/portfolio/${editingId}`
                    : `${process.env.REACT_APP_API_BASE_URL}/api/portfolio`;
                const body = JSON.stringify({
                    cryptoName: selectedCrypto.name,
                    amount: parseFloat(amount),
                    purchasePrice: parseFloat(purchasePrice),
                    userId: user.sub,
                });

                await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body,
                });

                // Update portfolio data
                const updatedPortfolio = await fetchPortfolioData(token);
                setPortfolioData(updatedPortfolio);

                // Close modal and reset form
                setModalOpen(false);
                setAmount("");
                setPurchasePrice("");
                setSelectedCrypto(null);
                setEditingId(null);
            } catch (error) {
                console.error('Error adding or editing portfolio item', error);
            }
        }
    };

    // Fetch updated portfolio data
    const fetchPortfolioData = async (token) => {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/portfolio`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return await response.json();
    };

    // Handle delete portfolio item
    const handleDelete = async (id) => {
        try {
            const token = await getAccessTokenSilently();
            await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/portfolio/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Update portfolio data
            const updatedPortfolio = await fetchPortfolioData(token);
            setPortfolioData(updatedPortfolio);
        } catch (error) {
            console.error('Error deleting portfolio item', error);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Cryptocurrency Dashboard
            </Typography>
            {error && (
                <Typography variant="body2" color="error" gutterBottom>
                    {error}
                </Typography>
            )}
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Data will refresh in {refreshTime} seconds
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
                                    £{crypto.current_price}
                                </Typography>
                                {isAuthenticated && (
                                    <div>
                                        <Typography variant="body2" color="textSecondary">
                                            Portfolio: {portfolioData.find(item => item.cryptoName === crypto.name)?.amount || 0}
                                        </Typography>
                                        <Button variant="contained" color="primary" onClick={() => handleAddOrEdit(crypto)}>
                                            {portfolioData.find(item => item.cryptoName === crypto.name) ? "Edit Portfolio" : "Add to Portfolio"}
                                        </Button>
                                        {portfolioData.find(item => item.cryptoName === crypto.name) && (
                                            <Button variant="contained" color="secondary" onClick={() => handleDelete(portfolioData.find(item => item.cryptoName === crypto.name).id)}>
                                                Delete from Portfolio
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                    count={Math.ceil(total / perPage)}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                />
            </Box>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box sx={{ padding: '20px', background: 'white', margin: '100px auto', maxWidth: '400px', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                        {editingId ? `Edit ${selectedCrypto?.name} in Portfolio` : `Add ${selectedCrypto?.name} to Portfolio`}
                    </Typography>
                    <TextField
                        label="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label={`Purchase Price (in GBP)`}
                        value={purchasePrice}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        {editingId ? "Update Portfolio" : "Add to Portfolio"}
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default CryptoDashboard;
