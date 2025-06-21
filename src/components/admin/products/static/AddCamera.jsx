import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { addCamera, clearMessages } from '../../../../store/static/cameraSlice';
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

const AddCamera = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage, cameras } = useSelector((state) => state.cameras);
  const { token, user } = useSelector((state) => state.auth);

  const [formState, setFormState] = useState({
    productid: '',
    name: '',
    totalpixel: '',
    displaysize: '',
    digitalzoom: '',
    opticalzoom: '',
    quantity: '',
    regularprice: '',
    specialprice: '',
    warranty: '',
    title: '',
    details: '',
    specification: '',
    catagory: { id: '' },
    product: { id: '' },
    brand: { id: '' },
    productItem: { id: '' },
  });

  const [imagea, setImageA] = useState(null);
  const [imageb, setImageB] = useState(null);
  const [imagec, setImageC] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState([null, null]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const dropdownOptions = {
    totalpixel: ['5MP', '8MP', '12MP', '16MP', '20MP', '32MP','48MP', '64MP', '128MP', '144MP', '160MP', '200MP','228MP', '256MP', '260MP', '180MP'],
    displaysize: ['2.7 inch', '3.0 inch', '3.5 inch', '4.0 inch','4.5 inch', '5.0 inch','6.5 inch', '7.0 inch'],
    digitalzoom: ['2x', '4x', '8x', '16x','32x','64x'],
    opticalzoom: ['2x', '4x', '8x', '12x','24x','48x','64x'],
    warranty: ['1', '2', '3', '4','5','6']
  };

  // Fetch categories, products, and brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes, brandsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/catagories/get`),
          fetch(`${API_BASE_URL}/api/Product/getall`),
          fetch(`${API_BASE_URL}/api/brands/get/all`),
        ]);

        if (!catRes.ok || !prodRes.ok || !brandsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const catData = await catRes.json();
        const prodData = await prodRes.json();
        const brandsData = await brandsRes.json();

        setCategories(catData);
        setProducts(prodData);
        setBrands(brandsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setFormErrors({ api: 'Failed to load categories, products, or brands' });
      }
    };

    fetchData();
  }, []);

  // Fetch product items based on selected product
  useEffect(() => {
    if (formState.product.id) {
      const fetchProductItems = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/item/findbyproductid/get/${formState.product.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!response.ok) {
            throw new Error('Failed to fetch product items');
          }
          const data = await response.json();
          setProductItems(data);
        } catch (err) {
          console.error('Failed to fetch product items:', err);
          setFormErrors((prev) => ({ ...prev, productItems: 'Failed to load product items' }));
        }
      };
      fetchProductItems();
    } else {
      setProductItems([]);
    }
  }, [formState.product.id, token]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token || !user?.id) {
      toast.error('Please log in to add a camera.', { duration: 2000 });
      navigate('/login', { state: { from: '/admin/products/add-camera' } });
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
        totalpixel: '',
        displaysize: '',
        digitalzoom: '',
        opticalzoom: '',
        quantity: '',
        regularprice: '',
        specialprice: '',
        warranty: '',
        title: '',
        details: '',
        specification: '',
        catagory: { id: '' },
        product: { id: '' },
        brand: { id: '' },
        productItem: { id: '' },
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
    if (!formState.name) errors.name = 'Camera name is required';
    if (!formState.totalpixel) errors.totalpixel = 'Total pixel is required';
    if (!formState.displaysize) errors.displaysize = 'Display size is required';
    if (!formState.digitalzoom) errors.digitalzoom = 'Digital zoom is required';
    if (!formState.opticalzoom) errors.opticalzoom = 'Optical zoom is required';
    if (!formState.quantity || formState.quantity <= 0) errors.quantity = 'Valid quantity is required';
    if (!formState.regularprice || formState.regularprice <= 0) errors.regularprice = 'Valid regular price is required';
    if (!formState.specialprice || formState.specialprice < 0) errors.specialprice = 'Valid special price is required';
    if (!formState.warranty) errors.warranty = 'Warranty is required';
    if (!formState.catagory.id) errors.catagory = 'Category is required';
    if (!formState.brand.id) errors.brand = 'Brand is required';
    if (!imagea) errors.imagea = 'Main image is required';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'catagory.id') {
      setFormState((prev) => ({
        ...prev,
        catagory: { id: value },
        product: { id: '' },
        productItem: { id: '' },
      }));
      const filtered = products.filter((prod) => prod.catagory?.id === parseInt(value));
      setFilteredProducts(filtered);
      setProductItems([]);
    } else if (name === 'product.id') {
      setFormState((prev) => ({
        ...prev,
        product: { id: value },
        productItem: { id: '' },
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
        allCamera: {
          productid: formState.productid,
          name: formState.name,
          totalpixel: formState.totalpixel,
          displaysize: formState.displaysize,
          digitalzoom: formState.digitalzoom,
          opticalzoom: formState.opticalzoom,
          quantity: parseInt(formState.quantity),
          regularprice: parseFloat(formState.regularprice),
          specialprice: parseFloat(formState.specialprice),
          warranty: parseInt(formState.warranty),
          
          title: formState.title,
          details: formState.details,
          specification: formState.specification,
          catagory: { id: parseInt(formState.catagory.id) },
          product: formState.product.id ? { id: parseInt(formState.product.id) } : null,
          brand: { id: parseInt(formState.brand.id) },
          productItem: formState.productItem.id ? { id: parseInt(formState.productItem.id) } : null,
        },
        imagea,
        imageb,
        imagec,
      };

      await dispatch(addCamera({ formDataObject, token })).unwrap();
      navigate('/admin/cameras/add-camera');
    } catch (err) {
      console.error('Error adding camera:', err);
      toast.error(`Failed to add camera: ${err.message || 'Unknown error'}`, { duration: 2000 });
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
        Add Camera
      </Typography>

      {formErrors.api && <Alert severity="error">{formErrors.api}</Alert>}
      {error && <Alert severity="error">Error: {error}</Alert>}
      {cameras.length > 0 && successMessage && (
        <Alert severity="success">Camera added successfully!</Alert>
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
        label="Camera Name"
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
        <InputLabel>Category (Menu)</InputLabel>
        <Select
          name="catagory.id"
          value={formState.catagory.id}
          onChange={handleChange}
          label="Category (Menu)"
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

      <FormControl fullWidth size="small">
        <InputLabel>Product (Submenu)</InputLabel>
        <Select
          name="product.id"
          value={formState.product.id}
          onChange={handleChange}
          label="Product (Submenu)"
          disabled={filteredProducts.length === 0}
        >
          <MenuItem value="">
            {filteredProducts.length === 0 ? '-- No Submenu Available --' : '-- Select Product (Submenu) --'}
          </MenuItem>
          {filteredProducts.map((prod) => (
            <MenuItem key={prod.id} value={prod.id}>
              {prod.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>Product Item (Mega-menu)</InputLabel>
        <Select
          name="productItem.id"
          value={formState.productItem.id || ''}
          onChange={handleChange}
          label="Product Item (Mega-menu)"
          disabled={!formState.product.id || productItems.length === 0}
        >
          <MenuItem value="">
            {productItems.length === 0
              ? '-- No Mega-menu Available --'
              : '-- Select Product Item (Mega-menu) --'}
          </MenuItem>
          {productItems.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.productitemname || item.name}
            </MenuItem>
          ))}
        </Select>
        {!!formErrors.productItems && <Typography color="error" variant="caption">{formErrors.productItems}</Typography>}
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

      {[
        { name: 'totalpixel', label: 'Total Pixel', options: dropdownOptions.totalpixel },
        { name: 'displaysize', label: 'Display Size', options: dropdownOptions.displaysize },
        { name: 'digitalzoom', label: 'Digital Zoom', options: dropdownOptions.digitalzoom },
        { name: 'opticalzoom', label: 'Optical Zoom', options: dropdownOptions.opticalzoom },
        { name: 'warranty', label: 'Warranty (Years)', options: dropdownOptions.warranty },
      ].map((field) => (
        <FormControl fullWidth required key={field.name} size="small" error={!!formErrors[field.name]}>
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
        name="title"
        label="Aditional Info"
        fullWidth
        value={formState.title}
        onChange={handleChange}
        inputProps={{ maxLength: 5000 }}
        size="small"
      />
      <TextField
        name="details"
        label="Details (comma-separated)"
        fullWidth
        multiline
        rows={4}
        value={formState.details}
        onChange={handleChange}
        inputProps={{ maxLength: 5000 }}
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
        inputProps={{ maxLength: 5000 }}
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
        {loading ? <CircularProgress size={24} /> : 'Add Camera'}
      </Button>
      <Toaster />
    </Box>
  );
};

export default AddCamera;
