import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  IconButton,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { ordersAPI } from '../services/api';
import { CreateOrderRequest } from '../types';
import SnackbarNotification from './SnackbarNotification';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    deliveryAddress: '',
    phoneNumber: '',
    notes: '',
  });

  const handleQuantityChange = (flowerId: number, newQuantity: number) => {
    const item = items.find(item => item.flower.id === flowerId);
    updateQuantity(flowerId, newQuantity);
    if (item && newQuantity !== item.quantity) {
      setSnackbar({
        open: true,
        message: `${item.flower.name} miktarı güncellendi.`,
        severity: 'info',
      });
    }
  };

  const handleRemoveItem = (flowerId: number) => {
    const item = items.find(item => item.flower.id === flowerId);
    removeFromCart(flowerId);
    if (item) {
      setSnackbar({
        open: true,
        message: `${item.flower.name} sepetten çıkarıldı.`,
        severity: 'info',
      });
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      setError('Sepetiniz boş.');
      return;
    }
    setOpenDialog(true);
  };

  const handleSubmitOrder = async () => {
    if (!orderForm.customerName || !orderForm.deliveryAddress || !orderForm.phoneNumber) {
      setError('Lütfen tüm gerekli alanları doldurun.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData: CreateOrderRequest = {
        customerName: orderForm.customerName,
        deliveryAddress: orderForm.deliveryAddress,
        phoneNumber: orderForm.phoneNumber,
        notes: orderForm.notes,
        orderItems: items.map(item => ({
          flowerId: item.flower.id,
          quantity: item.quantity,
        })),
      };

      await ordersAPI.create(orderData);
      setSnackbar({
        open: true,
        message: 'Siparişiniz başarı ile oluşturulmuştur, Sizinle irtibata geçilecektir!',
        severity: 'success',
      });
      clearCart();
      setOpenDialog(false);
      setOrderForm({
        customerName: '',
        deliveryAddress: '',
        phoneNumber: '',
        notes: '',
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Sipariş oluşturulurken bir hata oluştu.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Sepetiniz Boş
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          Sepetinizde henüz ürün bulunmuyor.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sepetim
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Card key={item.flower.id} sx={{ mb: 2, p: 1, borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <img
                      src={item.flower.imageUrl || 'https://via.placeholder.com/100x100?text=Çiçek'}
                      alt={item.flower.name}
                      style={{ width: '100%', height: 'auto', maxWidth: '100px', borderRadius: 8 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="h6">{item.flower.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₺{item.flower.price.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box display="flex" alignItems="center" justifyContent="flex-start" gap={1} sx={{ marginLeft: -4 }}>
                      <IconButton
                        onClick={() => handleQuantityChange(item.flower.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        size="large"
                        sx={{ border: '1px solid #eee', bgcolor: 'white', zIndex: 1 }}
                      >
                        <RemoveIcon fontSize="large" />
                      </IconButton>
                      <Typography variant="h5" sx={{ minWidth: 40, textAlign: 'center', fontWeight: 'bold', marginRight: 0.5 }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        onClick={() => handleQuantityChange(item.flower.id, item.quantity + 1)}
                        disabled={item.quantity >= item.flower.stockQuantity}
                        size="large"
                        sx={{ border: '1px solid #eee', bgcolor: 'white', zIndex: 1 }}
                      >
                        <AddIcon fontSize="large" />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', marginLeft: 2, zIndex: 10, position: 'relative' }}>
                      ₺{(item.flower.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(item.flower.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sipariş Özeti
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  Toplam Ürün: <b>{items.reduce((acc, item) => acc + item.quantity, 0)}</b>
                </Typography>
                <Typography variant="h5" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>
                  Toplam: ₺{getTotalPrice().toFixed(2)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckout}
                disabled={loading}
                sx={{ fontWeight: 'bold', py: 1.5 }}
              >
                Sipariş Ver
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Sipariş Bilgileri</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Müşteri Adı"
            value={orderForm.customerName}
            onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Teslimat Adresi"
            multiline
            rows={3}
            value={orderForm.deliveryAddress}
            onChange={(e) => setOrderForm({ ...orderForm, deliveryAddress: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Telefon Numarası"
            value={orderForm.phoneNumber}
            onChange={(e) => setOrderForm({ ...orderForm, phoneNumber: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Notlar (Opsiyonel)"
            multiline
            rows={2}
            value={orderForm.notes}
            onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button
            onClick={handleSubmitOrder}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Sipariş Veriliyor...' : 'Siparişi Onayla'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <SnackbarNotification
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Container>
  );
};

export default Cart; 