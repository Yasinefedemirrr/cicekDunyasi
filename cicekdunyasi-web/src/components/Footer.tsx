import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  Stack,
  IconButton,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';

interface FooterProps {
  onContactClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onContactClick }) => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Çiçek Dünyası
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
              Sevdiklerinize en güzel çiçekleri gönderin. 20 yılı aşkın deneyimimizle 
              Türkiye'nin en güvenilir çiçek satış platformuyuz.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton color="inherit" size="small">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" size="small">
                <LinkedIn />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Hızlı Linkler
            </Typography>
            <Stack spacing={1}>
              <Link href="/" color="inherit" underline="hover">
                Anasayfa
              </Link>
              <Link href="/flowers" color="inherit" underline="hover">
                Çiçekler
              </Link>
              <Link href="/cart" color="inherit" underline="hover">
                Sepet
              </Link>
              <Link href="#" color="inherit" underline="hover" onClick={onContactClick}>
                İletişim
              </Link>
            </Stack>
          </Grid>

          {/* Services */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Hizmetler
            </Typography>
            <Stack spacing={1}>
              <Link href="/same-day-delivery" color="inherit" underline="hover">
                Aynı Gün Teslimat
              </Link>
              <Link href="/next-day-delivery" color="inherit" underline="hover">
                Ertesi Gün Teslimat
              </Link>
              <Link href="/corporate" color="inherit" underline="hover">
                Kurumsal
              </Link>
              <Link href="/wedding" color="inherit" underline="hover">
                Düğün Çiçekleri
              </Link>
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              İletişim Bilgileri
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  Çiçek Caddesi No: 123<br />
                  Çiçek Mahallesi, İstanbul
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  +90 (212) 555 0123
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  info@cicekdunyasi.com
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Contact Button */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Bizimle İletişime Geçin
            </Typography>
            <Box sx={{ mt: 2 }}>
              <button
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'white',
                  color: '#388e3c',
                  border: 'none',
                  borderRadius: 4,
                  fontWeight: 'bold',
                  fontSize: 16,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={onContactClick}
              >
                İLETİŞİM FORMU
              </button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Bottom Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2024 Çiçek Dünyası. Tüm hakları saklıdır.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link href="/privacy" color="inherit" underline="hover" variant="body2">
              Gizlilik Politikası
            </Link>
            <Link href="/terms" color="inherit" underline="hover" variant="body2">
              Kullanım Şartları
            </Link>
            <Link href="/refund" color="inherit" underline="hover" variant="body2">
              İade Politikası
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 