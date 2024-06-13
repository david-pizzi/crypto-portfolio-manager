import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import CryptoDashboardView from './CryptoDashboardView';
import { getCryptoData, getCryptoHistory, getCryptoImages } from '../services/cryptoService';

const CryptoDashboard = () => {
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    const [cryptoData, setCryptoData] = useState([]);
    const [portfolioData, setPortfolioData] = useState([]);
    const [cryptoHistory, setCryptoHistory] = useState({});
    const [cryptoImages, setCryptoImages] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [currentCrypto, setCurrentCrypto] = useState(null);
    const [error, setError] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [cryptoToDelete, setCryptoToDelete] = useState(null);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getCryptoData();
                const images = await getCryptoImages();
                setCryptoData(data);
                setCryptoImages(images);
            } catch (error) {
                console.error('Error fetching crypto data', error);
                setError('Error while fetching data...');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

    useEffect(() => {
        const fetchHistoryData = async () => {
            const historyData = {};
            for (const crypto of cryptoData) {
                historyData[crypto.coinId] = await getCryptoHistory(crypto.coinId);
            }
            setCryptoHistory(historyData);
        };

        if (cryptoData.length > 0) {
            fetchHistoryData();
        }
    }, [cryptoData]);

    const handleAddOrEdit = (cryptoName) => {
        const crypto = cryptoData.find(c => c.name.toLowerCase() === cryptoName.toLowerCase());
        setCurrentCrypto(crypto);
        const existingItem = portfolioData.find(item => item.cryptoName.toLowerCase() === cryptoName.toLowerCase());
        setAmount(existingItem ? existingItem.amount : "");
        setModalOpen(true);
    };

    const handleModalSubmit = async () => {
        if (parseFloat(amount) <= 0) {
            alert("Amount must be greater than 0");
            return;
        }

        setConfirmDialogOpen(true);
    };

    const handleConfirmEdit = async () => {
        const token = await getAccessTokenSilently();
        const existingItem = portfolioData.find(item => item.cryptoName.toLowerCase() === currentCrypto.name.toLowerCase());
        const method = existingItem ? 'PUT' : 'POST';
        const url = existingItem
            ? `${process.env.REACT_APP_API_BASE_URL}/api/portfolio/${existingItem.id}`
            : `${process.env.REACT_APP_API_BASE_URL}/api/portfolio`;

        const body = JSON.stringify({
            cryptoName: currentCrypto.name,
            amount: parseFloat(amount),
            purchasePrice: parseFloat(currentCrypto.price),
            userId: user.sub,
        });

        try {
            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body,
            });

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/portfolio`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedPortfolio = await response.json();
            setPortfolioData(updatedPortfolio);

            setModalOpen(false);
            setCurrentCrypto(null);
        } catch (error) {
            console.error('Error adding or editing portfolio item', error);
        }

        setConfirmDialogOpen(false);
    };

    const handleDelete = (cryptoName) => {
        const crypto = cryptoData.find(c => c.name.toLowerCase() === cryptoName.toLowerCase());
        setCryptoToDelete(crypto);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        const token = await getAccessTokenSilently();
        const existingItem = portfolioData.find(item => item.cryptoName.toLowerCase() === cryptoToDelete.name.toLowerCase());

        if (!existingItem) return;

        try {
            await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/portfolio/${existingItem.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/portfolio`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedPortfolio = await response.json();
            setPortfolioData(updatedPortfolio);
        } catch (error) {
            console.error('Error deleting portfolio item', error);
        }

        setDeleteDialogOpen(false);
    };

    const handleSelect = (crypto) => {
        const portfolioItem = portfolioData.find(item => item.cryptoName.toLowerCase() === crypto.name.toLowerCase());
        setSelectedCrypto({ ...crypto, portfolioItem });
    };

    const formatNumber = (num) => {
        return num !== undefined && num !== null
            ? num.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : '0.00';
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <CryptoDashboardView
            error={error}
            portfolioData={portfolioData}
            cryptoData={cryptoData}
            cryptoHistory={cryptoHistory}
            cryptoImages={cryptoImages}
            handleAddOrEdit={handleAddOrEdit}
            handleDelete={handleDelete}
            handleSelect={handleSelect}
            isAuthenticated={isAuthenticated}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            handleModalSubmit={handleModalSubmit}
            currentCrypto={currentCrypto}
            amount={amount}
            setAmount={setAmount}
            confirmDialogOpen={confirmDialogOpen}
            setConfirmDialogOpen={setConfirmDialogOpen}
            handleConfirmEdit={handleConfirmEdit}
            deleteDialogOpen={deleteDialogOpen}
            setDeleteDialogOpen={setDeleteDialogOpen}
            handleConfirmDelete={handleConfirmDelete}
            cryptoToDelete={cryptoToDelete}
            formatNumber={formatNumber}
        />
    );
};

export default CryptoDashboard;
