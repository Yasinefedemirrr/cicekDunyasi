import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import {
  Visibility,
  Delete,
  CheckCircle,
  Email,
  Phone,
  Person,
} from '@mui/icons-material';
import { contactAPI } from '../services/api';
import { Contact } from '../types';
import SnackbarNotification from './SnackbarNotification';

const ContactManagement: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await contactAPI.getAll();
      setContacts(data);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: 'İletişim mesajları yüklenirken bir hata oluştu.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setDialogOpen(true);
  };

  const handleMarkAsRead = async (contactId: number) => {
    try {
      await contactAPI.markAsRead(contactId);
      setContacts(contacts.map(contact =>
        contact.id === contactId ? { ...contact, isRead: true } : contact
      ));
      setSnackbar({
        open: true,
        message: 'Mesaj okundu olarak işaretlendi.',
        severity: 'success',
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: 'Mesaj işaretlenirken hata oluştu.',
        severity: 'error',
      });
    }
  };

  const handleDeleteContact = async (contactId: number) => {
    try {
      await contactAPI.delete(contactId);
      setContacts(contacts.filter(contact => contact.id !== contactId));
      setSnackbar({
        open: true,
        message: 'Mesaj başarıyla silindi.',
        severity: 'success',
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: 'Mesaj silinirken hata oluştu.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedContact(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const unreadCount = contacts.filter(contact => !contact.isRead).length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        İletişim Mesajları
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Toplam {contacts.length} mesaj, {unreadCount} okunmamış mesaj
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ad Soyad</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>E-posta</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id} sx={{ 
                backgroundColor: contact.isRead ? 'inherit' : 'action.hover' 
              }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1, fontSize: 20 }} />
                    {contact.fullName}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone sx={{ mr: 1, fontSize: 20 }} />
                    {contact.phoneNumber}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Email sx={{ mr: 1, fontSize: 20 }} />
                    {contact.email}
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(contact.createdAt).toLocaleDateString('tr-TR')}
                </TableCell>
                <TableCell>
                  <Chip
                    label={contact.isRead ? 'Okundu' : 'Okunmadı'}
                    color={contact.isRead ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleViewContact(contact)}
                    color="primary"
                    size="small"
                  >
                    <Visibility />
                  </IconButton>
                  {!contact.isRead && (
                    <IconButton
                      onClick={() => handleMarkAsRead(contact.id)}
                      color="success"
                      size="small"
                    >
                      <CheckCircle />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() => handleDeleteContact(contact.id)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {contacts.length === 0 && (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            Henüz iletişim mesajı bulunmuyor.
          </Typography>
        </Box>
      )}

      {/* Contact Detail Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          İletişim Mesajı - {selectedContact?.fullName}
        </DialogTitle>
        <DialogContent>
          {selectedContact && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ad Soyad"
                  value={selectedContact.fullName}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefon"
                  value={selectedContact.phoneNumber}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="E-posta"
                  value={selectedContact.email}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mesaj"
                  value={selectedContact.notes || ''}
                  InputProps={{ readOnly: true }}
                  multiline
                  rows={6}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  Tarih: {new Date(selectedContact.createdAt).toLocaleString('tr-TR')}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Kapat</Button>
        </DialogActions>
      </Dialog>

      <SnackbarNotification
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Container>
  );
};

export default ContactManagement; 