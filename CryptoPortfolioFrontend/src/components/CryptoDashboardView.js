import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PortfolioOverview from "./PortfolioOverview";
import ModalForm from "./ModalForm";
import ChartComponent from "./Chart";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(1), // Reduced marginTop
  borderRadius: theme.shape.borderRadius,
  boxShadow:
    theme.shadows[3] ||
    "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)", // Fallback box shadow
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
}));

const CryptoDashboardView = ({
  error,
  portfolioData,
  cryptoData,
  cryptoHistory,
  cryptoImages,
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
  formatNumber,
}) => {
  const theme = useTheme();

  return (
    <Box p={1}> {/* Reduced padding */}
      {error && (
        <Typography variant="body2" color="error" gutterBottom>
          {error}
        </Typography>
      )}
      {isAuthenticated && (
        <Typography variant="h3" gutterBottom align="left">
          Portfolio
        </Typography>
      )}
      {isAuthenticated && (
        <Box
          mt={1}
          mb={1}
          bgcolor="background.paper"
          borderRadius={2}
          textAlign="center"
          boxShadow={theme.shadows[3]}
          p={1}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography variant="h4">Total Balance</Typography>
          <Typography variant="h2" color="primary" fontWeight="bold">
            £
            {formatNumber(
              portfolioData.reduce((total, item) => {
                const crypto = cryptoData.find(
                  (crypto) => crypto.name.toLowerCase() === item.cryptoName.toLowerCase()
                );
                return total + item.amount * (crypto ? crypto.price : 0);
              }, 0)
            )}
          </Typography>
        </Box>
      )}
      {isAuthenticated && (
        <PortfolioOverview
          portfolioData={portfolioData}
          cryptoData={cryptoData}
          cryptoImages={cryptoImages}
          handleEdit={handleAddOrEdit}
          handleDelete={handleDelete}
          formatNumber={formatNumber}
        />
      )}
      <Typography variant="h3" gutterBottom align="left">
        Cryptocurrencies
      </Typography>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              {isAuthenticated && (
                <StyledTableCell>Volume (Balance)</StyledTableCell>
              )}
              <StyledTableCell>Chart</StyledTableCell>
              {isAuthenticated && <StyledTableCell>Actions</StyledTableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {cryptoData.map((crypto) => {
              const portfolioItem = portfolioData.find(
                (item) => item.cryptoName.toLowerCase() === crypto.name.toLowerCase()
              );
              const cryptoImage = cryptoImages.find(
                (img) => img.symbol.toLowerCase() === crypto.name.toLowerCase()
              );
              return (
                <TableRow
                  key={crypto.id}
                  onClick={() => handleSelect(crypto)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {cryptoImage && (
                        <img
                          src={cryptoImage.image}
                          alt={crypto.name}
                          style={{ width: 32, height: 32, marginRight: 8 }}
                        />
                      )}
                      <Typography variant="h6">
                        {crypto.name} ({crypto.symbol.toUpperCase()})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      £{formatNumber(crypto.price)}
                    </Typography>
                  </TableCell>
                  {isAuthenticated && (
                    <TableCell>
                      <Typography variant="body2">
                        {portfolioItem
                          ? `${formatNumber(
                              portfolioItem.amount
                            )} (£${formatNumber(
                              portfolioItem.amount * crypto.price
                            )})`
                          : "0.00"}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell>
                    <ChartComponent data={cryptoHistory[crypto.coinId] || []} />
                  </TableCell>
                  {isAuthenticated && (
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Tooltip title="Edit Portfolio" arrow>
                          <span>
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddOrEdit(crypto.name);
                              }}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(crypto.name);
                              }}
                              aria-label="Delete from Portfolio"
                              disabled={!portfolioItem}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <ModalForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        crypto={currentCrypto}
        portfolioItem={portfolioData.find(
          (item) => item.cryptoName.toLowerCase() === currentCrypto?.name.toLowerCase()
        )}
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
            Are you sure you want to update {currentCrypto?.name} in your
            portfolio?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmEdit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {cryptoToDelete?.name} from your
            portfolio?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CryptoDashboardView;
