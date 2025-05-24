import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  saveAboutUs,
  getAllAboutUs,
  getAboutUsById,
  updateAboutUs,
  deleteAboutUs,
  clearAboutUsError,
  clearAboutUsSuccess,
  clearSelectedAboutUs,
} from '../../../store/aboutUsSlice';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddAboutUs = () => {
  const [formData, setFormData] = useState({
    mission: '',
    vision: '',
    achievements: '',
    brandbusinesspartners: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [fetchId, setFetchId] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { aboutUsEntries = [], selectedAboutUs, loading, error, successMessage } = useSelector((state) => state.aboutUs || {});
  const { token, role } = useSelector((state) => state.auth || {});

  // Redirect non-admins
  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  // Fetch all About Us entries on component mount
  useEffect(() => {
    dispatch(getAllAboutUs());
  }, [dispatch]);

  // Clear error/success messages after 5 seconds and show toasts
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 5000,
        style: { background: '#EF4444', color: '#FFFFFF', fontWeight: 'bold' },
      });
      const timer = setTimeout(() => {
        dispatch(clearAboutUsError());
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (successMessage) {
      toast.success(successMessage, {
        duration: 5000,
        style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
      });
      const timer = setTimeout(() => {
        dispatch(clearAboutUsSuccess());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  // Pre-fill form when selectedAboutUs changes (edit mode)
  useEffect(() => {
    if (selectedAboutUs) {
      setFormData({
        mission: selectedAboutUs.mission || '',
        vision: selectedAboutUs.vision || '',
        achievements: selectedAboutUs.achievements || '',
        brandbusinesspartners: selectedAboutUs.brandbusinesspartners || '',
        description: selectedAboutUs.description || '',
      });
    }
  }, [selectedAboutUs]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.mission.trim()) newErrors.mission = 'Mission is required';
    if (!formData.vision.trim()) newErrors.vision = 'Vision is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFetchById = async () => {
    if (!fetchId) {
      setErrors({ ...errors, fetch: 'About Us ID is required' });
      toast.error('Please enter an About Us ID', {
        style: { background: '#EF4444', color: '#FFFFFF', fontWeight: 'bold' },
      });
      return;
    }
    const result = await dispatch(getAboutUsById(fetchId));
    if (getAboutUsById.fulfilled.match(result)) {
      toast.success(`Fetched About Us #${fetchId} for editing`, {
        style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
      });
      setFetchId('');
    } else {
      toast.error(result.payload || 'Failed to fetch About Us', {
        style: { background: '#EF4444', color: '#FFFFFF', fontWeight: 'bold' },
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill all required fields', {
        style: { background: '#EF4444', color: '#FFFFFF', fontWeight: 'bold' },
      });
      return;
    }
    if (!token) {
      setErrors({ ...errors, auth: 'Authentication token missing' });
      toast.error('Authentication token missing', {
        style: { background: '#EF4444', color: '#FFFFFF', fontWeight: 'bold' },
      });
      return;
    }

    let result;
    if (selectedAboutUs) {
      // Update existing About Us
      result = await dispatch(updateAboutUs({ id: selectedAboutUs.id, formData }));
      if (updateAboutUs.fulfilled.match(result)) {
        toast.success(`About Us #${selectedAboutUs.id} updated successfully`, {
          style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
        });
      } else {
        toast.error(result.payload || 'Failed to update About Us', {
          style: { background: '#EF4444', color: '#FFFFFF', fontWeight: 'bold' },
        });
        return; // Prevent form reset on failure
      }
    } else {
      // Save new About Us
      result = await dispatch(saveAboutUs(formData));
      if (saveAboutUs.fulfilled.match(result)) {
        toast.success('About Us added successfully', {
          style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
        });
      } else {
        toast.error(result.payload || 'Failed to save About Us', {
          style: { background: '#EF4444', color: '#FFFFFF', fontWeight: 'bold' },
        });
        return; // Prevent form reset on failure
      }
    }

    // Reset form and clear edit mode only on success
    setFormData({ mission: '', vision: '', achievements: '', brandbusinesspartners: '', description: '' });
    dispatch(clearSelectedAboutUs());
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteAboutUs(id));
    if (deleteAboutUs.fulfilled.match(result)) {
      toast.success(`About Us #${id} deleted successfully`, {
        style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
      });
    } else {
      toast.error(result.payload || 'Failed to delete About Us', {
        style: { background: '#EF4444', color: '#FFFFFF', fontWeight: 'bold' },
      });
    }
  };

  const handleRefresh = () => {
    dispatch(getAllAboutUs());
    toast.success('Refreshed About Us entries', {
      style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
    });
  };

  const handleClearForm = () => {
    setFormData({ mission: '', vision: '', achievements: '', brandbusinesspartners: '', description: '' });
    dispatch(clearSelectedAboutUs());
    toast.success('Form cleared', {
      style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
    });
  };

  const SkeletonCard = () => (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md animate-pulse">
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <Typography variant="h4" className="font-bold text-gray-800 mb-6 text-center">
        Admin Panel - About Us Management
      </Typography>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto mb-10 p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {selectedAboutUs ? `Edit About Us #${selectedAboutUs.id}` : 'Add New About Us'}
        </h2>
        {errors.auth && <Alert severity="error" className="mb-4">{errors.auth}</Alert>}
        <div className="space-y-4">
          <div className="flex gap-4">
            <TextField
              label="About Us ID to Fetch"
              value={fetchId}
              onChange={(e) => setFetchId(e.target.value)}
              fullWidth
              variant="outlined"
              error={!!errors.fetch}
              helperText={errors.fetch}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleFetchById}
              disabled={loading}
            >
              Fetch
            </Button>
          </div>
          <TextField
            label="Mission"
            name="mission"
            value={formData.mission}
            onChange={handleChange}
            fullWidth
            error={!!errors.mission}
            helperText={errors.mission}
            variant="outlined"
          />
          <TextField
            label="Vision"
            name="vision"
            value={formData.vision}
            onChange={handleChange}
            fullWidth
            error={!!errors.vision}
            helperText={errors.vision}
            variant="outlined"
          />
          <TextField
            label="Achievements"
            name="achievements"
            value={formData.achievements}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Brand/Business Partners"
            name="brandbusinesspartners"
            value={formData.brandbusinesspartners}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={4}
            variant="outlined"
          />
          <div className="flex gap-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              fullWidth
              className="py-3"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : selectedAboutUs ? 'Update About Us' : 'Save About Us'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClearForm}
              disabled={loading}
              fullWidth
              className="py-3"
            >
              Clear Form
            </Button>
          </div>
        </div>
      </div>

      {/* About Us List Section */}
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" className="font-bold text-gray-800">
          All About Us Entries
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : aboutUsEntries.length === 0 ? (
        <Alert severity="info">No About Us entries found.</Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aboutUsEntries.map((entry) => (
            <Card
              key={entry.id}
              className="shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <CardContent>
                <div className="flex justify-between items-start">
                  <Typography variant="h6" className="font-semibold text-gray-800">
                    About Us #{entry.id}
                  </Typography>
                  <div className="flex gap-2">
                    <IconButton
                      color="primary"
                      onClick={() => dispatch(getAboutUsById(entry.id))}
                      disabled={loading}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(entry.id)}
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
                <Typography className="text-sm text-gray-600 mt-1">
                  <strong>Mission:</strong> {entry.mission}
                </Typography>
                <Typography className="text-sm text-gray-600">
                  <strong>Vision:</strong> {entry.vision}
                </Typography>
                <Typography className="text-sm text-gray-600">
                  <strong>Achievements:</strong> {entry.achievements || 'None'}
                </Typography>
                <Typography className="text-sm text-gray-600">
                  <strong>Partners:</strong> {entry.brandbusinesspartners || 'None'}
                </Typography>
                <Typography className="text-sm text-gray-600 mt-2">
                  <strong>Description:</strong> {entry.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddAboutUs;