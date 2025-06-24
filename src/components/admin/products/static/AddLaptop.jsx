// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   TextField,
//   MenuItem,
//   Button,
//   Box,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   Avatar,
//   Alert,
// } from '@mui/material';
// import { addLaptop } from '../../../../store/static/laptopSlice';
// import { API_BASE_URL } from '../../../../store/api';
// import { useNavigate } from 'react-router-dom';

// const AddLaptop = () => {
//   const dispatch = useDispatch();
//   const { loading, error, successMessage } = useSelector((state) => state.laptops);
//   const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');
//   const navigate = useNavigate();

//   const [formState, setFormState] = useState({
//     productid: '',
//     name: '',
//     quantity: '',
//     regularprice: '',
//     specialprice: '',
//     generation: '',
//     processortype: '',
//     warranty: '',
//     displaysizerange: '',
//     ram: '',
//     graphicsmemory: '',
//     operatingsystem: '',
//     displayresolutionrange: '',
//     touchscreen: '',
//     maxramsupport: '',
//     graphicschipset: '',
//     lan: '',
//     fingerprintsensor: '',
//     weightrange: '',
//     color: '',
//     title: '',
//     details: '',
//     specification: '',
//     catagory: { id: '' },
//     product: { id: '' },
//     brand: { id: '' },
//     productItem: { id: '' },
//   });

//   const [imagea, setImageA] = useState(null);
//   const [imageb, setImageB] = useState(null);
//   const [imagec, setImageC] = useState(null);
//   const [mainImagePreview, setMainImagePreview] = useState(null);
//   const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState([null, null]);
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [productItems, setProductItems] = useState([]);
//   const [formErrors, setFormErrors] = useState({});

