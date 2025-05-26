import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  saveContactUs,
  getAllContactUs,
  updateContactUs,
  deleteContactUs,
  clearError,
} from '../../../store/contactUsSlice';
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';

const AddContactUs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { contacts = [], loading, error } = useSelector((state) => state.contactUs || {});
  const role = useSelector((state) => state.auth.role) || localStorage.getItem('authRole');
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');

  const [formData, setFormData] = useState({
    address: '',
    phonenumbers: '',
    email: '',
    saturday: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  useEffect(() => {
    dispatch(getAllContactUs());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.phonenumbers.trim()) newErrors.phonenumbers = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.saturday.trim()) newErrors.saturday = 'Saturday status is required';
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      setFormErrors({ ...formErrors, auth: 'Authentication token missing' });
      return;
    }
    if (!validateForm()) {
      setFormErrors({ ...formErrors, form: 'Please fill in all required fields correctly' });
      return;
    }

    if (editingId) {
      dispatch(updateContactUs({ id: editingId, contactData: formData }));
      setEditingId(null);
    } else {
      dispatch(saveContactUs(formData));
    }
    setFormData({ address: '', phonenumbers: '', email: '', saturday: '' });
  };

  const handleEdit = (contact) => {
    if (!token) {
      setFormErrors({ ...formErrors, auth: 'Authentication token missing' });
      return;
    }
    setFormData({
      address: contact.address,
      phonenumbers: contact.phonenumbers,
      email: contact.email,
      saturday: contact.saturday,
    });
    setEditingId(contact.id);
  };

  const handleDelete = (id) => {
    if (!token) {
      setFormErrors({ ...formErrors, auth: 'Authentication token missing' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this contact?')) {
      dispatch(deleteContactUs(id));
    }
  };

  const handleRefresh = () => {
    dispatch(getAllContactUs());
  };

  const SkeletonCard = () => (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md animate-pulse">
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-24 bg-gray-300 rounded"></div>
    </div>
  );

  return (
    <div className="p-6">
      <Typography variant="h4" className="font-bold text-gray-800 mb-6 text-center">
        Contact Us Management
      </Typography>

      {/* Admin Form */}
      {role === 'admin' && (
        <div className="max-w-2xl mx-auto mb-10 p-6 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {editingId ? 'Update Contact' : 'Add New Contact'}
          </h2>
          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          {formErrors.auth && <Alert severity="error" className="mb-4">{formErrors.auth}</Alert>}
          {formErrors.form && <Alert severity="error" className="mb-4">{formErrors.form}</Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!formErrors.address}
              helperText={formErrors.address}
              disabled={loading}
            />
            <TextField
              label="Phone Numbers"
              name="phonenumbers"
              value={formData.phonenumbers}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!formErrors.phonenumbers}
              helperText={formErrors.phonenumbers}
              disabled={loading}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={loading}
            />
            <TextField
              label="Saturday Status"
              name="saturday"
              value={formData.saturday}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!formErrors.saturday}
              helperText={formErrors.saturday}
              disabled={loading}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              fullWidth
              className="py-3"
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : editingId ? (
                'Update Contact'
              ) : (
                'Add Contact'
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Contact List Section */}
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" className="font-bold text-gray-800">
          Contact Information
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="max-w-2xl mx-auto">
          <SkeletonCard />
        </div>
      ) : contacts.length === 0 ? (
        <Alert severity="info" className="mb-6 max-w-2xl mx-auto">
          No contact information available. Add one above.
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {contacts.map((contact) => (
            <Card
              key={contact.id}
              className="shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <CardContent>
                <div className="flex justify-between items-start">
                  <Typography variant="h6" className="text-gray-800">
                    Contact #{contact.id}
                  </Typography>
                  {role === 'admin' && (
                    <div>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(contact)}
                        disabled={loading}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(contact.id)}
                        disabled={loading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  )}
                </div>
                <Typography className="mt-2"><strong>Address:</strong> {contact.address}</Typography>
                <Typography><strong>Phone:</strong> {contact.phonenumbers}</Typography>
                <Typography><strong>Email:</strong> {contact.email}</Typography>
                <Typography><strong>Saturday:</strong> {contact.saturday}</Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddContactUs;