import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PortfolioOverview from './PortfolioOverview';
import ModalForm from './ModalForm';
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

  return (
    <Box p={3}>
      <Typography variant="h3" gutterBottom>Dashboard</Typography>
      {error && (
        <Typography variant="body2" color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <PortfolioOverview 
        portfolioData={portfolioData} 
        cryptoData={cryptoData} 
        handleEdit={handleAddOrEdit} 
        handleDelete={handleDelete} 
      />
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
                              onClick={(e) => { e.stopPropagation(); handleAddOrEdit(crypto.name); }}
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
        amount={amount}
        setAmount={setAmount}
      />
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Edit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update {currentCrypto?.name} in your portfolio?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmEdit} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {cryptoToDelete?.name} from your portfolio?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CryptoDashboard;