//   const dropdownOptions = {
//     processortype: [
//       'Intel Core i3',
//       'Intel Core i5',
//       'Intel Core i7',
//       'Intel Core i9',
//       'AMD Ryzen 3',
//       'AMD Ryzen 5',
//       'AMD Ryzen 7',
//       'AMD Ryzen 9',
//     ],
//     generation: ['7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th'],
//     warranty: ['1', '2', '3', '4'],
//     displaysizerange: ['13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'],
//     ram: ['4GB', '8GB', '16GB', '32GB', '64GB'],
//     graphicsmemory: ['2GB', '4GB', '6GB', '8GB', '10GB', '12GB'],
//     operatingsystem: ['Windows 7', 'Windows 9', 'Windows 10', 'Windows 11', 'Windows 12', 'macOS', 'Linux'],
//     displayresolutionrange: ['1366x768', '1920x1080', '2560x1440', '3840x2160'],
//     touchscreen: ['Yes', 'No'],
//     maxramsupport: ['16GB', '32GB', '64GB', '128GB'],
//     graphicschipset: ['Intel Iris Xe', 'NVIDIA GeForce GTX', 'NVIDIA GeForce RTX', 'AMD Radeon'],
//     lan: ['Yes', 'No', 'Gigabit Ethernet'],
//     fingerprintsensor: ['Yes', 'No'],
//     weightrange: ['<1.5kg', '1.5-2kg', '>2kg'],
//     color: ['Silver', 'Black', 'Space Grey', 'Gold', 'White'],
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [catRes, prodRes, brandsRes] = await Promise.all([
//           fetch(`${API_BASE_URL}/api/catagories/get`),
//           fetch(`${API_BASE_URL}/api/Product/getall`),
//           fetch(`${API_BASE_URL}/api/brands/get/all`),
//         ]);

//         if (!catRes.ok || !prodRes.ok || !brandsRes.ok) {
//           throw new Error('Failed to fetch data');
//         }

//         const catData = await catRes.json();
//         const prodData = await prodRes.json();
//         const brandsData = await brandsRes.json();

//         setCategories(catData);
//         setProducts(prodData);
//         setBrands(brandsData);
//       } catch (err) {
//         console.error('Failed to fetch data:', err);
//         setFormErrors({ api: 'Failed to load categories, products, or brands' });
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (formState.product.id) {
//       const fetchProductItems = async () => {
//         try {
//           const response = await fetch(
//             `${API_BASE_URL}/api/item/findbyproductid/get/${formState.product.id}`
//           );
//           if (!response.ok) {
//             throw new Error('Failed to fetch product items');
//           }
//           const data = await response.json();
//           setProductItems(data);
//         } catch (err) {
//           console.error('Failed to fetch product items:', err);
//           setFormErrors((prev) => ({ ...prev, productItems: 'Failed to load product items' }));
//         }
//       };
//       fetchProductItems();
//     } else {
//       setProductItems([]);
//     }
//   }, [formState.product.id]);

//   const validateForm = () => {
//     const errors = {};
//     if (!formState.productid) errors.productid = 'Product ID is required';
//     if (!formState.name) errors.name = 'Laptop name is required';
//     if (!formState.quantity || formState.quantity <= 0) errors.quantity = 'Valid quantity is required';
//     if (!formState.regularprice || formState.regularprice <= 0) errors.regularprice = 'Valid regular price is required';
//     if (!formState.specialprice || formState.specialprice < 0) errors.specialprice = 'Valid special price is required';
//     if (!formState.generation) errors.generation = 'Generation is required';
//     if (!formState.processortype) errors.processortype = 'Processor type is required';
//     if (!formState.warranty) errors.warranty = 'Warranty is required';
//     if (!formState.displaysizerange) errors.displaysizerange = 'Display size is required';
//     if (!formState.ram) errors.ram = 'RAM is required';
//     if (!formState.graphicsmemory) errors.graphicsmemory = 'Graphics memory is required';
//     if (!formState.operatingsystem) errors.operatingsystem = 'Operating system is required';
//     if (!formState.displayresolutionrange) errors.displayresolutionrange = 'Display resolution is required';
//     if (!formState.touchscreen) errors.touchscreen = 'Touchscreen is required';
//     if (!formState.maxramsupport) errors.maxramsupport = 'Max RAM support is required';
//     if (!formState.graphicschipset) errors.graphicschipset = 'Graphics chipset is required';
//     if (!formState.lan) errors.lan = 'LAN is required';
//     if (!formState.fingerprintsensor) errors.fingerprintsensor = 'Fingerprint sensor is required';
//     if (!formState.weightrange) errors.weightrange = 'Weight range is required';
//     if (!formState.color) errors.color = 'Color is required';
//     if (!formState.catagory.id) errors.catagory = 'Category is required';
//     if (!formState.brand.id) errors.brand = 'Brand is required';
//     if (!imagea) errors.imagea = 'Main image is required';
//     return errors;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === 'catagory.id') {
//       setFormState((prev) => ({
//         ...prev,
//         catagory: { id: value },
//         product: { id: '' },
//         productItem: { id: '' },
//       }));
//       const filtered = products.filter((prod) => prod.catagory?.id === parseInt(value));
//       setFilteredProducts(filtered);
//       setProductItems([]);
//     } else if (name === 'product.id') {
//       setFormState((prev) => ({
//         ...prev,
//         product: { id: value },
//         productItem: { id: '' },
//       }));
//     } else if (name === 'brand.id') {
//       setFormState((prev) => ({
//         ...prev,
//         brand: { id: value },
//       }));
//     } else if (name === 'productItem.id') {
//       setFormState((prev) => ({
//         ...prev,
//         productItem: { id: value },
//       }));
//     } else {
//       setFormState((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }

//     setFormErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const handleImageChange = (e, index) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       setFormErrors((prev) => ({ ...prev, [`image${index}`]: 'Please upload an image file' }));
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       if (index === 0) {
//         setImageA(file);
//         setMainImagePreview(reader.result);
//         setFormErrors((prev) => ({ ...prev, imagea: '' }));
//       } else if (index === 1) {
//         setImageB(file);
//         setAdditionalImagesPreviews((prev) => {
//           const updated = [...prev];
//           updated[0] = reader.result;
//           return updated;
//         });
//       } else if (index === 2) {
//         setImageC(file);
//         setAdditionalImagesPreviews((prev) => {
//           const updated = [...prev];
//           updated[1] = reader.result;
//           return updated;
//         });
//       }
//     };

//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       alert('Please fill out all required fields correctly.');
//       return;
//     }

//     try {
//       const formDataObject = {
//         allLaptop: {
//           ...formState,
//           quantity: parseInt(formState.quantity),
//           regularprice: parseFloat(formState.regularprice),
//           specialprice: parseFloat(formState.specialprice),
//           warranty: parseInt(formState.warranty),
//           productItem: formState.productItem.id ? { id: parseInt(formState.productItem.id) } : null,
//           catagory: { id: parseInt(formState.catagory.id) },
//           product: formState.product.id ? { id: parseInt(formState.product.id) } : null,
//           brand: { id: parseInt(formState.brand.id) },
//         },
//         imagea,
//         imageb,
//         imagec,
//       };

//       await dispatch(addLaptop({ formDataObject, token })).unwrap();
//       alert('Laptop added successfully!');
//       setFormState({
//         productid: '',
//         name: '',
//         quantity: '',
//         regularprice: '',
//         specialprice: '',
//         generation: '',
//         processortype: '',
//         warranty: '',
//         displaysizerange: '',
//         ram: '',
//         graphicsmemory: '',
//         operatingsystem: '',
//         displayresolutionrange: '',
//         touchscreen: '',
//         maxramsupport: '',
//         graphicschipset: '',
//         lan: '',
//         fingerprintsensor: '',
//         weightrange: '',
//         color: '',
//         title: '',
//         details: '',
//         specification: '',
//         catagory: { id: '' },
//         product: { id: '' },
//         brand: { id: '' },
//         productItem: { id: '' },
//       });
//       setImageA(null);
//       setImageB(null);
//       setImageC(null);
//       setMainImagePreview(null);
//       setAdditionalImagesPreviews([null, null]);
//       setFormErrors({});
//       navigate('/admin/products/add-laptop');
//     } catch (err) {
//       console.error('Error adding laptop:', err);
//       alert(`Failed to add laptop: ${err.message || 'Unknown error'}`);
//     }
//   };

//   return (
//     <Box
//       component="form"
//       onSubmit={handleSubmit}
//       sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, mx: 'auto', p: 2 }}
//     >
//       <Typography variant="h5" fontWeight={600}>
//         Add Laptop
//       </Typography>

//       {formErrors.api && <Alert severity="error">{formErrors.api}</Alert>}
//       {error && <Alert severity="error">Error: {error}</Alert>}
//       {successMessage && <Alert severity="success">{successMessage}</Alert>}

//       <TextField
//         name="productid"
//         label="Product ID"
//         value={formState.productid}
//         onChange={handleChange}
//         required
//         error={!!formErrors.productid}
//         helperText={formErrors.productid}
//       />
//       <TextField
//         name="name"
//         label="Laptop Name"
//         value={formState.name}
//         onChange={handleChange}
//         required
//         error={!!formErrors.name}
//         helperText={formErrors.name}
//       />

//       <FormControl fullWidth required error={!!formErrors.catagory}>
//         <InputLabel>Category (Menu)</InputLabel>
//         <Select
//           name="catagory.id"
//           value={formState.catagory.id}
//           onChange={handleChange}
//           label="Category (Menu)"
//         >
//           <MenuItem value="">-- Select Category --</MenuItem>
//           {categories.map((cat) => (
//             <MenuItem key={cat.id} value={cat.id}>
//               {cat.name}
//             </MenuItem>
//           ))}
//         </Select>
//         {!!formErrors.catagory && <Typography color="error" variant="caption">{formErrors.catagory}</Typography>}
//       </FormControl>

//       <FormControl fullWidth>
//         <InputLabel>Product (Submenu)</InputLabel>
//         <Select
//           name="product.id"
//           value={formState.product.id}
//           onChange={handleChange}
//           label="Product (Submenu)"
//           disabled={filteredProducts.length === 0}
//         >
//           <MenuItem value="">
//             {filteredProducts.length === 0 ? '-- No Submenu Available --' : '-- Select Product (Submenu) --'}
//           </MenuItem>
//           {filteredProducts.map((prod) => (
//             <MenuItem key={prod.id} value={prod.id}>
//               {prod.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       <FormControl fullWidth>
//         <InputLabel>Product Item (Mega-menu)</InputLabel>
//         <Select
//           name="productItem.id"
//           value={formState.productItem?.id || ''}
//           onChange={handleChange}
//           label="Product Item (Mega-menu)"
//           disabled={!formState.product.id || productItems.length === 0}
//         >
//           <MenuItem value="">
//             {productItems.length === 0
//               ? '-- No Mega-menu Available --'
//               : '-- Select Product Item (Mega-menu) --'}
//           </MenuItem>
//           {productItems.map((item) => (
//             <MenuItem key={item.id} value={item.id}>
//               {item.productitemname || item.name}
//             </MenuItem>
//           ))}
//         </Select>
//         {!!formErrors.productItems && <Typography color="error" variant="caption">{formErrors.productItems}</Typography>}
//       </FormControl>

//       <FormControl fullWidth required error={!!formErrors.brand}>
//         <InputLabel>Brand</InputLabel>
//         <Select
//           name="brand.id"
//           value={formState.brand.id}
//           onChange={handleChange}
//           label="Brand"
//         >
//           <MenuItem value="">-- Select Brand --</MenuItem>
//           {brands.map((brand) => (
//             <MenuItem key={brand.id} value={brand.id}>
//               {brand.brandname}
//             </MenuItem>
//           ))}
//         </Select>
//         {!!formErrors.brand && <Typography color="error" variant="caption">{formErrors.brand}</Typography>}
//       </FormControl>

//       <TextField
//         name="quantity"
//         type="number"
//         label="Quantity"
//         value={formState.quantity}
//         onChange={handleChange}
//         required
//         error={!!formErrors.quantity}
//         helperText={formErrors.quantity}
//       />
//       <TextField
//         name="regularprice"
//         type="number"
//         label="Regular Price"
//         value={formState.regularprice}
//         onChange={handleChange}
//         required
//         error={!!formErrors.regularprice}
//         helperText={formErrors.regularprice}
//       />
//       <TextField
//         name="specialprice"
//         type="number"
//         label="Special Price"
//         value={formState.specialprice}
//         onChange={handleChange}
//         required
//         error={!!formErrors.specialprice}
//         helperText={formErrors.specialprice}
//       />

//       {[
//         { name: 'generation', label: 'Generation', options: dropdownOptions.generation },
//         { name: 'processortype', label: 'Processor Type', options: dropdownOptions.processortype },
//         { name: 'warranty', label: 'Warranty (Years)', options: dropdownOptions.warranty },
//         { name: 'displaysizerange', label: 'Display Size Range (Inch)', options: dropdownOptions.displaysizerange },
//         { name: 'ram', label: 'RAM', options: dropdownOptions.ram },
//         { name: 'graphicsmemory', label: 'Graphics Memory', options: dropdownOptions.graphicsmemory },
//         { name: 'operatingsystem', label: 'Operating System', options: dropdownOptions.operatingsystem },
//         { name: 'displayresolutionrange', label: 'Display Resolution', options: dropdownOptions.displayresolutionrange },
//         { name: 'touchscreen', label: 'Touchscreen', options: dropdownOptions.touchscreen },
//         { name: 'maxramsupport', label: 'Max RAM Support', options: dropdownOptions.maxramsupport },
//         { name: 'graphicschipset', label: 'Graphics Chipset', options: dropdownOptions.graphicschipset },
//         { name: 'lan', label: 'LAN', options: dropdownOptions.lan },
//         { name: 'fingerprintsensor', label: 'Fingerprint Sensor', options: dropdownOptions.fingerprintsensor },
//         { name: 'weightrange', label: 'Weight Range', options: dropdownOptions.weightrange },
//         { name: 'color', label: 'Color', options: dropdownOptions.color },
//       ].map((field) => (
//         <FormControl fullWidth required key={field.name} error={!!formErrors[field.name]}>
//           <InputLabel>{field.label}</InputLabel>
//           <Select
//             name={field.name}
//             value={formState[field.name]}
//             onChange={handleChange}
//             label={field.label}
//           >
//             <MenuItem value="">-- Select {field.label} --</MenuItem>
//             {field.options.map((option) => (
//               <MenuItem key={option} value={option}>
//                 {option}
//               </MenuItem>
//             ))}
//           </Select>
//           {!!formErrors[field.name] && <Typography color="error" variant="caption">{formErrors[field.name]}</Typography>}
//         </FormControl>
//       ))}

//       <TextField
//         name="details"
//         label="Details"
//         fullWidth
//         multiline
//         rows={4}
//         value={formState.details}
//         onChange={handleChange}
//         inputProps={{ maxLength: 5000 }}
//       />
//       <TextField
//         name="specification"
//         label="Specification"
//         fullWidth
//         multiline
//         rows={3}
//         value={formState.specification}
//         onChange={handleChange}
//         inputProps={{ maxLength: 5000 }}
//       />
//       <TextField
//         name="title"
//         label="Additional Information"
//         value={formState.title}
//         onChange={handleChange}
//         multiline
//         rows={4}
//         inputProps={{ maxLength: 5000 }}
//       />

//       <Box>
//         <Typography variant="subtitle1">Image A (Main)</Typography>
//         {mainImagePreview && (
//           <Avatar src={mainImagePreview} variant="rounded" sx={{ width: 80, height: 80, mb: 1 }} />
//         )}
//         <Button component="label" variant="outlined" color={formErrors.imagea ? 'error' : 'primary'}>
//           Upload Image A
//           <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, 0)} />
//         </Button>
//         {!!formErrors.imagea && <Typography color="error" variant="caption">{formErrors.imagea}</Typography>}
//       </Box>

//       {[1, 2].map((index) => (
//         <Box key={index}>
//           <Typography variant="subtitle1">Image {index} (Gallery)</Typography>
//           {additionalImagesPreviews[index - 1] && (
//             <Avatar
//               src={additionalImagesPreviews[index - 1]}
//               variant="rounded"
//               sx={{ width: 60, height: 60, mb: 1 }}
//             />
//           )}
//           <Button component="label" variant="outlined">
//             Upload Image {index}
//             <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, index)} />
//           </Button>
//         </Box>
//       ))}

//       <Button type="submit" variant="contained" color="primary" disabled={loading}>
//         {loading ? 'Uploading...' : 'Add Laptop'}
//       </Button>
//     </Box>
//   );
// };

// export default AddLaptop;

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
  FormControlLabel,
  Switch,
} from '@mui/material';
import { addLaptop } from '../../../../store/static/laptopSlice';
import { API_BASE_URL } from '../../../../store/api';
import { useNavigate } from 'react-router-dom';

const laptopSubMenuItems = [
  { name: "Acer", path: "/laptops/acer" },
  { name: "Dell", path: "/laptops/dell" },
  { name: "ASUS", path: "/laptops/asus" },
  { name: "HP", path: "/laptops/hp" },
  { name: "Lenovo", path: "/laptops/lenovo" },
  { name: "Toshiba", path: "/laptops/toshiba" },
  { name: "MSI", path: "/laptops/msi" },
  { name: "Apple", path: "/laptops/apple" },
  { name: "Infinix", path: "/laptops/infinix" },
  { name: "Microsoft", path: "/laptops/microsoft" },
  { name: "Gigabyte", path: "/laptops/gigabyte" },
  {
    name: "Accessories",
    path: "/laptops/accessories",
    items: [
      { name: "Bag", path: "/laptops/accessories/bag" },
      { name: "RAM", path: "/laptops/accessories/ram" },
      { name: "Mouse", path: "/laptops/accessories/mouse" },
      { name: "Keyboard", path: "/laptops/accessories/keyboard" },
      { name: "Cooling Pad", path: "/laptops/accessories/cooling-pad" },
      { name: "Charger", path: "/laptops/accessories/charger" },
    ],
  },
];

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
    title: '',
    details: '',
    specification: '',
    catagory: { name: 'Laptops' },
    product: { name: '' },
    productItem: { productitemname: '' },
    brand: { id: '' },
    isPublished: true,
  });

  const [imagea, setImageA] = useState(null);
  const [imageb, setImageB] = useState(null);
  const [imagec, setImageC] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState([null, null]);
  const [brands, setBrands] = useState([]);
  const [formErrors, setFormErrors] = useState({});

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
    generation: ['7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th'],
    warranty: ['1', '2', '3', '4'],
    displaysizerange: ['13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'],
    ram: ['4GB', '8GB', '16GB', '32GB', '64GB'],
    graphicsmemory: ['2GB', '4GB', '6GB', '8GB', '10GB', '12GB'],
    operatingsystem: ['Windows 7', 'Windows 9', 'Windows 10', 'Windows 11', 'Windows 12', 'macOS', 'Linux'],
    displayresolutionrange: ['1366x768', '1920x1080', '2560x1440', '3840x2160'],
    touchscreen: ['Yes', 'No'],
    maxramsupport: ['16GB', '32GB', '64GB', '128GB'],
    graphicschipset: ['Intel Iris Xe', 'NVIDIA GeForce GTX', 'NVIDIA GeForce RTX', 'AMD Radeon'],
    lan: ['Yes', 'No', 'Gigabit Ethernet'],
    fingerprintsensor: ['Yes', 'No'],
    weightrange: ['<1.5kg', '1.5-2kg', '>2kg'],
    color: ['Silver', 'Black', 'Space Grey', 'Gold', 'White'],
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/brands/get/all`);
        if (!response.ok) {
          throw new Error('Failed to fetch brands');
        }
        const brandsData = await response.json();
        setBrands(brandsData);
      } catch (err) {
        console.error('Failed to fetch brands:', err);
        setFormErrors((prev) => ({ ...prev, api: 'Failed to load brands' }));
      }
    };
    fetchBrands();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formState.productid) errors.productid = 'Product ID is required';
    if (!formState.name) errors.name = 'Laptop name is required';
    if (!formState.quantity || formState.quantity <= 0) errors.quantity = 'Valid quantity is required';
    if (!formState.regularprice || formState.regularprice <= 0) errors.regularprice = 'Valid regular price is required';
    if (!formState.specialprice || formState.specialprice < 0) errors.specialprice = 'Valid special price is required';
    if (!formState.generation) errors.generation = 'Generation is required';
    if (!formState.processortype) errors.processortype = 'Processor type is required';
    if (!formState.warranty) errors.warranty = 'Warranty is required';
    if (!formState.displaysizerange) errors.displaysizerange = 'Display size is required';
    if (!formState.ram) errors.ram = 'RAM is required';
    if (!formState.graphicsmemory) errors.graphicsmemory = 'Graphics memory is required';
    if (!formState.operatingsystem) errors.operatingsystem = 'Operating system is required';
    if (!formState.displayresolutionrange) errors.displayresolutionrange = 'Display resolution is required';
    if (!formState.touchscreen) errors.touchscreen = 'Touchscreen is required';
    if (!formState.maxramsupport) errors.maxramsupport = 'Max RAM support is required';
    if (!formState.graphicschipset) errors.graphicschipset = 'Graphics chipset is required';
    if (!formState.lan) errors.lan = 'LAN is required';
    if (!formState.fingerprintsensor) errors.fingerprintsensor = 'Fingerprint sensor is required';
    if (!formState.weightrange) errors.weightrange = 'Weight range is required';
    if (!formState.color) errors.color = 'Color is required';
    if (!formState.catagory.name) errors.catagory = 'Category is required';
    if (!formState.product.name) errors.product = 'Product (Submenu) is required';
    if (!formState.brand.id) errors.brand = 'Brand is required';
    if (!imagea) errors.imagea = 'Main image is required';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'product.name') {
      setFormState((prev) => ({
        ...prev,
        product: { name: value },
        productItem: { productitemname: '' },
      }));
    } else if (name === 'productItem.productitemname') {
      setFormState((prev) => ({
        ...prev,
        productItem: { productitemname: value },
      }));
    } else if (name === 'brand.id') {
      setFormState((prev) => ({
        ...prev,
        brand: { id: value },
      }));
    } else if (name === 'isPublished') {
      setFormState((prev) => ({
        ...prev,
        isPublished: value === 'true',
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
      alert('Please fill out all required fields correctly.');
      return;
    }

    try {
      const formDataObject = {
        allLaptop: {
          ...formState,
          quantity: parseInt(formState.quantity),
          regularprice: parseFloat(formState.regularprice),
          specialprice: parseFloat(formState.specialprice),
          warranty: parseInt(formState.warranty),
          productItem: formState.productItem.productitemname
            ? { productitemname: formState.productItem.productitemname }
            : null,
          catagory: { name: formState.catagory.name },
          product: formState.product.name ? { name: formState.product.name } : null,
          brand: { id: parseInt(formState.brand.id) },
          isPublished: formState.isPublished,
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
        title: '',
        details: '',
        specification: '',
        catagory: { name: 'Laptops' },
        product: { name: '' },
        productItem: { productitemname: '' },
        brand: { id: '' },
        isPublished: true,
      });
      setImageA(null);
      setImageB(null);
      setImageC(null);
      setMainImagePreview(null);
      setAdditionalImagesPreviews([null, null]);
      setFormErrors({});
      navigate('/admin/products/add-laptop');
    } catch (err) {
      console.error('Error adding laptop:', err);
      alert(`Failed to add laptop: ${err.message || 'Unknown error'}`);
    }
  };

  const accessoryItems = laptopSubMenuItems.find((item) => item.name === 'Accessories')?.items || [];

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, mx: 'auto', p: 2 }}
    >
      <Typography variant="h5" fontWeight={600}>
        Add Laptop
      </Typography>

      {formErrors.api && <Alert severity="error">{formErrors.api}</Alert>}
      {error && <Alert severity="error">Error: {error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <TextField
        name="productid"
        label="Product ID"
        value={formState.productid}
        onChange={handleChange}
        required
        error={!!formErrors.productid}
        helperText={formErrors.productid}
      />
      <TextField
        name="name"
        label="Laptop Name"
        value={formState.name}
        onChange={handleChange}
        required
        error={!!formErrors.name}
        helperText={formErrors.name}
      />

      <FormControl fullWidth required error={!!formErrors.catagory}>
        <InputLabel>Category (Menu)</InputLabel>
        <Select
          name="catagory.name"
          value={formState.catagory.name}
          onChange={handleChange}
          label="Category (Menu)"
          disabled
        >
          <MenuItem value="Laptops">Laptops</MenuItem>
        </Select>
        {!!formErrors.catagory && <Typography color="error" variant="caption">{formErrors.catagory}</Typography>}
      </FormControl>

      <FormControl fullWidth required error={!!formErrors.product}>
        <InputLabel>Product (Submenu)</InputLabel>
        <Select
          name="product.name"
          value={formState.product.name}
          onChange={handleChange}
          label="Product (Submenu)"
        >
          <MenuItem value="">-- Select Product (Submenu) --</MenuItem>
          {laptopSubMenuItems.map((item) => (
            <MenuItem key={item.name} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        {!!formErrors.product && <Typography color="error" variant="caption">{formErrors.product}</Typography>}
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Product Item (Mega-menu)</InputLabel>
        <Select
          name="productItem.productitemname"
          value={formState.productItem.productitemname}
          onChange={handleChange}
          label="Product Item (Mega-menu)"
          disabled={formState.product.name !== 'Accessories' || accessoryItems.length === 0}
        >
          <MenuItem value="">
            {accessoryItems.length === 0 || formState.product.name !== 'Accessories'
              ? '-- No Mega-menu Available --'
              : '-- Select Product Item (Mega-menu) --'}
          </MenuItem>
          {accessoryItems.map((item) => (
            <MenuItem key={item.name} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required error={!!formErrors.brand}>
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

      <FormControlLabel
        control={
          <Switch
            name="isPublished"
            checked={formState.isPublished}
            onChange={(e) => handleChange({ target: { name: 'isPublished', value: String(e.target.checked) } })}
            color="primary"
          />
        }
        label={formState.isPublished ? 'Published' : 'Unpublished'}
      />

      <TextField
        name="quantity"
        type="number"
        label="Quantity"
        value={formState.quantity}
        onChange={handleChange}
        required
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
        error={!!formErrors.specialprice}
        helperText={formErrors.specialprice}
      />

      {[
        { name: 'generation', label: 'Generation', options: dropdownOptions.generation },
        { name: 'processortype', label: 'Processor Type', options: dropdownOptions.processortype },
        { name: 'warranty', label: 'Warranty (Years)', options: dropdownOptions.warranty },
        { name: 'displaysizerange', label: 'Display Size Range (Inch)', options: dropdownOptions.displaysizerange },
        { name: 'ram', label: 'RAM', options: dropdownOptions.ram },
        { name: 'graphicsmemory', label: 'Graphics Memory', options: dropdownOptions.graphicsmemory },
        { name: 'operatingsystem', label: 'Operating System', options: dropdownOptions.operatingsystem },
        { name: 'displayresolutionrange', label: 'Display Resolution', options: dropdownOptions.displayresolutionrange },
        { name: 'touchscreen', label: 'Touchscreen', options: dropdownOptions.touchscreen },
        { name: 'maxramsupport', label: 'Max RAM Support', options: dropdownOptions.maxramsupport },
        { name: 'graphicschipset', label: 'Graphics Chipset', options: dropdownOptions.graphicschipset },
        { name: 'lan', label: 'LAN', options: dropdownOptions.lan },
        { name: 'fingerprintsensor', label: 'Fingerprint Sensor', options: dropdownOptions.fingerprintsensor },
        { name: 'weightrange', label: 'Weight Range', options: dropdownOptions.weightrange },
        { name: 'color', label: 'Color', options: dropdownOptions.color },
      ].map((field) => (
        <FormControl fullWidth required key={field.name} error={!!formErrors[field.name]}>
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
        label="Details"
        fullWidth
        multiline
        rows={4}
        value={formState.details}
        onChange={handleChange}
        inputProps={{ maxLength: 5000 }}
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
      />
      <TextField
        name="title"
        label="Additional Information"
        value={formState.title}
        onChange={handleChange}
        multiline
        rows={4}
        inputProps={{ maxLength: 5000 }}
      />

      <Box>
        <Typography variant="subtitle1">Image A (Main)</Typography>
        {mainImagePreview && (
          <Avatar src={mainImagePreview} variant="rounded" sx={{ width: 80, height: 80, mb: 1 }} />
        )}
        <Button component="label" variant="outlined" color={formErrors.imagea ? 'error' : 'primary'}>
          Upload Image A
          <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, 0)} />
        </Button>
        {!!formErrors.imagea && <Typography color="error" variant="caption">{formErrors.imagea}</Typography>}
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
            <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, index)} />
          </Button>
        </Box>
      ))}

      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? 'Uploading...' : 'Add Laptop'}
      </Button>
    </Box>
  );
};

export default AddLaptop;