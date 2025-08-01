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
  Avatar,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  AttachMoney,
  People,
  Inventory,
  Warning,
  CheckCircle,
  Cancel,
  LocalShipping,
  Schedule,
  BarChart,
  PieChart,
  ShowChart,
  Visibility,
} from '@mui/icons-material';
import { ordersAPI, flowersAPI } from '../services/api';
import { Order, Flower } from '../types';
import SnackbarNotification from './SnackbarNotification';
import ProductManagement from './ProductManagement';
import ContactManagement from './ContactManagement';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  topSellingProduct: string;
  lowStockProducts: number;
}

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    topSellingProduct: '',
    lowStockProducts: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, flowersData] = await Promise.all([
          ordersAPI.getAll(),
          flowersAPI.getAll(),
        ]);
        setOrders(ordersData);
        setFlowers(flowersData);
        calculateDashboardStats(ordersData, flowersData);
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: 'Veriler yüklenirken bir hata oluştu.',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateDashboardStats = (ordersData: Order[], flowersData: Flower[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // İptal edilen siparişleri toplam gelirden çıkar
    const validOrders = ordersData.filter(order => order.status !== 'Cancelled');
    const totalRevenue = validOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Aylık gelir
    const monthlyOrders = ordersData.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate.getMonth() === currentMonth && 
             orderDate.getFullYear() === currentYear &&
             order.status !== 'Cancelled';
    });
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Yıllık gelir
    const yearlyOrders = ordersData.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate.getFullYear() === currentYear && order.status !== 'Cancelled';
    });
    const yearlyRevenue = yearlyOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // En çok satılan ürünü hesapla
    const deliveredOrders = ordersData.filter(order => order.status === 'Delivered');
    const productSales: { [key: string]: number } = {};
    
    deliveredOrders.forEach(order => {
      order.orderItems.forEach(item => {
        if (productSales[item.flowerName]) {
          productSales[item.flowerName] += item.quantity;
        } else {
          productSales[item.flowerName] = item.quantity;
        }
      });
    });

    // En çok satılan ürünü bul
    let topSellingProduct = 'Henüz satış yok';
    let maxSales = 0;
    
    Object.entries(productSales).forEach(([productName, salesCount]) => {
      if (salesCount > maxSales) {
        maxSales = salesCount;
        topSellingProduct = productName;
      }
    });

    setDashboardStats({
      totalOrders: ordersData.length,
      pendingOrders: ordersData.filter(order => order.status === 'Pending').length,
      deliveredOrders: ordersData.filter(order => order.status === 'Delivered').length,
      cancelledOrders: ordersData.filter(order => order.status === 'Cancelled').length,
      totalRevenue,
      monthlyRevenue,
      yearlyRevenue,
      topSellingProduct,
      lowStockProducts: 0, // Bu artık kullanılmayacak
    });
  };

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
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: newStatus }
          : order
      );
      setOrders(updatedOrders);
      calculateDashboardStats(updatedOrders, flowers);
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

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const activeOrders = orders.filter(order => order.status !== 'Delivered');
  const deliveredOrders = orders.filter(order => order.status === 'Delivered');

  const renderDashboard = () => (
    <>
      {/* Ana İstatistikler */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
                <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Toplam Sipariş
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {dashboardStats.totalOrders}
                  </Typography>
                </Box>
                <ShoppingCart sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Toplam Gelir
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ₺{dashboardStats.totalRevenue.toFixed(2)}
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Aylık Gelir
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ₺{dashboardStats.monthlyRevenue.toFixed(2)}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Yıllık Ciro
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ₺{dashboardStats.yearlyRevenue.toFixed(2)}
                  </Typography>
                </Box>
                <BarChart sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
                </CardContent>
              </Card>
            </Grid>
      </Grid>

      {/* İkinci Satır İstatistikler */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
                <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Bekleyen Sipariş
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {dashboardStats.pendingOrders}
                  </Typography>
                </Box>
                <Schedule sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Teslim Edilen
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {dashboardStats.deliveredOrders}
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    İptal Edilen
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {dashboardStats.cancelledOrders}
                  </Typography>
                </Box>
                <Cancel sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Toplam Ürün
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {flowers.length}
                  </Typography>
                </Box>
                <Inventory sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detaylı İstatistikler */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-3px)' }
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Sipariş Durumları
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body2">Bekleyen</Typography>
                  <Typography variant="body2" color="warning.light">
                    {dashboardStats.pendingOrders}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(dashboardStats.pendingOrders / dashboardStats.totalOrders) * 100} 
                  color="warning"
                  sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'warning.light' } }}
                />

                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body2">Teslim Edilen</Typography>
                  <Typography variant="body2" color="success.light">
                    {dashboardStats.deliveredOrders}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(dashboardStats.deliveredOrders / dashboardStats.totalOrders) * 100} 
                  color="success"
                  sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'success.light' } }}
                />

                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body2">İptal Edilen</Typography>
                  <Typography variant="body2" color="error.light">
                    {dashboardStats.cancelledOrders}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(dashboardStats.cancelledOrders / dashboardStats.totalOrders) * 100} 
                  color="error"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'error.light' } }}
                />
              </Box>
                </CardContent>
              </Card>
            </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-3px)' }
          }}>
                <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Gelir Analizi
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="body2">Aylık Gelir</Typography>
                  <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
                    ₺{dashboardStats.monthlyRevenue.toFixed(2)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="body2">Yıllık Gelir</Typography>
                  <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
                    ₺{dashboardStats.yearlyRevenue.toFixed(2)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="body2">Toplam Gelir</Typography>
                  <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
                    ₺{dashboardStats.totalRevenue.toFixed(2)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Ortalama Sipariş</Typography>
                  <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
                    ₺{dashboardStats.totalOrders > 0 ? (dashboardStats.totalRevenue / dashboardStats.totalOrders).toFixed(2) : '0.00'}
                  </Typography>
                </Box>
              </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

      {/* En Fazla Satılan Ürün ve Hızlı İstatistikler */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-3px)' }
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                En Fazla Satılan Ürün
              </Typography>
              <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2, width: 60, height: 60 }}>
                  <PieChart sx={{ fontSize: 30, color: 'white' }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                    {dashboardStats.topSellingProduct}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Teslim edilen siparişlerden en çok tercih edilen ürün
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {dashboardStats.topSellingProduct !== 'Henüz satış yok' ? 'Dinamik olarak hesaplanıyor' : 'Henüz teslim edilen sipariş bulunmuyor'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-3px)' }
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Hızlı İstatistikler
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="body2">Aktif Ürünler</Typography>
                  <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
                    {flowers.filter(f => f.isAvailable).length}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="body2">Tükendi</Typography>
                  <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
                    {flowers.filter(f => !f.isAvailable).length}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="body2">Ortalama Fiyat</Typography>
                  <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
                    ₺{flowers.length > 0 ? (flowers.reduce((sum, f) => sum + f.price, 0) / flowers.length).toFixed(2) : '0.00'}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Toplam Stok</Typography>
                  <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
                    {flowers.reduce((sum, f) => sum + f.stockQuantity, 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );

  const renderOrdersTable = (orderList: Order[], title: string) => (
    <>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        {title}
          </Typography>
          
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sipariş No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Müşteri</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Telefon</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Adres</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tutar</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Durum</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tarih</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Detay</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
            {orderList.map((order) => (
              <TableRow key={order.id} hover>
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
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString('tr-TR')}
                    </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleViewDetails(order)}
                    color="primary"
                    title="Sipariş Detaylarını Görüntüle"
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

      {orderList.length === 0 && (
            <Box textAlign="center" sx={{ mt: 4 }}>
              <Typography variant="h6" color="textSecondary">
            {title === 'Aktif Siparişler' ? 'Henüz aktif sipariş bulunmuyor.' : 'Henüz teslim edilen sipariş bulunmuyor.'}
              </Typography>
            </Box>
          )}
        </>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Admin Paneli
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ '& .MuiTab-root': { fontWeight: 'bold' } }}>
          <Tab label="Dashboard" icon={<BarChart />} iconPosition="start" />
          <Tab label="Siparişler" icon={<ShoppingCart />} iconPosition="start" />
          <Tab label="Teslim Edilen Siparişler" icon={<CheckCircle />} iconPosition="start" />
          <Tab label="İletişim Mesajları" icon={<People />} iconPosition="start" />
          <Tab label="Ürün Yönetimi" icon={<Inventory />} iconPosition="start" />
        </Tabs>
      </Box>

      {activeTab === 0 && renderDashboard()}

      {activeTab === 1 && (
        <>
          {/* Hızlı İstatistikler */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Bekleyen Sipariş
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {dashboardStats.pendingOrders}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Teslim Edilen
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {dashboardStats.deliveredOrders}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Toplam Gelir
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ₺{dashboardStats.totalRevenue.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {renderOrdersTable(activeOrders, 'Aktif Siparişler')}
        </>
      )}

      {activeTab === 2 && (
        renderOrdersTable(deliveredOrders, 'Teslim Edilen Siparişler')
      )}

      {activeTab === 3 && (
        <ContactManagement />
      )}

      {activeTab === 4 && (
        <ProductManagement />
      )}

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
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

      {/* Order Details Dialog */}
      <Dialog open={detailDialogOpen} onClose={handleCloseDetailDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Sipariş Detayları - #{selectedOrder?.id}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Müşteri Bilgileri
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Ad Soyad:</strong> {selectedOrder.customerName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Telefon:</strong> {selectedOrder.phoneNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Adres:</strong> {selectedOrder.deliveryAddress}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Sipariş Tarihi:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString('tr-TR')}
                    </Typography>
                    {selectedOrder.notes && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Notlar:</strong> {selectedOrder.notes}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Sipariş Özeti
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Toplam Tutar:</strong> ₺{selectedOrder.totalAmount.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Durum:</strong> 
                      <Chip
                        label={getStatusText(selectedOrder.status)}
                        color={getStatusColor(selectedOrder.status) as any}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Ürün Sayısı:</strong> {selectedOrder.orderItems.length}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mt: 3 }}>
                Sipariş İçeriği
              </Typography>
              
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Ürün Adı</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Miktar</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Birim Fiyat</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Toplam</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.orderItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.flowerName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₺{item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell>₺{item.totalPrice.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>Kapat</Button>
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