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
import { addLaptop } from '../../../../store/static/laptopSlice';
import { API_BASE_URL } from '../../../../store/api';
import { useNavigate } from 'react-router-dom';

const AddLaptop = () => {

  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.laptops);
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    productid: '',
    name: '',
    quantity: '',
    regularprice: '',
    specialprice: '',
    generation: '',
    processortype: '',
    warranty: '',
    displaysizerange: '',
    ram: '',
    graphicsmemory: '',
    operatingsystem: '',
    displayresolutionrange: '',
    touchscreen: '',
    maxramsupport: '',
    graphicschipset: '',
    lan: '',
    fingerprintsensor: '',
    weightrange: '',
    color: '',
    title:'',
    details:'',
    specification:'',
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
        allLaptop: {
          ...formState,
          productItem: formState.productItem.id ? { id: parseInt(formState.productItem.id) } : null,
        },
        imagea,
        imageb,
        imagec,
      };

      await dispatch(addLaptop({ formDataObject, token })).unwrap();
      alert('Laptop added successfully!');
      setFormState({
        productid: '',
        name: '',
        quantity: '',
        regularprice: '',
        specialprice: '',
        generation: '',
        processortype: '',
        warranty: '',
        displaysizerange: '',
        ram: '',
        graphicsmemory: '',
        operatingsystem: '',
        displayresolutionrange: '',
        touchscreen: '',
        maxramsupport: '',
        graphicschipset: '',
        lan: '',
        fingerprintsensor: '',
        weightrange: '',
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
      navigate('/admin/products/add-laptop');
    } catch (error) {
      console.error('Error adding laptop:', error);
      alert('Failed to add laptop: ' + (error || 'Unknown error'));
    }
  };

  const dropdownOptions = {
    processortype: [
      'Intel Core i3',
      'Intel Core i5',
      'Intel Core i7',
      'Intel Core i9',
      'AMD Ryzen 3',
      'AMD Ryzen 5',
      'AMD Ryzen 7',
      'AMD Ryzen 9',
    ],
    generation:['7th', '8th', '9th','10th','11th', '12th', '13th','14th','15th','16th', '17th', '18th','19th'],
    warranty: ['1', '2', '3','4'],
    displaysizerange: ['13"', '14"', '15"', '16"', '17"','18"', '19"', '20"', '21"','22"', '23"', '24"', '25"'],
    ram: ['4GB', '8GB', '16GB', '32GB', '64GB'],
    graphicsmemory: ['2GB', '4GB', '6GB', '8GB','10GB', '12GB'],
    operatingsystem: ['Windows 7','Windows 9', 'Windows 10','Windows 11','Windows 12', 'macOS', 'Linux'],
    displayresolutionrange: ['1366x768', '1920x1080', '2560x1440', '3840x2160'],
    touchscreen: ['Yes', 'No'],
    maxramsupport: ['16GB', '32GB', '64GB', '128GB'],
    graphicschipset: ['Intel Iris Xe', 'NVIDIA GeForce GTX', 'NVIDIA GeForce RTX', 'AMD Radeon'],
    lan: ['Yes', 'No', 'Gigabit Ethernet'],
    fingerprintsensor: ['Yes', 'No'],
    weightrange: ['<1.5kg', '1.5-2kg', '>2kg'],
    color: ['Silver', 'Black', 'Space Grey', 'Gold', 'White'],
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, mx: 'auto', p: 2 }}
    >
      <Typography variant="h5" fontWeight={600}>
        Add Laptop
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
        label="Laptop Name"
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

      <FormControl fullWidth required>
        <InputLabel>Generation</InputLabel>
        <Select
          name="generation"
          value={formState.generation}
          onChange={handleChange}
          label="Generation"
        >
          <MenuItem value="">-- Select Generation --</MenuItem>
          {dropdownOptions.generation.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>Processor Type</InputLabel>
        <Select
          name="processortype"
          value={formState.processortype}
          onChange={handleChange}
          label="Processor Type"
        >
          <MenuItem value="">-- Select Processor Type --</MenuItem>
          {dropdownOptions.processortype.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>Warranty (Years)</InputLabel>
        <Select
          name="warranty"
          value={formState.warranty}
          onChange={handleChange}
          label="Warranty (Years)"
        >
          <MenuItem value="">-- Select Warranty --</MenuItem>
          {dropdownOptions.warranty.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>Display Size Range</InputLabel>
        <Select
          name="displaysizerange"
          value={formState.displaysizerange}
          onChange={handleChange}
          label="Display Size Range"
        >
          <MenuItem value="">-- Select Display Size --</MenuItem>
          {dropdownOptions.displaysizerange.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>RAM</InputLabel>
        <Select
          name="ram"
          value={formState.ram}
          onChange={handleChange}
          label="RAM"
        >
          <MenuItem value="">-- Select RAM --</MenuItem>
          {dropdownOptions.ram.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>Graphics Memory</InputLabel>
        <Select
          name="graphicsmemory"
          value={formState.graphicsmemory}
          onChange={handleChange}
          label="Graphics Memory"
        >
          <MenuItem value="">-- Select Graphics Memory --</MenuItem>
          {dropdownOptions.graphicsmemory.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>Operating System</InputLabel>
        <Select
          name="operatingsystem"
          value={formState.operatingsystem}
          onChange={handleChange}
          label="Operating System"
        >
          <MenuItem value="">-- Select Operating System --</MenuItem>
          {dropdownOptions.operatingsystem.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>Display Resolution Range</InputLabel>
        <Select
          name="displayresolutionrange"
          value={formState.displayresolutionrange}
          onChange={handleChange}
          label="Display Resolution Range"
        >
          <MenuItem value="">-- Select Resolution --</MenuItem>
          {dropdownOptions.displayresolutionrange.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>Touchscreen</InputLabel>
        <Select
          name="touchscreen"
          value={formState.touchscreen}
          onChange={handleChange}
          label="Touchscreen"
        >
          <MenuItem value="">-- Select Touchscreen --</MenuItem>
          {dropdownOptions.touchscreen.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>Max RAM Support</InputLabel>
        <Select
          name="maxramsupport"
          value={formState.maxramsupport}
          onChange={handleChange}
          label="Max RAM Support"
        >
          <MenuItem value="">-- Select Max RAM Support --</MenuItem>
          {dropdownOptions.maxramsupport.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>Graphics Chipset</InputLabel>
        <Select
          name="graphicschipset"
          value={formState.graphicschipset}
          onChange={handleChange}
          label="Graphics Chipset"
        >
          <MenuItem value="">-- Select Graphics Chipset --</MenuItem>
          {dropdownOptions.graphicschipset.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>LAN</InputLabel>
        <Select
          name="lan"
          value={formState.lan}
          onChange={handleChange}
          label="LAN"
        >
          <MenuItem value="">-- Select LAN --</MenuItem>
          {dropdownOptions.lan.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>Fingerprint Sensor</InputLabel>
        <Select
          name="fingerprintsensor"
          value={formState.fingerprintsensor}
          onChange={handleChange}
          label="Fingerprint Sensor"
        >
          <MenuItem value="">-- Select Fingerprint Sensor --</MenuItem>
          {dropdownOptions.fingerprintsensor.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>Weight Range</InputLabel>
        <Select
          name="weightrange"
          value={formState.weightrange}
          onChange={handleChange}
          label="Weight Range"
        >
          <MenuItem value="">-- Select Weight Range --</MenuItem>
          {dropdownOptions.weightrange.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>Color</InputLabel>
        <Select
          name="color"
          value={formState.color}
          onChange={handleChange}
          label="Color"
        >
          <MenuItem value="">-- Select Color --</MenuItem>
          {dropdownOptions.color.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
        {loading ? 'Uploading...' : 'Add Laptop'}
      </Button>

      {error && <Alert severity="error">Error: {error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
    </Box>
  );
};

export default AddLaptop;
