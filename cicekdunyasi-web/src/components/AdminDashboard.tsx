import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import { ordersAPI } from '../services/api';
import { Order } from '../types';
import SnackbarNotification from './SnackbarNotification';
import ProductManagement from './ProductManagement';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getAll();
        setOrders(data);
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: 'Siparişler yüklenirken bir hata oluştu.',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Preparing':
        return 'info';
      case 'OnTheWay':
        return 'primary';
      case 'Delivered':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Bekliyor';
      case 'Preparing':
        return 'Hazırlanıyor';
      case 'OnTheWay':
        return 'Yolda';
      case 'Delivered':
        return 'Teslim Edildi';
      case 'Cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleStatusClick = (order: Order) => {
    setSelectedOrder(order);
    setStatusDialogOpen(true);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedOrder) return;

    try {
      await ordersAPI.updateStatus(selectedOrder.id, newStatus);
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: newStatus }
          : order
      ));
      setSnackbar({
        open: true,
        message: 'Sipariş durumu başarıyla güncellendi!',
        severity: 'success',
      });
      setStatusDialogOpen(false);
      setSelectedOrder(null);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: 'Sipariş durumu güncellenirken hata oluştu.',
        severity: 'error',
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'Pending').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Paneli
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Siparişler" />
          <Tab label="Ürün Yönetimi" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <>
          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Toplam Sipariş
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {totalOrders}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Bekleyen Sipariş
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {pendingOrders}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Toplam Gelir
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    ₺{totalRevenue.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Orders Table */}
          <Typography variant="h5" gutterBottom>
            Siparişler
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sipariş No</TableCell>
                  <TableCell>Müşteri</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>Adres</TableCell>
                  <TableCell>Tutar</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Tarih</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.phoneNumber}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {order.deliveryAddress}
                      </Typography>
                    </TableCell>
                    <TableCell>₺{order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(order.status)}
                        color={getStatusColor(order.status) as any}
                        size="small"
                        onClick={() => handleStatusClick(order)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString('tr-TR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {orders.length === 0 && (
            <Box textAlign="center" sx={{ mt: 4 }}>
              <Typography variant="h6" color="textSecondary">
                Henüz sipariş bulunmuyor.
              </Typography>
            </Box>
          )}
        </>
      )}

      {activeTab === 1 && (
        <ProductManagement />
      )}

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Sipariş Durumu Güncelle</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Sipariş #{selectedOrder?.id} - {selectedOrder?.customerName}
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Yeni Durum</InputLabel>
            <Select
              value=""
              label="Yeni Durum"
              onChange={(e) => handleStatusUpdate(e.target.value)}
            >
              <MenuItem value="Pending">Bekliyor</MenuItem>
              <MenuItem value="Preparing">Hazırlanıyor</MenuItem>
              <MenuItem value="OnTheWay">Yolda</MenuItem>
              <MenuItem value="Delivered">Teslim Edildi</MenuItem>
              <MenuItem value="Cancelled">İptal Edildi</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>İptal</Button>
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

export default AdminDashboard; 