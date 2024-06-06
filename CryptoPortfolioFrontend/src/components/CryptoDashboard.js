// src/components/CryptoDashboard.js

import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getCryptoData } from '../services/coinGeckoService';
import CryptoList from './CryptoList';
import PaginationControls from './PaginationControls';
import ModalForm from './ModalForm';
import Header from './Header';

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
    const [hasMore, setHasMore] = useState(false);
    const [refreshTime, setRefreshTime] = useState(30);
    const [error, setError] = useState(null);
    const [rateLimitError, setRateLimitError] = useState(false);
    const perPage = 25;

    // Fetch crypto data on mount and page change
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, hasMore } = await getCryptoData(page, perPage);
                setCryptoData(data);
                setHasMore(hasMore);
                setRefreshTime(30); // Reset refresh timer
                setError(null); // Clear any previous errors
            } catch (error) {
                if (error.message.includes('Too many requests')) {
                    setRateLimitError(true);
                    setTimeout(() => setRateLimitError(false), 10000);
                } else {
                    console.error('Error fetching crypto data', error);
                    setError('Error while fetching data...');
                }
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

    const handleNextPage = () => {
        if (hasMore && !rateLimitError) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1 && !rateLimitError) {
            setPage(page - 1);
        }
    };

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
            <Header error={error} rateLimitError={rateLimitError} refreshTime={refreshTime} />
            <CryptoList
                cryptoData={cryptoData}
                portfolioData={portfolioData}
                handleAddOrEdit={handleAddOrEdit}
                handleDelete={handleDelete}
                isAuthenticated={isAuthenticated}
            />
            <PaginationControls
                page={page}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
                hasMore={hasMore}
                rateLimitError={rateLimitError}
            />
            <ModalForm
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                selectedCrypto={selectedCrypto}
                amount={amount}
                setAmount={setAmount}
                purchasePrice={purchasePrice}
                handleSubmit={handleSubmit}
                editingId={editingId}
            />
        </div>
    );
};

export default CryptoDashboard;
