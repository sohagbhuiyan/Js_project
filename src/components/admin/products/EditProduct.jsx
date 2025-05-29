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
import { fetchProductById, updateProductDetails, clearCurrentProduct } from '../../../store/productSlice';
import { API_BASE_URL } from '../../../store/api';

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct, loading, error, successMessage } = useSelector((state) => state.products);

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
    dispatch(fetchProductById(id));
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
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  // Populate form with current product data
  useEffect(() => {
    if (currentProduct) {
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
      setMainImagePreview(currentProduct.imagea || null);
      setAdditionalImagesPreviews([
        currentProduct.imageb || null,
        currentProduct.imagec || null,
      ]);
      if (currentProduct.product?.id) {
        const filtered = products.filter((prod) => prod.catagory?.id === currentProduct.catagory?.id);
        setFilteredProducts(filtered);
        fetchProductItems(currentProduct.product.id);
      }
    }
  }, [currentProduct, products]);

  // Fetch product items based on selected product
  const fetchProductItems = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/item/findbyproductid/get/${id}`
      );
      const data = await response.json();
      setProductItems(data);
    } catch (err) {
      console.error('Failed to fetch product items:', err);
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
      fetchProductItems(value);
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

    if (!formState.catagory.id || !formState.product.id || !formState.productItem.id) {
      alert('Category, product, and product item are required.');
      return;
    }

    try {
      const formDataObject = {
        productDetails: {
          ...formState,
          productItem: { id: parseInt(formState.productItem.id) },
        },
        imagea,
        imageb,
        imagec,
      };

      await dispatch(updateProductDetails({ id, formDataObject })).unwrap();
      alert('Product updated successfully!');
      navigate('/admin/products/view-product');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product: ' + (error || 'Unknown error'));
    }
  };

  if (loading && !currentProduct) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, mx: 'auto', p: 2 }}
    >
      <Typography variant="h5" fontWeight={600}>
        Edit Product
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
        label="Product Name"
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
        name="title"
        label="Title"
        value={formState.title}
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
        required
      />
      <TextField
        name="specification"
        label="Specification"
        fullWidth
        multiline
        rows={3}
        value={formState.specification}
        onChange={handleChange}
        required
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
          Upload New Image A
          <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, 0)} />
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
            Upload New Image {index}
            <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, index)} />
          </Button>
        </Box>
      ))}

      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? 'Updating...' : 'Update Product'}
      </Button>

      {error && <Alert severity="error">Error: {error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
    </Box>
  );
};

export default EditProduct;