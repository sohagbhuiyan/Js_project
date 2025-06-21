import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { addNetwork, clearMessages } from '../../../../store/static/networkSlice';
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { API_BASE_URL } from '../../../../store/api';

const AddNetwork = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage, networks } = useSelector((state) => state.networks);
  const { token, user } = useSelector((state) => state.auth);

  const [formState, setFormState] = useState({
    productid: '',
    name: '',
    technology: '',
    speed: '',
    frequency: '',
    quantity: '',
    regularprice: '',
    specialprice: '',
    warranty: '',
    details: '',
    color:'',
    specification: '',
    catagory: { id: '' },
    brand: { id: '' },
    productItem: { id: '' },
    portside: '',
    mimotechnology: '',
    vpnsupport: '',
    wificoveragerange: '',
    datatransferrate: '',
    datatransferratewifi: '',
    numberoflanport: '',
    numberofwanport: '',
    wannetworkstandard: '',
    lannetworkstandard: '',
    wifigeneration: '',
  });

  const [imagea, setImageA] = useState(null);
  const [imageb, setImageB] = useState(null);
  const [imagec, setImageC] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState([null, null]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const dropdownOptions = {
    technology: ['Wi-Fi', 'Ethernet', 'Bluetooth', '4G', '5G'],
    speed: ['100 Mbps', '1 Gbps', '10 Gbps', '25 Gbps', '100 Gbps'],
    frequency: ['2.4 GHz', '5 GHz', '6 GHz', 'Dual Band', 'Tri Band'],
    warranty: ['1', '2', '3', '4'],
    mimotechnology: ['2x2', '4x4', '8x8'],
    vpnsupport: ['Yes', 'No'],
    wificoveragerange: ['100m', '200m', '300m', '500m', '1000m'],
    datatransferrate: ['100Mbps', '1Gbps', '2.5Gbps', '5Gbps', '10Gbps'],
    datatransferratewifi: ['300Mbps', '600Mbps', '1200Mbps', '2400Mbps', '4800Mbps'],
    numberoflanport: ['1', '2', '4', '8', '16'],
    numberofwanport: ['1', '2', '4'],
    wannetworkstandard: ['10/100', 'Gigabit', '2.5GbE', '10GbE'],
    lannetworkstandard: ['10/100', 'Gigabit', '2.5GbE', '10GbE'],
    wifigeneration: ['Wi-Fi 4', 'Wi-Fi 5', 'Wi-Fi 6', 'Wi-Fi 6E', 'Wi-Fi 7'],
    color: ['Black', 'White', 'Grey', 'Silver', 'Red', 'Green' ],
  };

  // Fetch categories, brands, and product items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandsRes, itemsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/catagories/get`),
          fetch(`${API_BASE_URL}/api/brands/get/all`),
          fetch(`${API_BASE_URL}/api/product/items/get`),
        ]);

        if (!catRes || !brandsRes || !itemsRes) {
          throw new Error('Failed to fetch data');
        }

        const catData = await catRes.json();
        const brandsData = await brandsRes.json();
        const itemsData = await itemsRes.json();

        setCategories(catData);
        setBrands(brandsData);
        setProductItems(itemsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setFormErrors({ api: 'Failed to load categories, brands, or product items' });
      }
    };

    fetchData();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token || !user?.id) {
      toast.error('Please log in to add a network.', { duration: 2000 });
      navigate('/login', { state: { from: '/add-network' } });
    }
  }, [token, user, navigate]);

  // Handle success and error messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { duration: 2000 });
      dispatch(clearMessages());
      setFormState({
        productid: '',
        name: '',
        technology: '',
        speed: '',
        frequency: '',
        quantity: '',
        regularprice: '',
        specialprice: '',
        warranty: '',
        details: '',
        specification: '',
        color:'',
        catagory: { id: '' },
        brand: { id: '' },
        productItem: { id: '' },
        portside: '',
        mimotechnology: '',
        vpnsupport: '',
        wificoveragerange: '',
        datatransferrate: '',
        datatransferratewifi: '',
        numberoflanport: '',
        numberofwanport: '',
        wannetworkstandard: '',
        lannetworkstandard: '',
        wifigeneration: '',
      });
      setImageA(null);
      setImageB(null);
      setImageC(null);
      setMainImagePreview(null);
      setAdditionalImagesPreviews([null, null]);
      setFormErrors({});
    }
    if (error) {
      toast.error(error, { duration: 2000 });
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch]);

  const validateForm = () => {
    const errors = {};
    if (!formState.productid) errors.productid = 'Product ID is required';
    if (!formState.name) errors.name = 'Network name is required';
    if (!formState.technology) errors.technology = 'Technology is required';
    if (!formState.speed) errors.speed = 'Speed is required';
    if (!formState.frequency) errors.frequency = 'Frequency is required';
    if (!formState.quantity || formState.quantity <= 0) errors.quantity = 'Valid quantity is required';
    if (!formState.regularprice || formState.regularprice <= 0) errors.regularprice = 'Valid regular price is required';
    if (!formState.specialprice || formState.specialprice < 0) errors.specialprice = 'Valid special price is required';
    if (!formState.warranty) errors.warranty = 'Warranty is required';
    if (!formState.catagory.id) errors.catagory = 'Category is required';
    if (!imagea) errors.imagea = 'Main image is required';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'catagory.id') {
      setFormState((prev) => ({
        ...prev,
        catagory: { id: value },
      }));
    } else if (name === 'brand.id') {
      setFormState((prev) => ({
        ...prev,
        brand: { id: value },
      }));
    } else if (name === 'productItem.id') {
      setFormState((prev) => ({
        ...prev,
        productItem: { id: value },
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormErrors((prev) => ({ ...prev, [`image${index}`]: 'Please upload an image file' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (index === 0) {
        setImageA(file);
        setMainImagePreview(reader.result);
        setFormErrors((prev) => ({ ...prev, imagea: '' }));
      } else if (index === 1) {
        setImageB(file);
        setAdditionalImagesPreviews((prev) => {
          const updated = [...prev];
          updated[0] = reader.result;
          return updated;
        });
      } else if (index === 2) {
        setImageC(file);
        setAdditionalImagesPreviews((prev) => {
          const updated = [...prev];
          updated[1] = reader.result;
          return updated;
        });
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill out all required fields correctly.', { duration: 2000 });
      return;
    }

    try {
      const formDataObject = {
        allnetwork: {
          productid: formState.productid,
          name: formState.name,
          technology: formState.technology,
          speed: formState.speed,
          frequency: formState.frequency,
          quantity: parseInt(formState.quantity),
          regularprice: parseFloat(formState.regularprice),
          specialprice: parseFloat(formState.specialprice),
          warranty: parseInt(formState.warranty),
          details: formState.details,
          color: formState.color,
          specification: formState.specification,
          catagoryId: parseInt(formState.catagory.id),
          brandId: parseInt(formState.brand.id),
          productItemId: parseInt(formState.productItem.id),
          portside: formState.portside,
          mimotechnology: formState.mimotechnology,
          vpnsupport: formState.vpnsupport,
          wificoveragerange: formState.wificoveragerange,
          datatransferrate: formState.datatransferrate,
          datatransferratewifi: formState.datatransferratewifi,
          numberoflanport: parseInt(formState.numberoflanport) || 0,
          numberofwanport: parseInt(formState.numberofwanport) || 0,
          wannetworkstandard: formState.wannetworkstandard,
          lannetworkstandard: formState.lannetworkstandard,
          wifigeneration: formState.wifigeneration,
        },
        imagea,
        imageb,
        imagec,
      };

      await dispatch(addNetwork({ formDataObject, token })).unwrap();
      navigate('/admin/network/add-network');
    } catch (err) {
      console.error('Error adding network:', err);
      toast.error(`Failed to add network: ${err.message || 'Unknown error'}`, { duration: 2000 });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 600,
        mx: 'auto',
        p: { xs: 2, sm: 3 },
        mt: 4,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" fontWeight={600} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
        Add Network
      </Typography>

      {formErrors.api && <Alert severity="error">{formErrors.api}</Alert>}
      {error && <Alert severity="error">Error: {error}</Alert>}
      {networks.length > 0 && successMessage && (
        <Alert severity="success">Network added successfully!</Alert>
      )}

      <TextField
        name="productid"
        label="Product ID"
        value={formState.productid}
        onChange={handleChange}
        required
        fullWidth
        size="small"
        error={!!formErrors.productid}
        helperText={formErrors.productid}
        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
      />
      <TextField
        name="name"
        label="Network Name"
        value={formState.name}
        onChange={handleChange}
        required
        fullWidth
        size="small"
        error={!!formErrors.name}
        helperText={formErrors.name}
        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
      />

      <FormControl fullWidth required size="small" error={!!formErrors.catagory}>
        <InputLabel>Category</InputLabel>
        <Select
          name="catagory.id"
          value={formState.catagory.id}
          onChange={handleChange}
          label="Category"
        >
          <MenuItem value="">-- Select Category --</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
        {!!formErrors.catagory && <Typography color="error" variant="caption">{formErrors.catagory}</Typography>}
      </FormControl>

      <FormControl fullWidth required size="small" error={!!formErrors.brand}>
        <InputLabel>Brand</InputLabel>
        <Select
          name="brand.id"
          value={formState.brand.id}
          onChange={handleChange}
          label="Brand"
        >
          <MenuItem value="">-- Select Brand --</MenuItem>
          {brands.map((brand) => (
            <MenuItem key={brand.id} value={brand.id}>
              {brand.brandname}
            </MenuItem>
          ))}
        </Select>
        {!!formErrors.brand && <Typography color="error" variant="caption">{formErrors.brand}</Typography>}
      </FormControl>

      <FormControl fullWidth required size="small" error={!!formErrors.productItem}>
        <InputLabel>Product Item</InputLabel>
        <Select
          name="productItem.id"
          value={formState.productItem.id}
          onChange={handleChange}
          label="Product Item"
        >
          <MenuItem value="">-- Select Product Item --</MenuItem>
          {productItems.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.productitemname}
            </MenuItem>
          ))}
        </Select>
        {!!formErrors.productItem && <Typography color="error" variant="caption">{formErrors.productItem}</Typography>}
      </FormControl>

      <TextField
        name="quantity"
        type="number"
        label="Quantity"
        value={formState.quantity}
        onChange={handleChange}
        required
        fullWidth
        size="small"
        inputProps={{ min: 0 }}
        error={!!formErrors.quantity}
        helperText={formErrors.quantity}
      />
      <TextField
        name="regularprice"
        type="number"
        label="Regular Price"
        value={formState.regularprice}
        onChange={handleChange}
        required
        fullWidth
        size="small"
        inputProps={{ min: 0 }}
        error={!!formErrors.regularprice}
        helperText={formErrors.regularprice}
      />
      <TextField
        name="specialprice"
        type="number"
        label="Special Price"
        value={formState.specialprice}
        onChange={handleChange}
        required
        fullWidth
        size="small"
        inputProps={{ min: 0 }}
        error={!!formErrors.specialprice}
        helperText={formErrors.specialprice}
      />
      <TextField
        name="portside"
        label="Port Side"
        value={formState.portside}
        onChange={handleChange}
        fullWidth
        size="small"
      />

      {[
        { name: 'technology', label: 'Technology', options: dropdownOptions.technology },
        { name: 'speed', label: 'Speed', options: dropdownOptions.speed },
        { name: 'frequency', label: 'Frequency', options: dropdownOptions.frequency },
        { name: 'warranty', label: 'Warranty (Years)', options: dropdownOptions.warranty },
        { name: 'mimotechnology', label: 'MIMO Technology', options: dropdownOptions.mimotechnology },
        { name: 'vpnsupport', label: 'VPN Support', options: dropdownOptions.vpnsupport },
        { name: 'wificoveragerange', label: 'WiFi Coverage Range', options: dropdownOptions.wificoveragerange },
        { name: 'datatransferrate', label: 'Data Transfer Rate', options: dropdownOptions.datatransferrate },
        { name: 'datatransferratewifi', label: 'WiFi Data Transfer Rate', options: dropdownOptions.datatransferratewifi },
        { name: 'numberoflanport', label: 'Number of LAN Ports', options: dropdownOptions.numberoflanport },
        { name: 'numberofwanport', label: 'Number of WAN Ports', options: dropdownOptions.numberofwanport },
        { name: 'color', label: 'Color', options: dropdownOptions.color },
        { name: 'wannetworkstandard', label: 'WAN Network Standard', options: dropdownOptions.wannetworkstandard },
        { name: 'lannetworkstandard', label: 'LAN Network Standard', options: dropdownOptions.lannetworkstandard },
        { name: 'wifigeneration', label: 'WiFi Generation', options: dropdownOptions.wifigeneration },

      ].map((field) => (
        <FormControl fullWidth required={field.name in ['technology', 'speed', 'frequency', 'warranty']} key={field.name} size="small" error={!!formErrors[field.name]}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            name={field.name}
            value={formState[field.name]}
            onChange={handleChange}
            label={field.label}
          >
            <MenuItem value="">-- Select {field.label} --</MenuItem>
            {field.options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          {!!formErrors[field.name] && <Typography color="error" variant="caption">{formErrors[field.name]}</Typography>}
        </FormControl>
      ))}

      <TextField
        name="details"
        label="Details (comma-separated)"
        fullWidth
        multiline
        rows={4}
        value={formState.details}
        onChange={handleChange}
        inputProps={{ maxLength: 1000 }}
        size="small"
      />
      <TextField
        name="specification"
        label="Specification"
        fullWidth
        multiline
        rows={3}
        value={formState.specification}
        onChange={handleChange}
        inputProps={{ maxLength: 1000 }}
        size="small"
      />

      <Box>
        <Typography variant="subtitle1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Image A (Main Image)
        </Typography>
        {mainImagePreview && (
          <Avatar src={mainImagePreview} variant="rounded" sx={{ width: 80, height: 80, mb: 1 }} />
        )}
        <Button
          component="label"
          variant="outlined"
          color={formErrors.imagea ? 'error' : 'primary'}
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          Upload Image A
          <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, 0)} />
        </Button>
        {!!formErrors.imagea && <Typography color="error" variant="caption">{formErrors.imagea}</Typography>}
      </Box>

      {[1, 2].map((index) => (
        <Box key={index}>
          <Typography variant="subtitle1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Image {index} (Gallery)
          </Typography>
          {additionalImagesPreviews[index - 1] && (
            <Avatar
              src={additionalImagesPreviews[index - 1]}
              variant="rounded"
              sx={{ width: 60, height: 60, mb: 1 }}
            />
          )}
          <Button
            component="label"
            variant="outlined"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Upload Image {index}
            <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, index)} />
          </Button>
        </Box>
      ))}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ mt: 2, py: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}
      >
        {loading ? <CircularProgress size={24} /> : 'Add Network'}
      </Button>
      <Toaster />
    </Box>
  );
};

export default AddNetwork;
