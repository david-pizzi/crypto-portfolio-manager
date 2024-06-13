import React, { lazy, Suspense } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Divider,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountBalance,
  AccountCircle,
  ExitToApp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { styled } from '@mui/system';

const drawerWidth = 200; // Reduced drawer width

const Root = styled('div')({
  display: 'flex',
});

const CustomAppBar = styled(AppBar)({
  zIndex: 1201, // static value for zIndex
});

const CustomDrawer = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
  },
});

const Content = styled('main')({
  flexGrow: 1,
  padding: '8px', // Reduced padding
  marginLeft: 50, // Set left margin
  marginRight: 50, // Set right margin
});

const Profile = lazy(() => import('./Profile'));
const CryptoDashboard = lazy(() => import('./CryptoDashboard'));

const AppLayout = ({ children }) => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Root>
      <CssBaseline />
      <CustomAppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            style={{ marginRight: 20 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
            Crypto Portfolio
          </Typography>
          {isAuthenticated ? (
            <>
              <IconButton
                color="inherit"
                onClick={() => handleNavigation('/dashboard')}
              >
                <AccountBalance />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={() => handleNavigation('/profile')}
              >
                <AccountCircle />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                <ExitToApp />
              </IconButton>
              <Avatar alt={user.name} src={user.picture} />
            </>
          ) : (
            <Button color="inherit" onClick={() => loginWithRedirect()}>
              Login
            </Button>
          )}
        </Toolbar>
      </CustomAppBar>
      <CustomDrawer variant="permanent">
        <Toolbar />
        <Divider />
        <List>
          <ListItem button onClick={() => handleNavigation('/dashboard')}>
            <ListItemIcon>
              <AccountBalance />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          {isAuthenticated && (
            <>
              <Divider />
              <ListItem button onClick={() => handleNavigation('/profile')}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem
                button
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          )}
        </List>
      </CustomDrawer>
      <Content>
        <Toolbar />
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </Content>
    </Root>
  );
};

export default AppLayout;
