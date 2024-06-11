import React from 'react';
import { Button, Typography, Container, Box } from '@mui/material';
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Button variant="contained" color="primary" onClick={loginWithRedirect}>
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
