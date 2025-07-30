import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  Box,
} from '@mui/material';
import { ShoppingCart as CartIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={handleHomeClick}
        >
          Çiçek Dünyası
        </Typography>

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user?.role === 'Admin' && (
              <Button color="inherit" onClick={handleAdminClick}>
                Admin Paneli
              </Button>
            )}
            
            <Button color="inherit" onClick={() => navigate('/orders')}>
              Geçmiş Siparişlerim
            </Button>
            
            <Button color="inherit" onClick={handleCartClick}>
              <Badge badgeContent={getTotalItems()} color="error">
                <CartIcon />
              </Badge>
            </Button>
            
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user?.username}
            </Typography>
            
            <Button color="inherit" onClick={handleLogout}>
              Çıkış
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Giriş Yap
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              onClick={() => navigate('/register')}
              sx={{ 
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Kayıt Ol
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 