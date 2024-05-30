// src/components/Login.js

import React from 'react';
import { Button, Typography, Container } from '@mui/material';
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <Button variant="contained" color="primary" onClick={loginWithRedirect}>
        Login
      </Button>
    </Container>
  );
};

export default Login;