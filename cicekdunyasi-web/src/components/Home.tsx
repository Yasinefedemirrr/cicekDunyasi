import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Stack,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Badge,
  Avatar,
  Rating,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Remove as RemoveIcon, 
  LocalShipping, 
  Payment, 
  Security, 
  Support,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as CartIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { flowersAPI } from '../services/api';
import { Flower } from '../types';
import SnackbarNotification from './SnackbarNotification';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  onContactClick?: () => void;
}

const Home: React.FC<HomeProps> = ({ onContactClick }) => {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [filteredFlowers, setFilteredFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  const { addToCart, getTotalItems } = useCart();
  const navigate = useNavigate();
  const productsRef = useRef<HTMLDivElement>(null);

  const categories = [
    { value: 'all', label: 'Tümü' },
    { value: 'roses', label: 'Güller' },
    { value: 'tulips', label: 'Laleler' },
    { value: 'orchids', label: 'Orkideler' },
    { value: 'sunflowers', label: 'Ayçiçekleri' },
    { value: 'mixed', label: 'Karışık Buketler' },
  ];

  const sortOptions = [
    { value: 'name', label: 'İsme Göre' },
    { value: 'price-low', label: 'Fiyat (Düşük-Yüksek)' },
    { value: 'price-high', label: 'Fiyat (Yüksek-Düşük)' },
    { value: 'newest', label: 'En Yeni' },
  ];

  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const data = await flowersAPI.getAll();
        setFlowers(data);
        setFilteredFlowers(data);
      } catch (err: any) {
        setError('Çiçekler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlowers();
  }, []);

  useEffect(() => {
    let filtered = flowers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(flower =>
        flower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flower.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(flower =>
        flower.name.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setFilteredFlowers(filtered);
  }, [flowers, searchTerm, selectedCategory, sortBy]);

  const handleAddToCart = (flower: Flower) => {
    addToCart(flower, 1);
    setSnackbar({
      open: true,
      message: `${flower.name} sepete eklendi!`,
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section with Search */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #f093fb 100%)',
          color: 'white',
          py: 10,
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  mb: 2
                }}
              >
                Çiçek Dünyası
              </Typography>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  mb: 3, 
                  opacity: 0.95,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                Sevdiklerinize en güzel çiçekleri gönderin
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4, 
                  opacity: 0.9,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  fontSize: '1.1rem'
                }}
              >
                Özel günlerinizde, sevdiklerinizi mutlu etmek için en taze ve güzel çiçekleri sizler için seçiyoruz.
                Hızlı teslimat ve kaliteli hizmet garantisi ile yanınızdayız.
              </Typography>
              
              {/* Search Section */}
              <Paper 
                elevation={8} 
                sx={{ 
                  p: 3, 
                  mb: 4,
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
                  Çiçek Ara
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={7}>
                    <TextField
                      fullWidth
                      placeholder="Çiçek adı veya açıklama ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ bgcolor: 'white' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <FormControl fullWidth sx={{ bgcolor: 'white' }}>
                      <InputLabel id="sort-label">Sırala</InputLabel>
                      <Select
                        labelId="sort-label"
                        value={sortBy}
                        label="Sırala"
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        {sortOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>

              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: 'grey.100',
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                  transition: 'all 0.3s ease',
                }}
                onClick={() => {
                  if (productsRef.current) {
                    productsRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Çiçekleri Keşfet
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Çiçek Dünyası"
                sx={{
                  width: '100%',
                  height: 450,
                  objectFit: 'cover',
                  borderRadius: 3,
                  boxShadow: 6,
                  border: '4px solid rgba(255,255,255,0.3)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 6, fontWeight: 'bold', color: 'primary.main' }}>
          Neden Bizi Seçmelisiniz?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                textAlign: 'center', 
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8,
                },
                borderRadius: 3,
              }}
            >
              <Box sx={{ 
                bgcolor: 'primary.main', 
                borderRadius: '50%', 
                width: 80, 
                height: 80, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}>
                <LocalShipping sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Hızlı Teslimat
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aynı gün teslimat ile çiçekleriniz taze kalır
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                textAlign: 'center', 
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8,
                },
                borderRadius: 3,
              }}
            >
              <Box sx={{ 
                bgcolor: 'primary.main', 
                borderRadius: '50%', 
                width: 80, 
                height: 80, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}>
                <Payment sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Güvenli Ödeme
              </Typography>
              <Typography variant="body2" color="text.secondary">
                SSL sertifikalı güvenli ödeme sistemi
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                textAlign: 'center', 
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8,
                },
                borderRadius: 3,
              }}
            >
              <Box sx={{ 
                bgcolor: 'primary.main', 
                borderRadius: '50%', 
                width: 80, 
                height: 80, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}>
                <Security sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Kalite Garantisi
              </Typography>
              <Typography variant="body2" color="text.secondary">
                En taze çiçekler, en kaliteli hizmet
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                textAlign: 'center', 
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8,
                },
                borderRadius: 3,
              }}
            >
              <Box sx={{ 
                bgcolor: 'primary.main', 
                borderRadius: '50%', 
                width: 80, 
                height: 80, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}>
                <Support sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                7/24 Destek
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Müşteri hizmetlerimiz her zaman yanınızda
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Products Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }} ref={productsRef}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Çiçek Koleksiyonumuz
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredFlowers.length} ürün bulundu
          </Typography>
        </Box>
        
        {filteredFlowers.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center' }}>
            <SearchIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aradığınız kriterlere uygun çiçek bulunamadı
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Farklı arama terimleri deneyebilir veya filtreleri temizleyebilirsiniz
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {filteredFlowers.map((flower) => (
              <Grid item xs={12} sm={6} md={4} key={flower.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    transition: 'all 0.3s ease',
                    borderRadius: 3,
                    overflow: 'hidden',
                    '&:hover': { 
                      transform: 'translateY(-8px)', 
                      boxShadow: 8,
                    } 
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="280"
                      image={flower.imageUrl || 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                      alt={flower.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 12, 
                      right: 12,
                      display: 'flex',
                      gap: 1
                    }}>
                      <IconButton 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.9)',
                          '&:hover': { bgcolor: 'white' }
                        }}
                      >
                        <FavoriteIcon sx={{ fontSize: 20, color: 'error.main' }} />
                      </IconButton>
                      <Chip
                        label={flower.isAvailable ? 'Mevcut' : 'Tükendi'}
                        color={flower.isAvailable ? 'success' : 'error'}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 12, 
                      left: 12 
                    }}>
                      <Rating value={4.5} readOnly size="small" />
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                    <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {flower.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1, lineHeight: 1.6 }}>
                      {flower.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                        ₺{flower.price.toFixed(2)}
                      </Typography>
                      <Chip
                        label={`Stok: ${flower.stockQuantity}`}
                        variant="outlined"
                        size="small"
                        color="primary"
                      />
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleAddToCart(flower)}
                      disabled={!flower.isAvailable || flower.stockQuantity === 0}
                      startIcon={<AddIcon />}
                      sx={{ 
                        mt: 'auto',
                        py: 1.5,
                        fontWeight: 'bold',
                        borderRadius: 2,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 4,
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Sepete Ekle
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Contact Section */}
      <Box sx={{ 
        bgcolor: 'grey.50', 
        py: 8,
        backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 6, fontWeight: 'bold', color: 'primary.main' }}>
            Bizimle İletişime Geçin
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  İletişim Bilgileri
                </Typography>
                <Divider sx={{ mb: 4 }} />
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <LocationIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Adres
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Çiçek Caddesi No: 123<br />
                        Çiçek Mahallesi, İstanbul
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PhoneIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Telefon
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        +90 (212) 555 0123
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <EmailIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        E-posta
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        info@cicekdunyasi.com
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <TimeIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Çalışma Saatleri
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pazartesi - Cumartesi: 08:00 - 20:00<br />
                        Pazar: 10:00 - 18:00
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  Mesaj Gönderin
                </Typography>
                <Divider sx={{ mb: 4 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                  Sorularınız için bize mesaj gönderebilirsiniz. En kısa sürede size dönüş yapacağız.
                  Özel siparişleriniz için de bizimle iletişime geçebilirsiniz.
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large" 
                  onClick={onContactClick}
                  sx={{ 
                    py: 2,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  İletişim Formu
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Floating Cart Button */}
      <Fab
        color="primary"
        aria-label="cart"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        onClick={() => navigate('/cart')}
      >
        <Badge badgeContent={getTotalItems()} color="error">
          <CartIcon />
        </Badge>
      </Fab>

      {/* Snackbar Notification */}
      <SnackbarNotification
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default Home; 