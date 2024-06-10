// src/components/CryptoDashboardView.js

import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PortfolioOverview from './PortfolioOverview';
import ModalForm from './ModalForm';

const CryptoDashboardView = ({
  error,
  portfolioData,
  cryptoData,
  handleAddOrEdit,
  handleDelete,
  handleSelect,
  isAuthenticated,
  modalOpen,
  setModalOpen,
  handleModalSubmit,
  currentCrypto,
  amount,
  setAmount,
  confirmDialogOpen,
  setConfirmDialogOpen,
  handleConfirmEdit,
  deleteDialogOpen,
  setDeleteDialogOpen,
  handleConfirmDelete,
  cryptoToDelete,
  formatNumber
}) => {
  return (
    <Box p={3}>
      <Typography variant="h3" gutterBottom align="left">Dashboard</Typography>
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
        formatNumber={formatNumber}
      />
      <Typography variant="h4" gutterBottom align="left">Cryptocurrencies</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Volume (Balance)</TableCell>
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
                    <Typography variant="body2">£{formatNumber(crypto.current_price)}</Typography>
                  </TableCell>
                  <TableCell>
                    {isAuthenticated && (
                      <Typography variant="body2">
                        {portfolioItem ? `${formatNumber(portfolioItem.amount)} (£${formatNumber(portfolioItem.amount * crypto.current_price)})` : '0.00'}
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

export default CryptoDashboardView;
