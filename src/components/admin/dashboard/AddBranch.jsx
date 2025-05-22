import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {   saveBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  clearBranchError,
  clearBranchSuccess,
  clearSelectedBranch } from '../../../store/branchSlice';
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


const AddBranch = () => {
    
  const [formData, setFormData] = useState({
    id: '',
    branchname: '',
    branchaddress: '',
    phonenumber: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [fetchId, setFetchId] = useState('');

  const dispatch = useDispatch();
  const { branches, selectedBranch, loading, error, successMessage } = useSelector((state) => state.branch);
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');

  // Clear error/success messages after 5 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearBranchError());
        dispatch(clearBranchSuccess());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  // Pre-fill form when selectedBranch changes
  useEffect(() => {
    if (selectedBranch) {
      setFormData({
        id: selectedBranch.id || '',
        branchname: selectedBranch.branchname || '',
        branchaddress: selectedBranch.branchaddress || '',
        phonenumber: selectedBranch.phonenumber || '',
        description: selectedBranch.description || '',
      });
    }
  }, [selectedBranch]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.branchname.trim()) newErrors.branchname = 'Branch name is required';
    if (!formData.branchaddress.trim()) newErrors.branchaddress = 'Branch address is required';
    if (!formData.phonenumber.trim()) newErrors.phonenumber = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFetchById = () => {
    if (fetchId && token) {
      dispatch(getBranchById(fetchId));
      setFetchId('');
    } else {
      setErrors({ ...errors, fetch: 'Branch ID and authentication token are required' });
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (!token) {
        setErrors({ ...errors, auth: 'Authentication token missing' });
        return;
      }
      if (formData.id) {
        // Update existing branch
        dispatch(updateBranch({ id: formData.id, formData }));
      } else {
        // Save new branch
        dispatch(saveBranch(formData));
      }
      setFormData({ id: '', branchname: '', branchaddress: '', phonenumber: '', description: '' });
      dispatch(clearSelectedBranch());
    }
  };

  const handleDelete = (id) => {
    if (token) {
      dispatch(deleteBranch(id));
    } else {
      setErrors({ ...errors, auth: 'Authentication token missing' });
    }
  };

  const handleRefresh = () => {
    dispatch(getAllBranches());
  };

  const handleClearForm = () => {
    setFormData({ id: '', branchname: '', branchaddress: '', phonenumber: '', description: '' });
    dispatch(clearSelectedBranch());
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
        Admin Panel - Branch Management
      </Typography>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto mb-10 p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {formData.id ? 'Update Branch' : 'Add New Branch'}
        </h2>
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        {successMessage && <Alert severity="success" className="mb-4">{successMessage}</Alert>}
        {errors.auth && <Alert severity="error" className="mb-4">{errors.auth}</Alert>}
        <div className="space-y-4">
          <div className="flex gap-4">
            <TextField
              label="Branch ID to Fetch"
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
            label="Branch Name"
            name="branchname"
            value={formData.branchname}
            onChange={handleChange}
            fullWidth
            error={!!errors.branchname}
            helperText={errors.branchname}
            variant="outlined"
          />
          <TextField
            label="Branch Address"
            name="branchaddress"
            value={formData.branchaddress}
            onChange={handleChange}
            fullWidth
            error={!!errors.branchaddress}
            helperText={errors.branchaddress}
            variant="outlined"
          />
          <TextField
            label="Phone Number"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleChange}
            fullWidth
            error={!!errors.phonenumber}
            helperText={errors.phonenumber}
            variant="outlined"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : formData.id ? 'Update Branch' : 'Save Branch'}
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

      {/* Branch List Section */}
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" className="font-bold text-gray-800">
          All Branches
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
      ) : branches.length === 0 ? (
        <Alert severity="info">No branches found.</Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <Card
              key={branch.id}
              className="shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <CardContent>
                <div className="flex justify-between items-start">
                  <Typography variant="h6" className="font  font-semibold text-gray-800">
                    {branch.branchname}
                  </Typography>
                  <div className="flex gap-2">
                    <IconButton
                      color="primary"
                      onClick={() => dispatch(getBranchById(branch.id))}
                      disabled={loading}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(branch.id)}
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
                <Typography className="text-sm text-gray-600 mt-1">
                  {branch.branchaddress}
                </Typography>
                <Typography className="text-sm text-gray-600">
                  Phone: {branch.phonenumber}
                </Typography>
                <Typography className="text-sm text-gray-600 mt-2">
                  {branch.description || 'No description available'}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddBranch;
