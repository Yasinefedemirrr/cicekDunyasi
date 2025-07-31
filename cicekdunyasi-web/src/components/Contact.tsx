import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { contactAPI } from '../services/api';
import { CreateContactRequest } from '../types';
import SnackbarNotification from './SnackbarNotification';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

const Contact: React.FC<ContactModalProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState<CreateContactRequest>({
    fullName: '',
    phoneNumber: '',
    email: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactAPI.create(formData);
      setSnackbar({
        open: true,
        message: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.',
        severity: 'success',
      });
      setFormData({
        fullName: '',
        phoneNumber: '',
        email: '',
        notes: '',
      });
      onClose();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Bizimle İletişime Geçin
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
            Sorularınız, önerileriniz veya şikayetleriniz için bizimle iletişime geçebilirsiniz. En kısa sürede size dönüş yapacağız.
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ad Soyad"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefon Numarası"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  placeholder="+90 (5XX) XXX XX XX"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="E-posta"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  placeholder="ornek@email.com"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mesajınız"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={5}
                  variant="outlined"
                  placeholder="Mesajınızı buraya yazın..."
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ minWidth: 200 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Mesaj Gönder'}
              </Button>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
      <SnackbarNotification
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </>
  );
};

export default Contact; 