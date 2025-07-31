import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, LocalShipping, Payment, Security, Support } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { flowersAPI } from '../services/api';
import { Flower } from '../types';
import SnackbarNotification from './SnackbarNotification';

interface HomeProps {
  onContactClick?: () => void;
}

const Home: React.FC<HomeProps> = ({ onContactClick }) => {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const data = await flowersAPI.getAll();
        setFlowers(data);
      } catch (err: any) {
        setError('Çiçekler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlowers();
  }, []);

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
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Çiçek Dünyası
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ mb: 3, opacity: 0.9 }}>
                Sevdiklerinize en güzel çiçekleri gönderin
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
                Özel günlerinizde, sevdiklerinizi mutlu etmek için en taze ve güzel çiçekleri sizler için seçiyoruz.
                Hızlı teslimat ve kaliteli hizmet garantisi ile yanınızdayız.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
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
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Neden Bizi Seçmelisiniz?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <LocalShipping sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Hızlı Teslimat
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aynı gün teslimat ile çiçekleriniz taze kalır
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Payment sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Güvenli Ödeme
              </Typography>
              <Typography variant="body2" color="text.secondary">
                SSL sertifikalı güvenli ödeme sistemi
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Security sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Kalite Garantisi
              </Typography>
              <Typography variant="body2" color="text.secondary">
                En taze çiçekler, en kaliteli hizmet
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Support sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
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
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Çiçek Koleksiyonumuz
        </Typography>
        <Grid container spacing={4}>
          {flowers.map((flower) => (
            <Grid item xs={12} sm={6} md={4} key={flower.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 4 } }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={flower.imageUrl || 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                  alt={flower.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                    {flower.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {flower.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      ₺{flower.price.toFixed(2)}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={flower.isAvailable ? 'Mevcut' : 'Tükendi'}
                        color={flower.isAvailable ? 'success' : 'error'}
                        size="small"
                      />
                      <Chip
                        label={`Stok: ${flower.stockQuantity}`}
                        variant="outlined"
                        size="small"
                      />
                    </Stack>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleAddToCart(flower)}
                    disabled={!flower.isAvailable || flower.stockQuantity === 0}
                    startIcon={<AddIcon />}
                    sx={{ mt: 'auto' }}
                  >
                    Sepete Ekle
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
            Bizimle İletişime Geçin
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom>
                  İletişim Bilgileri
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Adres:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Çiçek Caddesi No: 123<br />
                    Çiçek Mahallesi, İstanbul
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Telefon:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +90 (212) 555 0123
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    E-posta:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    info@cicekdunyasi.com
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Çalışma Saatleri:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pazartesi - Cumartesi: 08:00 - 20:00<br />
                    Pazar: 10:00 - 18:00
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Mesaj Gönderin
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Sorularınız için bize mesaj gönderebilirsiniz. En kısa sürede size dönüş yapacağız.
                </Typography>
                <Button variant="contained" fullWidth size="large" onClick={onContactClick}>
                  İletişim Formu
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

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