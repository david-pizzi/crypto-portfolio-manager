// src/components/ModalForm.js

import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const ModalForm = ({ modalOpen, setModalOpen, selectedCrypto, amount, setAmount, purchasePrice, handleSubmit, editingId }) => {
    return (
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
    );
};

export default ModalForm;
