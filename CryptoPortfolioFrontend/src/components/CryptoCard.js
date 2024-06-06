// src/components/CryptoCard.js

import React from 'react';
import { Card, CardContent, Typography, IconButton, Box, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const cardStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '150px', // Fixed height for the cards
    padding: '10px'
};

const CryptoCard = ({ crypto, portfolioItem, handleAddOrEdit, handleDelete, isAuthenticated }) => {
    return (
        <Card style={cardStyles}>
            <CardContent style={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div">
                    {crypto.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    £{crypto.current_price.toFixed(2)}
                </Typography>
                {isAuthenticated && (
                    <Typography variant="body2" color="textSecondary">
                        Portfolio: {portfolioItem ? portfolioItem.amount : 0}
                    </Typography>
                )}
            </CardContent>
            {isAuthenticated && (
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <Tooltip title="Add to Portfolio" arrow>
                        <span>
                            <IconButton
                                color="primary"
                                size="small"
                                onClick={() => handleAddOrEdit(crypto)}
                                aria-label="Add to Portfolio"
                                disabled={!!portfolioItem}
                                style={{ marginBottom: '8px' }}
                            >
                                <AddIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Edit Portfolio" arrow>
                        <span>
                            <IconButton
                                color="primary"
                                size="small"
                                onClick={() => handleAddOrEdit(crypto)}
                                aria-label="Edit Portfolio"
                                disabled={!portfolioItem}
                                style={{ marginBottom: '8px' }}
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
                                onClick={() => handleDelete(portfolioItem?.id)}
                                aria-label="Delete from Portfolio"
                                disabled={!portfolioItem}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>
            )}
        </Card>
    );
};

export default CryptoCard;
