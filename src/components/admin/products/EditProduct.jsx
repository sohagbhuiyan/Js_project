import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
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
import { fetchProductDetailsById, updateProductDetails, clearCurrentProduct } from '../../../store/productSlice';
import { API_BASE_URL } from '../../../store/api';

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct, loading, error, successMessage } = useSelector((state) => state.products);
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');

  const [formState, setFormState] = useState({
    productid: '',
    name: '',
    quantity: '',
    regularprice: '',
    specialprice: '',
    title: '',
    details: '',
    specification: '',
    warranty: 0,
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

  // Fetch product details and other data on mount
  useEffect(() => {
    dispatch(fetchProductDetailsById(id));
    
    const fetchData = async () => {
      try {
        const [catRes, prodRes, brandsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/catagories/get`),
          fetch(`${API_BASE_URL}/api/Product/getall`),
          fetch(`${API_BASE_URL}/api/brands/get/all`),
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();
        const brandsData = await brandsRes.json();

        setCategories(catData || []);
        setProducts(prodData || []);
        setBrands(brandsData || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    
    fetchData();
    
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  // Populate form with current product data
  useEffect(() => {
    if (currentProduct) {
      console.log('Current Product Data:', currentProduct); // Debug log
      
      setFormState({
        productid: currentProduct.productid || '',
        name: currentProduct.name || '',
        quantity: currentProduct.quantity || '',
        regularprice: currentProduct.regularprice || '',
        specialprice: currentProduct.specialprice || '',
        title: currentProduct.title || '',
        details: currentProduct.details || '',
        specification: currentProduct.specification || '',
        warranty: currentProduct.warranty || 0,
        catagory: { id: currentProduct.catagory?.id || '' },
        product: { id: currentProduct.product?.id || '' },
        brand: { id: currentProduct.brand?.id || '' },
        productItem: { id: currentProduct.productItem?.id || '' },
      });

      // Set image previews
      setMainImagePreview(currentProduct.imagea || null);
      setAdditionalImagesPreviews([
        currentProduct.imageb || null,
        currentProduct.imagec || null,
      ]);

      // Filter products based on selected category
      if (currentProduct.catagory?.id && products.length > 0) {
        const filtered = products.filter((prod) => prod.catagory?.id === currentProduct.catagory?.id);
        setFilteredProducts(filtered);
      }

      // Fetch product items if product is selected
      if (currentProduct.product?.id) {
        fetchProductItems(currentProduct.product.id);
      }
    }
  }, [currentProduct, products]);

  // Fetch product items based on selected product
  const fetchProductItems = async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/item/findbyproductid/get/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProductItems(data || []);
      } else {
        console.error('Failed to fetch product items');
        setProductItems([]);
      }
    } catch (err) {
      console.error('Failed to fetch product items:', err);
      setProductItems([]);
    }
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
      if (value) {
        fetchProductItems(value);
      } else {
        setProductItems([]);
      }
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

    // Validation
    if (!formState.catagory.id || !formState.product.id || !formState.productItem.id) {
      alert('Category, product, and product item are required.');
      return;
    }

    try {
      // Prepare form data object with proper structure
      const formDataObject = {
        productDetails: {
          id: parseInt(id), // Include the ID for update
          productid: formState.productid,
          name: formState.name,
          quantity: parseInt(formState.quantity),
          regularprice: parseFloat(formState.regularprice),
          specialprice: parseFloat(formState.specialprice),
          title: formState.title,
          details: formState.details,
          specification: formState.specification,
          warranty: parseInt(formState.warranty),
          catagory: { id: parseInt(formState.catagory.id) },
          product: { id: parseInt(formState.product.id) },
          brand: { id: parseInt(formState.brand.id) },
          productItem: { id: parseInt(formState.productItem.id) },
        },
        imagea: imagea,
        imageb: imageb,
        imagec: imagec,
      };

      console.log('Submitting form data:', formDataObject); // Debug log

      const result = await dispatch(updateProductDetails({ 
        id: parseInt(id), 
        formDataObject, 
        token 
      })).unwrap();

      console.log('Update result:', result); // Debug log
      alert('Product updated successfully!');
      navigate('/admin/products/view-product');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product: ' + (error?.message || error || 'Unknown error'));
    }
  };

  if (loading && !currentProduct) {
    return (
      <Box className="flex justify-center mt-8">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      <Typography variant="h5" className="font-bold text-gray-800">
        Edit Product
      </Typography>

      {error && <Alert severity="error">Error: {error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <TextField
        name="productid"
        label="Product ID"
        value={formState.productid}
        onChange={handleChange}
        required
        className="w-full"
      />
      
      <TextField
        name="name"
        label="Product Name"
        value={formState.name}
        onChange={handleChange}
        required
        className="w-full"
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

      <FormControl fullWidth required>
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

      <FormControl fullWidth required>
        <InputLabel>Product Item (Mega-menu)</InputLabel>
        <Select
          name="productItem.id"
          value={formState.productItem.id}
          onChange={handleChange}
          label="Product Item (Mega-menu)"
          disabled={!formState.product.id || productItems.length === 0}
        >
          <MenuItem value="">
            {productItems.length === 0 ? '-- No Mega-menu Available --' : '-- Select Product Item (Mega-menu) --'}
          </MenuItem>
          {productItems.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.productitemname || item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
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
        className="w-full"
      />
      
      <TextField
        name="regularprice"
        type="number"
        label="Regular Price"
        value={formState.regularprice}
        onChange={handleChange}
        required
        className="w-full"
        inputProps={{ step: "0.01" }}
      />
      
      <TextField
        name="specialprice"
        type="number"
        label="Special Price"
        value={formState.specialprice}
        onChange={handleChange}
        required
        className="w-full"
        inputProps={{ step: "0.01" }}
      />
      
      <TextField
        name="title"
        label="Additional Information"
        value={formState.title}
        onChange={handleChange}
        required
        className="w-full"
      />
      
      <TextField
        name="details"
        label="Details"
        multiline
        rows={4}
        value={formState.details}
        onChange={handleChange}
        required
        className="w-full"
      />
      
      <TextField
        name="specification"
        label="Specification"
        multiline
        rows={3}
        value={formState.specification}
        onChange={handleChange}
        required
        className="w-full"
      />
      
      <TextField
        name="warranty"
        type="number"
        label="Warranty (year)"
        value={formState.warranty}
        onChange={handleChange}
        required
        className="w-full"
      />

      <Box>
        <Typography variant="subtitle1" className="text-gray-700">
          Image A (Main)
        </Typography>
        {mainImagePreview && (
          <Avatar src={mainImagePreview} variant="rounded" className="w-20 h-20 mb-2" />
        )}
        <Button component="label" variant="outlined" className="border-gray-300 hover:border-gray-400">
          Upload New Image A
          <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, 0)} />
        </Button>
      </Box>

      {[1, 2].map((index) => (
        <Box key={index}>
          <Typography variant="subtitle1" className="text-gray-700">
            Image {index === 1 ? 'B' : 'C'} (Gallery)
          </Typography>
          {additionalImagesPreviews[index - 1] && (
            <Avatar
              src={additionalImagesPreviews[index - 1]}
              variant="rounded"
              className="w-16 h-16 mb-2"
            />
          )}
          <Button component="label" variant="outlined" className="border-gray-300 hover:border-gray-400">
            Upload New Image {index === 1 ? 'B' : 'C'}
            <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, index)} />
          </Button>
        </Box>
      ))}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 mt-4"
      >
        {loading ? 'Updating...' : 'Update Product'}
      </Button>
    </Box>
  );
};

export default EditProduct;