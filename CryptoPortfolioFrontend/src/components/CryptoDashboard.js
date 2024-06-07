// src/components/CryptoDashboard.js

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import CryptoDashboardView from './CryptoDashboardView';
import { getCryptoData } from '../services/coinGeckoService';

const CryptoDashboard = () => {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [cryptoData, setCryptoData] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [currentCrypto, setCurrentCrypto] = useState(null);
  const [error, setError] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cryptoToDelete, setCryptoToDelete] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getCryptoData();
        setCryptoData(data);
      } catch (error) {
        console.error('Error fetching crypto data', error);
        setError('Error while fetching data...');
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

  const handleAddOrEdit = (cryptoName) => {
    const crypto = cryptoData.find(c => c.name === cryptoName);
    setCurrentCrypto(crypto);
    const existingItem = portfolioData.find(item => item.cryptoName === cryptoName);
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
    const existingItem = portfolioData.find(item => item.cryptoName === currentCrypto.name);
    const method = existingItem ? 'PUT' : 'POST';
    const url = existingItem
      ? `${process.env.REACT_APP_API_BASE_URL}/api/portfolio/${existingItem.id}`
      : `${process.env.REACT_APP_API_BASE_URL}/api/portfolio`;

    const body = JSON.stringify({
      cryptoName: currentCrypto.name,
      amount: parseFloat(amount),
      purchasePrice: parseFloat(currentCrypto.current_price),
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

      // Fetch updated portfolio data
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/portfolio`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedPortfolio = await response.json();
      setPortfolioData(updatedPortfolio);

      // Close modal and reset form
      setModalOpen(false);
      setCurrentCrypto(null);
    } catch (error) {
      console.error('Error adding or editing portfolio item', error);
    }

    setConfirmDialogOpen(false);
  };

  const handleDelete = (cryptoName) => {
    const crypto = cryptoData.find(c => c.name === cryptoName);
    setCryptoToDelete(crypto);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    const token = await getAccessTokenSilently();
    const existingItem = portfolioData.find(item => item.cryptoName === cryptoToDelete.name);

    if (!existingItem) return;

    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/portfolio/${existingItem.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Fetch updated portfolio data
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
    const portfolioItem = portfolioData.find(item => item.cryptoName === crypto.name);
    setSelectedCrypto({ ...crypto, portfolioItem });
  };

  const formatNumber = (num) => {
    return num.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <CryptoDashboardView
      error={error}
      portfolioData={portfolioData}
      cryptoData={cryptoData}
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
