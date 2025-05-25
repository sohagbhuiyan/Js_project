import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  saveMedia,
  getAllMedia,
  getMediaById,
  deleteMedia,
  clearMediaError,
  clearMediaSuccess,
} from '../../../store/mediaSlice';
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
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../store/api';

const AddMedia = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [fetchId, setFetchId] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mediaEntries = [], loading, error, successMessage } = useSelector((state) => state.media || {});
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');
  const role = useSelector((state) => state.auth.role) || localStorage.getItem('authRole');

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  useEffect(() => {
    dispatch(getAllMedia());
  }, [dispatch]);

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMediaError());
        dispatch(clearMediaSuccess());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'Please select an image file.' });
        setImageFile(null);
        setImagePreview('');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: '' });
    } else {
      setImageFile(null);
      setImagePreview('');
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const validateForm = () => {
    const newErrors = {};
    if (!imageFile) newErrors.image = 'An image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      setErrors({ ...errors, form: 'Please select an image' });
      return;
    }
    if (!token) {
      setErrors({ ...errors, auth: 'Authentication token missing' });
      return;
    }
    dispatch(saveMedia(imageFile));
    setImageFile(null);
    setImagePreview('');
  };

  const handleDelete = (id) => {
    if (!token) {
      setErrors({ ...errors, auth: 'Authentication token missing' });
      return;
    }
    dispatch(deleteMedia(id));
  };

  const handleRefresh = () => {
    dispatch(getAllMedia());
  };

  const SkeletonCard = () => (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md animate-pulse">
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-48 bg-gray-300 rounded"></div>
    </div>
  );

  return (
    <div className=" p-6">
      <Typography variant="h4" className="font-bold text-gray-800 mb-6 text-center">
        Media Management
      </Typography>

      {/* Upload Section */}
      <div className="max-w-2xl mx-auto mb-10 p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Media Image</h2>
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        {successMessage && <Alert severity="success" className="mb-4">{successMessage}</Alert>}
        {errors.auth && <Alert severity="error" className="mb-4">{errors.auth}</Alert>}
        {errors.form && <Alert severity="error" className="mb-4">{errors.form}</Alert>}
        <div className="space-y-4">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="block w-full text-sm text-gray-500 file:mr-2 file:py-2 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
          </div>
          {imagePreview && (
            <div className="mt-4">
              <Typography className="text-sm text-gray-600 mb-2">Image Preview:</Typography>
              <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded-md shadow-md" style={{ maxHeight: '200px' }} />
            </div>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            fullWidth
            className="py-3"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Media'}
          </Button>
        </div>
      </div>

      {/* Media List Section */}
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" className="font-bold text-gray-800">
          Media Entries
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
        <div className="max-w-2xl mx-auto"><SkeletonCard /></div>
      ) : mediaEntries.length === 0 ? (
        <Alert severity="info" className="mb-6 max-w-2xl mx-auto">
          No media entry found. Add one above.
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {mediaEntries.map((media) => (
            <Card key={media.id} className="shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1">
              <CardContent>
                <div className="flex justify-between items-start">
                  <Typography variant="h6" className=" text-gray-800">
                    Media #{media.id}
                  </Typography>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(media.id)}
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
                <img
                  src={`${API_BASE_URL}/images/${media.imagea}`}
                  alt={`Media ${media.id}`}
                  className="mt-4 max-w-full h-auto rounded-md shadow-md"
                  style={{ maxHeight: '300px' }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddMedia;
