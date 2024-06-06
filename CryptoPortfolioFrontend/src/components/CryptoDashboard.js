// src/components/CryptoDashboard.js

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PortfolioOverview from './PortfolioOverview';
import ModalForm from './ModalForm';
import { getCryptoData } from '../services/coinGeckoService';

const CryptoDashboard = () => {
  const { user, isAuthenticated } = useAuth0();
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [portfolioData, setPortfolioData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCrypto, setCurrentCrypto] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getCryptoData();
      setCryptoData(data);
    };
    fetchData();
  }, []);

  const handleAddOrEdit = (crypto) => {
    setCurrentCrypto(crypto);
    setModalOpen(true);
  };

  const handleModalSubmit = (crypto, amount) => {
    const existingItem = portfolioData.find(item => item.cryptoName === crypto.name);
    if (existingItem) {
      // Edit existing item logic
      const updatedPortfolio = portfolioData.map(item =>
        item.cryptoName === crypto.name ? { ...item, amount } : item
      );
      setPortfolioData(updatedPortfolio);
    } else {
      // Add new item logic
      const newItem = { cryptoName: crypto.name, amount };
      setPortfolioData([...portfolioData, newItem]);
    }
  };

  const handleDelete = (cryptoName) => {
    const updatedPortfolio = portfolioData.filter(item => item.cryptoName !== cryptoName);
    setPortfolioData(updatedPortfolio);
  };

  const handleSelect = (crypto) => {
    const portfolioItem = portfolioData.find(item => item.cryptoName === crypto.name);
    setSelectedCrypto({ ...crypto, portfolioItem });
  };

  return (
    <Box p={3}>
      <Typography variant="h3" gutterBottom>Dashboard</Typography>
      <PortfolioOverview portfolioData={portfolioData} cryptoData={cryptoData} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cryptoData.map((crypto) => {
              const portfolioItem = portfolioData.find(item => item.cryptoName === crypto.name);
              return (
                <TableRow key={crypto.id} onClick={() => handleSelect(crypto)} style={{ cursor: 'pointer' }}>
                  <TableCell>
                    <Typography variant="h6">{crypto.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">£{crypto.current_price.toFixed(2)}</Typography>
                  </TableCell>
                  <TableCell>
                    {isAuthenticated && (
                      <Typography variant="body2">
                        {portfolioItem ? `${portfolioItem.amount} (${(portfolioItem.amount * crypto.current_price).toFixed(2)} GBP)` : '0'}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {isAuthenticated && (
                      <Box display="flex" alignItems="center">
                        <Tooltip title="Edit Portfolio" arrow>
                          <span>
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={(e) => { e.stopPropagation(); handleAddOrEdit(crypto); }}
                              aria-label="Edit Portfolio"
                            >
                              <EditIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Delete from Portfolio" arrow>
                          <span>
                            <IconButton
                              color="secondary"
                              size="small"
                              onClick={(e) => { e.stopPropagation(); handleDelete(crypto.name); }}
                              aria-label="Delete from Portfolio"
                              disabled={!portfolioItem}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ModalForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        crypto={currentCrypto}
        portfolioItem={portfolioData.find(item => item.cryptoName === currentCrypto?.name)}
      />
    </Box>
  );
};

export default CryptoDashboard;
