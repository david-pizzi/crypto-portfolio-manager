// src/components/ModalForm.js

import React, { useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const ModalForm = ({ open, onClose, onSubmit, crypto, portfolioItem, amount, setAmount }) => {
  useEffect(() => {
    if (portfolioItem) {
      setAmount(portfolioItem.amount);
    } else {
      setAmount('');
    }
  }, [portfolioItem, setAmount]);

  const handleSubmit = () => {
    onSubmit(crypto, amount);
    onClose();
  };

  if (!crypto) {
    return null; // Render nothing if crypto is null
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: '20px', background: 'white', margin: '100px auto', maxWidth: '400px', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          {portfolioItem ? `Edit ${crypto.name} in Portfolio` : `Add ${crypto.name} to Portfolio`}
        </Typography>
        <TextField
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {portfolioItem ? "Update Portfolio" : "Add to Portfolio"}
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalForm;
