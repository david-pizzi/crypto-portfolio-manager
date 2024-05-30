// src/components/AppLayout.js

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Divider, Button } from '@mui/material';
import { Menu as MenuIcon, AccountCircle, Dashboard, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const drawerWidth = 240;

const AppLayout = ({ children }) => {
    const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" style={{ zIndex: 1400 }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" style={{ marginRight: 20 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
                        Crypto Portfolio
                    </Typography>
                    {isAuthenticated ? (
                        <>
                            <IconButton color="inherit" onClick={() => handleNavigation('/profile')}>
                                <AccountCircle />
                            </IconButton>
                            <IconButton color="inherit" onClick={() => logout({ returnTo: window.location.origin })}>
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
            </AppBar>
            <Drawer
                variant="permanent"
                style={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawerPaper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <div style={{ overflow: 'auto' }}>
                    <List>
                        <ListItem button onClick={() => handleNavigation('/dashboard')}>
                            <ListItemIcon>
                                <Dashboard />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                        <Divider />
                        <ListItem button onClick={() => handleNavigation('/profile')}>
                            <ListItemIcon>
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText primary="Profile" />
                        </ListItem>
                        {isAuthenticated && (
                            <ListItem button onClick={() => logout({ returnTo: window.location.origin })}>
                                <ListItemIcon>
                                    <ExitToApp />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        )}
                    </List>
                </div>
            </Drawer>
            <main style={{ flexGrow: 1, padding: '20px', marginLeft: drawerWidth }}>
                <Toolbar />
                {children}
            </main>
        </div>
    );
};

export default AppLayout;
