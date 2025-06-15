import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
} from '@mui/material';
import { addDesktop } from '../../../../store/static/desktopSlice';
import { API_BASE_URL } from '../../../../store/api';
import { useNavigate } from 'react-router-dom';

const AddDesktop = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.desktops);
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    productid: '',
    name: '',
    quantity: '',
    regularprice: '',
    specialprice: '',
    processorbrand: '',
    generation: '',
    processortype: '',
    warranty: 0,
    displaysizerange: '',
    ram: '',
    graphicsmemory: '',
    operatingsystem: '',
    title: '',
    details: '',
    specification: '',
    color: '',
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes, brandsRes, itemsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/catagories/get`),
          fetch(`${API_BASE_URL}/api/Product/getall`),
          fetch(`${API_BASE_URL}/api/brands/get/all`),
          fetch(`${API_BASE_URL}/api/product/items/get`),
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();
        const brandsData = await brandsRes.json();
        const itemsData = await itemsRes.json();

        setCategories(catData);
        setProducts(prodData);
        setBrands(brandsData);
        setProductItems(itemsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formState.product.id) {
      const fetchProductItems = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/item/findbyproductid/get/${formState.product.id}`
          );
          const data = await response.json();
          setProductItems(data);
        } catch (err) {
          console.error('Failed to fetch product items:', err);
        }
      };
      fetchProductItems();
    } else {
      setProductItems([]);
    }
  }, [formState.product.id]);

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
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (index === 0) {
        setImageA(file);
        setMainImagePreview(reader.result);
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

    if (!formState.catagory.id) {
      alert('Category is required.');
      return;
    }

    try {
      const formDataObject = {
        desktoppcall: {
          ...formState,
          productItem: formState.productItem.id ? { id: parseInt(formState.productItem.id) } : null,
        },
        imagea,
        imageb,
        imagec,
      };

      await dispatch(addDesktop({ formDataObject, token })).unwrap();
      alert('Desktop added successfully!');
      setFormState({
        productid: '',
        name: '',
        quantity: '',
        regularprice: '',
        specialprice: '',
        processorbrand: '',
        generation: '',
        processortype: '',
        warranty: 0,
        displaysizerange: '',
        ram: '',
        graphicsmemory: '',
        operatingsystem: '',
        title: '',
        details: '',
        specification: '',
        color: '',
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
      navigate('/admin/desktops/add-desktop');
    } catch (error) {
      console.error('Error adding desktop:', error);
      alert('Failed to add desktop: ' + (error || 'Unknown error'));
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, mx: 'auto', p: 2 }}
    >
      <Typography variant="h5" fontWeight={600}>
        Add Desktop
      </Typography>

      <TextField
        name="productid"
        label="Product ID"
        value={formState.productid}
        onChange={handleChange}
        required
      />
      <TextField
        name="name"
        label="Desktop Name"
        value={formState.name}
        onChange={handleChange}
        required
      />

      <FormControl fullWidth required>
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
      </FormControl>

      <FormControl fullWidth>
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

      <FormControl fullWidth>
        <InputLabel>Product Item (Mega-menu)</InputLabel>
        <Select
          name="productItem.id"
          value={formState.productItem?.id || ''}
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
      </FormControl>

      <FormControl fullWidth>
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
      </FormControl>

      <TextField
        name="quantity"
        type="number"
        label="Quantity"
        value={formState.quantity}
        onChange={handleChange}
        required
      />
      <TextField
        name="regularprice"
        type="number"
        label="Regular Price"
        value={formState.regularprice}
        onChange={handleChange}
        required
      />
      <TextField
        name="specialprice"
        type="number"
        label="Special Price"
        value={formState.specialprice}
        onChange={handleChange}
        required
      />
      <TextField
        name="processorbrand"
        label="Processor Brand"
        value={formState.processorbrand}
        onChange={handleChange}
        required
      />
      <TextField
        name="generation"
        label="Generation"
        value={formState.generation}
        onChange={handleChange}
        required
      />
      <TextField
        name="processortype"
        label="Processor Type"
        value={formState.processortype}
        onChange={handleChange}
        required
      />
      <TextField
        name="displaysizerange"
        label="Display Size Range"
        value={formState.displaysizerange}
        onChange={handleChange}
        required
      />
      <TextField
        name="ram"
        label="RAM"
        value={formState.ram}
        onChange={handleChange}
        required
      />
      <TextField
        name="graphicsmemory"
        label="Graphics Memory"
        value={formState.graphicsmemory}
        onChange={handleChange}
        required
      />
      <TextField
        name="operatingsystem"
        label="Operating System"
        value={formState.operatingsystem}
        onChange={handleChange}
        required
      />
      <TextField
        name="color"
        label="Color"
        value={formState.color}
        onChange={handleChange}
        required
      />
      <TextField
        name="details"
        label="Details"
        fullWidth
        multiline
        rows={4}
        value={formState.details}
        onChange={handleChange}
        inputProps={{ maxLength: 1000 }}
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
      />
      <TextField
        name="title"
        label="Additional Information"
        value={formState.title}
        onChange={handleChange}
        multiline
        rows={4}
        inputProps={{ maxLength: 1000 }}
      />
      <TextField
        name="warranty"
        type="number"
        label="Warranty (Months)"
        value={formState.warranty}
        onChange={handleChange}
        required
      />

      <Box>
        <Typography variant="subtitle1">Image A (Main)</Typography>
        {mainImagePreview && (
          <Avatar src={mainImagePreview} variant="rounded" sx={{ width: 80, height: 80, mb: 1 }} />
        )}
        <Button component="label" variant="outlined">
          Upload Image A
          <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, 0)} required />
        </Button>
      </Box>

      {[1, 2].map((index) => (
        <Box key={index}>
          <Typography variant="subtitle1">Image {index} (Gallery)</Typography>
          {additionalImagesPreviews[index - 1] && (
            <Avatar
              src={additionalImagesPreviews[index - 1]}
              variant="rounded"
              sx={{ width: 60, height: 60, mb: 1 }}
            />
          )}
          <Button component="label" variant="outlined">
            Upload Image {index}
            <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, index)} required />
          </Button>
        </Box>
      ))}

      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? 'Uploading...' : 'Add Desktop'}
      </Button>

      {error && <Alert severity="error">Error: {error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
    </Box>
  );
};

export default AddDesktop;