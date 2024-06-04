import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root'));
const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;
const scope = process.env.REACT_APP_AUTH0_SCOPE;

root.render(
  <Auth0Provider
  domain={domain}
  clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: audience,
      scope: scope
    }}
  >
    <App />
  </Auth0Provider>
);