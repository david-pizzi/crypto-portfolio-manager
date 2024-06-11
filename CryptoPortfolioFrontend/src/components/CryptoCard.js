import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const CryptoCard = ({ crypto, portfolioItem, handleAddOrEdit, handleDelete, isAuthenticated, handleSelect }) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" p={2} borderBottom="1px solid gray">
      <Box onClick={() => handleSelect(crypto)} sx={{ cursor: 'pointer' }}>
        <Typography variant="h6">{crypto.name}</Typography>
        <Typography variant="body2">£{crypto.current_price.toFixed(2)}</Typography>
        {isAuthenticated && (
          <Typography variant="body2">Portfolio: {portfolioItem ? `${portfolioItem.amount} (£${(portfolioItem.amount * crypto.current_price).toFixed(2)})` : '0.00'}</Typography>
        )}
      </Box>
      {isAuthenticated && (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Tooltip title="Add to Portfolio" arrow>
            <span>
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleAddOrEdit(crypto)}
                aria-label="Add to Portfolio"
                disabled={!!portfolioItem}
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
                onClick={handleDelete}
                aria-label="Delete from Portfolio"
                disabled={!portfolioItem}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default CryptoCard;
