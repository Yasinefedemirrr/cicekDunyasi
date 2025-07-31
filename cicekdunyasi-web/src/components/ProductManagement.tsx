import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, CheckCircle as AvailableIcon, Cancel as UnavailableIcon } from '@mui/icons-material';
import { flowersAPI } from '../services/api';
import { Flower } from '../types';
import SnackbarNotification from './SnackbarNotification';

const ProductManagement: React.FC = () => {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFlower, setEditingFlower] = useState<Flower | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  useEffect(() => {
    fetchFlowers();
  }, []);

  const fetchFlowers = async () => {
    try {
      const data = await flowersAPI.getAllForAdmin();
      setFlowers(data);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: 'Çiçekler yüklenirken bir hata oluştu.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (flower?: Flower) => {
    if (flower) {
      setEditingFlower(flower);
      setFormData({
        name: flower.name,
        description: flower.description,
        price: flower.price.toString(),
        stockQuantity: flower.stockQuantity.toString(),
        imageUrl: flower.imageUrl || '',
      });
    } else {
      setEditingFlower(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        imageUrl: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingFlower(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      imageUrl: '',
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.stockQuantity) {
      setSnackbar({
        open: true,
        message: 'Lütfen tüm gerekli alanları doldurun.',
        severity: 'error',
      });
      return;
    }

    try {
      if (editingFlower) {
        await flowersAPI.update(editingFlower.id, {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          stockQuantity: Number(formData.stockQuantity),
          imageUrl: formData.imageUrl || 'https://via.placeholder.com/300x200?text=Çiçek',
        });
        setSnackbar({
          open: true,
          message: 'Ürün başarıyla güncellendi!',
          severity: 'success',
        });
      } else {
        await flowersAPI.create({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          stockQuantity: Number(formData.stockQuantity),
          imageUrl: formData.imageUrl || 'https://via.placeholder.com/300x200?text=Çiçek',
        });
        setSnackbar({
          open: true,
          message: 'Ürün başarıyla eklendi!',
          severity: 'success',
        });
      }
      
      fetchFlowers();
      handleCloseDialog();
    } catch (err: any) {
      console.error('Ürün ekleme hatası:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || 'İşlem sırasında bir hata oluştu.',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (flowerId: number) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await flowersAPI.delete(flowerId);
        setSnackbar({
          open: true,
          message: 'Ürün başarıyla silindi!',
          severity: 'success',
        });
        fetchFlowers();
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || 'Ürün silinirken bir hata oluştu.',
          severity: 'error',
        });
      }
    }
  };

  const handleStatusToggle = async (flower: Flower) => {
    try {
      await flowersAPI.updateStatus(flower.id, !flower.isAvailable);
      setSnackbar({
        open: true,
        message: `Ürün durumu ${!flower.isAvailable ? 'Mevcut' : 'Tükendi'} olarak güncellendi!`,
        severity: 'success',
      });
      fetchFlowers();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Durum güncellenirken bir hata oluştu.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>Yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Ürün Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Yeni Ürün Ekle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Resim</TableCell>
              <TableCell>Ürün Adı</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell>Fiyat</TableCell>
              <TableCell>Stok</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flowers.map((flower) => (
              <TableRow key={flower.id}>
                <TableCell>
                  <img
                    src={flower.imageUrl || 'https://via.placeholder.com/50x50?text=Çiçek'}
                    alt={flower.name}
                    style={{ width: 50, height: 50, objectFit: 'cover' }}
                  />
                </TableCell>
                <TableCell>{flower.name}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {flower.description}
                  </Typography>
                </TableCell>
                <TableCell>₺{flower.price.toFixed(2)}</TableCell>
                <TableCell>{flower.stockQuantity}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body2"
                      color={flower.isAvailable ? 'success.main' : 'error.main'}
                    >
                      {flower.isAvailable ? 'Mevcut' : 'Tükendi'}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleStatusToggle(flower)}
                      color={flower.isAvailable ? 'success' : 'error'}
                      title={flower.isAvailable ? 'Tükendi olarak işaretle' : 'Mevcut olarak işaretle'}
                    >
                      {flower.isAvailable ? <AvailableIcon /> : <UnavailableIcon />}
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(flower)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(flower.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingFlower ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ürün Adı"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Açıklama"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Fiyat"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Stok Miktarı"
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resim URL (Opsiyonel - Kısa URL kullanın)"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                helperText="Örnek: https://example.com/image.jpg (Base64 yerine URL kullanın)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingFlower ? 'Güncelle' : 'Ekle'}
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

export default ProductManagement; 