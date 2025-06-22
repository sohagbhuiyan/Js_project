// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "../../../../store/productSlice";
// import { fetchFilteredProducts, setFilters, resetFilters } from "../../../../store/filterSlice";
// import CollectionCard from "./CollectionCard";
// import { useSearchParams } from "react-router-dom";
// import {
//   Box,
//   TextField,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Button,
//   IconButton,
//   Drawer,
//   Typography,
//   Paper,
// } from "@mui/material";
// import { FaFilter } from "react-icons/fa";
// import { API_BASE_URL } from "../../../../store/api";

// const Collections = ({ isHomePage = false, sx }) => {
//   const [searchParams] = useSearchParams();
//   const categoryParam = searchParams.get("category") || "";
//   const productParam = searchParams.get("product") || "";
//   const itemParam = searchParams.get("item") || "";
//   const brandnameParam = searchParams.get("brandname") || "";
//   const searchParam = searchParams.get("search") || "";
//   const [searchQuery, setSearchQuery] = useState(searchParam);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   const dispatch = useDispatch();
//   const { products, loading: productsLoading, error: productsError } = useSelector(
//     (state) => state.products
//   );
//   const { filteredProducts, filters, loading: filterLoading, error: filterError } = useSelector(
//     (state) => state.filter
//   );

//   const [brands, setBrands] = useState([]);
//   const [productItems, setProductItems] = useState([]);
//   const [productData, setProductData] = useState([]);

//   // Determine if filter should be shown
//   const showFilter = !isHomePage && (categoryParam || productParam || itemParam || brandnameParam);

//   // Fetch products and filter options
//   useEffect(() => {
//     dispatch(fetchProducts());
//     const fetchFilterOptions = async () => {
//       try {
//         const [brandsRes, itemsRes, productRes] = await Promise.all([
//           fetch(`${API_BASE_URL}/api/brands/get/all`),
//           fetch(`${API_BASE_URL}/api/product/items/get`),
//           fetch(`${API_BASE_URL}/api/Product/getall`),
//         ]);

//         const brandsData = await brandsRes.json();
//         const itemsData = await itemsRes.json();
//         const productData = await productRes.json();

//         setBrands(brandsData);
//         setProductItems(itemsData);
//         setProductData(productData);
//       } catch (err) {
//         console.error("Failed to fetch filter options:", err);
//       }
//     };
//     fetchFilterOptions();
//   }, [dispatch]);

//   // Sync searchQuery with searchParam
//   useEffect(() => {
//     setSearchQuery(searchParam);
//   }, [searchParam]);

//   // Handle filter changes
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     dispatch(setFilters({ [name]: value }));
//   };

//   // Apply filters
//   const handleApplyFilters = () => {
//     if (filters.regularPrice && filters.regularPrice < 0) {
//       alert("Price cannot be negative.");
//       return;
//     }
//     dispatch(fetchFilteredProducts(filters));
//     setIsFilterOpen(false);
//   };

//   // Reset filters
//   const handleResetFilters = () => {
//     dispatch(resetFilters());
//     setIsFilterOpen(false);
//   };

//   // Filter products based on URL params or search (when no API filters are applied)
//   const urlFilteredProducts = products.filter((product) => {
//     if (itemParam) {
//       return product.productItem?.productitemname?.toLowerCase() === itemParam.toLowerCase();
//     }
//     if (productParam) {
//       return (
//         product.product?.name?.toLowerCase() === productParam.toLowerCase() ||
//         product.name?.toLowerCase() === productParam.toLowerCase()
//       );
//     }
//     if (categoryParam) {
//       return product.catagory?.name?.toLowerCase() === categoryParam.toLowerCase();
//     }
//     if (brandnameParam) {
//       return product.brand?.brandname?.toLowerCase() === brandnameParam.toLowerCase();
//     }
//     if (searchQuery) {
//       return (
//         product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product.catagory?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product.productItem?.productitemname?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     return true;
//   });

//   // Use filteredProducts if filters are applied; otherwise, use urlFilteredProducts
//   const displayProducts = filteredProducts.length > 0 ? filteredProducts : urlFilteredProducts;

//   return (
//     <Box
//       sx={{
//         py: 5,
//         px: { xs: 1, md: 2 },
//         bgcolor: "#ffffff",
//         borderRadius: 2,
//         boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//         ...sx,
//       }}
//     >
//       <Box sx={{ display: "flex-1", gap: 1 }}>
//         {/* Mobile Filter Button */}
//         {showFilter && (
//           <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
//             <IconButton
//               onClick={() => setIsFilterOpen(true)}
//               aria-label="Open filters"
//               sx={{
//                 bgcolor: "#1976d2",
//                 color: "#fff",
//                 "&:hover": { bgcolor: "#1565c0" },
//               }}
//             >
//               <FaFilter />
//             </IconButton>
//           </Box>
//         )}

//         {/* Filter Sidebar (Desktop) / Drawer (Mobile) */}
//         {showFilter && (
//           <>
//             <Drawer
//               anchor="left"
//               open={isFilterOpen}
//               onClose={() => setIsFilterOpen(false)}
//               sx={{ display: { xs: "block", md: "none" } }}
//             >
//               <Box sx={{ width: 160, p: 1, bgcolor: "#f5f5f5" }}>
//                 <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#333" }}>
//                   Filter
//                 </Typography>
//                 <FilterForm
//                   filters={filters}
//                   handleChange={handleFilterChange}
//                   handleApplyFilters={handleApplyFilters}
//                   handleResetFilters={handleResetFilters}
//                   brands={brands}
//                   productItems={productItems}
//                   productData={productData}
//                 />
//               </Box>
//             </Drawer>

//             <Paper
//               sx={{
//                 width: 200,
//                 flexShrink: 0,
//                 display: { xs: "none", md: "block" },
//                 p: 2,
//                 bgcolor: "#f5f5f5",
//                 borderRadius: 2,
//                 boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//               }}
//             >
//               <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#333" }}>
//                 Filter Products
//               </Typography>
//               <FilterForm
//                 filters={filters}
//                 handleChange={handleFilterChange}
//                 handleApplyFilters={handleApplyFilters}
//                 handleResetFilters={handleResetFilters}
//                 brands={brands}
//                 productItems={productItems}
//                 productData={productData}
//               />
//             </Paper>
//           </>
//         )}

//         {/* Products Section */}
//         <Box sx={{ flexGrow: 1 }}>
//           {filterLoading || productsLoading ? (
//             <Box sx={{ textAlign: "center", py: 10 }}>
//               <Typography variant="body1" color="textSecondary">
//                 Loading...
//               </Typography>
//             </Box>
//           ) : filterError || productsError ? (
//             <Box sx={{ textAlign: "center", py: 6, color: "error.main" }}>
//               <Typography variant="body1">Error: {filterError || productsError}</Typography>
//             </Box>
//           ) : (
//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: {
//                   xs: "repeat(2, 1fr)",
//                   sm: "repeat(2, 1fr)",
//                   md: "repeat(4, 1fr)",
//                   lg: "repeat(5, 1fr)",
//                 },
//                 gap: { xs: 2, sm: 3, md: 4, lg: 4 },
//                 mb: 4,
//               }}
//             >
//               {displayProducts.length > 0 ? (
//                 displayProducts.map((product) => (
//                   <CollectionCard
//                     key={product.id}
//                     id={product.id}
//                     imagea={product.imagea}
//                     category={product.catagory?.name || "Uncategorized"}
//                     product={product.product?.name}
//                     name={product.name}
//                     regularprice={product.regularprice}
//                     specialprice={product.specialprice}
//                     brandname={product.brand?.brandname}
//                     title={product.title}
//                     details={product.details}
//                     specification={product.specification}
//                     productitemname={product.productItem?.productitemname}
//                   />
//                 ))
//               ) : (
//                 <Typography
//                   sx={{ textAlign: "center", color: "text.secondary", gridColumn: "1 / -1", py: 6 }}
//                 >
//                   No products found
//                 </Typography>
//               )}
//             </Box>
//           )}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// // FilterForm Component
// const FilterForm = ({ filters, handleChange, handleApplyFilters, handleResetFilters, brands, productItems, productData }) => (
//   <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxWidth: 200 }}>
//     <FormControl fullWidth size="small">
//       <InputLabel sx={{ fontSize: "0.875rem" }}>Brand</InputLabel>
//       <Select
//         name="brandname"
//         value={filters.brandname || ""}
//         onChange={handleChange}
//         label="Brand"
//         sx={{
//           fontSize: "0.875rem",
//           height: 36,
//           bgcolor: "#fff",
//           "&:hover": { bgcolor: "#e3f2fd" },
//         }}
//       >
//         <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
//           All Brands
//         </MenuItem>
//         {brands.map((brand) => (
//           <MenuItem key={brand.id} value={brand.brandname} sx={{ fontSize: "0.875rem" }}>
//             {brand.brandname}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>

//     <FormControl fullWidth size="small">
//       <InputLabel sx={{ fontSize: "0.875rem" }}>Product Name</InputLabel>
//       <Select
//         name="productName"
//         value={filters.productName || ""}
//         onChange={handleChange}
//         label="Product Name"
//         sx={{
//           fontSize: "0.875rem",
//           height: 36,
//           bgcolor: "#fff",
//           "&:hover": { bgcolor: "#e3f2fd" },
//         }}
//       >
//         <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
//           All Products
//         </MenuItem>
//         {productData.map((item) => (
//           <MenuItem key={item.id} value={item.name} sx={{ fontSize: "0.875rem" }}>
//             {item.name}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>

//     <TextField
//       name="regularPrice"
//       label="Price"
//       type="number"
//       value={filters.regularPrice || ""}
//       onChange={handleChange}
//       fullWidth
//       size="small"
//       sx={{
//         fontSize: "0.875rem",
//         bgcolor: "#fff",
//         "& .MuiInputBase-root": { height: 36 },
//         "&:hover": { bgcolor: "#e3f2fd" },
//       }}
//       placeholder="e.g., 500"
//     />

//     <FormControl fullWidth size="small">
//       <InputLabel sx={{ fontSize: "0.875rem" }}>Product Item</InputLabel>
//       <Select
//         name="productItemId"
//         value={filters.productItemId || ""}
//         onChange={handleChange}
//         label="Product Item"
//         sx={{
//           fontSize: "0.875rem",
//           height: 36,
//           bgcolor: "#fff",
//           "&:hover": { bgcolor: "#e3f2fd" },
//         }}
//       >
//         <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
//           All Items
//         </MenuItem>
//         {productItems.map((item) => (
//           <MenuItem key={item.id} value={item.id} sx={{ fontSize: "0.875rem" }}>
//             {item.productitemname || item.name}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>

//     <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleApplyFilters}
//         fullWidth
//         disabled={!Object.values(filters).some((v) => v)}
//         sx={{
//           fontSize: "0.875rem",
//           py: 0.5,
//           bgcolor: "#1976d2",
//           "&:hover": { bgcolor: "#1565c0" },
//           "&:disabled": { bgcolor: "#b0bec5" },
//         }}
//       >
//         Apply
//       </Button>
//       <Button
//         variant="outlined"
//         color="secondary"
//         onClick={handleResetFilters}
//         fullWidth
//         sx={{
//           fontSize: "0.875rem",
//           py: 0.5,
//           borderColor: "#f50057",
//           color: "#f50057",
//           "&:hover": { bgcolor: "#fce4ec" },
//         }}
//       >
//         Reset
//       </Button>
//     </Box>
//   </Box>
// );

// export default Collections;
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../../store/productSlice";
import { fetchFilteredProducts, setFilters, resetFilters } from "../../../../store/filterSlice";
import CollectionCard from "./CollectionCard";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  IconButton,
  Drawer,
  Typography,
  Paper,
  Fade,
} from "@mui/material";
import { FaFilter, FaTimes } from "react-icons/fa";
import { API_BASE_URL } from "../../../../store/api";
import AllProductsPage from "./AllProductsPage";

const Collections = ({ isHomePage = false, sx }) => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const productParam = searchParams.get("product") || "";
  const itemParam = searchParams.get("item") || "";
  const brandnameParam = searchParams.get("brandname") || "";
  const searchParam = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("customized");
  const [viewType, setViewType] = useState("grid");

  const dispatch = useDispatch();
  const { products, loading: productsLoading, error: productsError } = useSelector(
    (state) => state.products
  );
  const { filteredProducts, filters, loading: filterLoading, error: filterError } = useSelector(
    (state) => state.filter
  );

  const [brands, setBrands] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [productData, setProductData] = useState([]);

  const showFilter = !isHomePage && (categoryParam || productParam || itemParam || brandnameParam);

  useEffect(() => {
    dispatch(fetchProducts());
    const fetchFilterOptions = async () => {
      try {
        const [brandsRes, itemsRes, productRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/brands/get/all`),
          fetch(`${API_BASE_URL}/api/product/items/get`),
          fetch(`${API_BASE_URL}/api/Product/getall`),
        ]);

        const brandsData = await brandsRes.json();
        const itemsData = await itemsRes.json();
        const productData = await productRes.json();

        setBrands(brandsData);
        setProductItems(itemsData);
        setProductData(productData);
      } catch (err) {
        console.error("Failed to fetch filter options:", err);
      }
    };
    fetchFilterOptions();
  }, [dispatch]);

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
  };

  const handleApplyFilters = () => {
    if (filters.regularPrice && filters.regularPrice < 0) {
      alert("Price cannot be negative.");
      return;
    }
    dispatch(fetchFilteredProducts(filters));
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setIsFilterOpen(false);
  };

  const urlFilteredProducts = products.filter((product) => {
    if (itemParam) {
      return product.productItem?.productitemname?.toLowerCase() === itemParam.toLowerCase();
    }
    if (productParam) {
      return (
        product.product?.name?.toLowerCase() === productParam.toLowerCase() ||
        product.name?.toLowerCase() === productParam.toLowerCase()
      );
    }
    if (categoryParam) {
      return product.catagory?.name?.toLowerCase() === categoryParam.toLowerCase();
    }
    if (brandnameParam) {
      return product.brand?.brandname?.toLowerCase() === brandnameParam.toLowerCase();
    }
    if (searchQuery) {
      return (
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.catagory?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.productItem?.productitemname?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : urlFilteredProducts;

  // Sort products based on sortOption
  const sortedProducts = [...displayProducts].sort((a, b) => {
    if (sortOption === "priceLowToHigh") {
      return (a.specialprice || a.regularprice) - (b.specialprice || b.regularprice);
    } else if (sortOption === "priceHighToLow") {
      return (b.specialprice || b.regularprice) - (a.specialprice || a.regularprice);
    } else if (sortOption === "newest") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); // Fallback to 0 if createdAt is missing
    }
    return 0; // "customized" - no sorting
  });

  // Dynamic title based on filter parameters
  const getDynamicTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (itemParam) return `${itemParam} Products`;
    if (productParam) return `${productParam} Collection`;
    if (categoryParam) return `${categoryParam} Category`;
    if (brandnameParam) return `${brandnameParam} Brand`;
    return "All Products";
  };

  return (
    <>
      <h2 className="bg-gray-300 text-gray-900 text-lg py-1 px-4">Collections</h2>
      <Box
        sx={{
          py: { xs: 1, md: 1 },
          px: { xs: 1, md: 1 },
          bgcolor: "#ffffff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          ...sx,
        }}
      >
        <AllProductsPage
          title={getDynamicTitle()}
          productCount={sortedProducts.length}
          sortOption={sortOption}
          onSortChange={setSortOption}
          viewType={viewType}
          onViewChange={setViewType}
        />
        <Box sx={{ display: "flex", gap: { xs: 1, md: 2 }, flexDirection: { xs: "column", md: "row" } }}>
          {/* Mobile Filter Button */}
          {showFilter && (
            <Fade in={showFilter}>
              <Box
                onClick={() => setIsFilterOpen(true)}
                sx={{
                  display: { xs: "flex", md: "none" },
                  alignItems: "center",
                  gap: 0.5,
                  position: "fixed",
                  top: { xs: 63, sm: 130 },
                  right: { xs: 2, sm: 4 },
                  cursor: "pointer",
                  bgcolor: "#07a966",
                  color: "#ffffff",
                  borderRadius: "8px",
                  padding: "2px 4px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    bgcolor: "#07a966",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
                  },
                  zIndex: 99,
                }}
              >
                <FaFilter size={8} />
                <Typography variant="caption" sx={{ fontWeight: "medium", fontSize: "0.75rem" }}>
                  Filter
                </Typography>
              </Box>
            </Fade>
          )}

          {/* Filter Sidebar (Desktop) / Drawer (Mobile) */}
          {showFilter && (
            <>
              <Drawer
                anchor="left"
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                sx={{
                  "& .MuiDrawer-paper": {
                    width: { xs: "80vw", sm: "20vw", md: "40vw" },
                    maxWidth: "200px",
                    bgcolor: "#fafafa",
                    p: 2,
                    transition: "transform 0.3s ease-in-out",
                  },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                    Filters
                  </Typography>
                  <IconButton onClick={() => setIsFilterOpen(false)} aria-label="Close filters">
                    <FaTimes size={10} color="#333" />
                  </IconButton>
                </Box>
                <FilterForm
                  filters={filters}
                  handleChange={handleFilterChange}
                  handleApplyFilters={handleApplyFilters}
                  handleResetFilters={handleResetFilters}
                  brands={brands}
                  productItems={productItems}
                  productData={productData}
                />
              </Drawer>

              <Paper
                sx={{
                  width: { md: 200 },
                  flexShrink: 0,
                  display: { xs: "none", md: "block" },
                  p: 3,
                  bgcolor: "#fafafa",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#333" }}>
                  Filter Products
                </Typography>
                <FilterForm
                  filters={filters}
                  handleChange={handleFilterChange}
                  handleApplyFilters={handleApplyFilters}
                  handleResetFilters={handleResetFilters}
                  brands={brands}
                  productItems={productItems}
                  productData={productData}
                />
              </Paper>
            </>
          )}

          {/* Products Section */}
          <Box sx={{ flexGrow: 1 }}>
            {filterLoading || productsLoading ? (
              <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="body1" color="textSecondary">
                  Loading...
                </Typography>
              </Box>
            ) : filterError || productsError ? (
              <Box sx={{ textAlign: "center", py: 6, color: "error.main" }}>
                <Typography variant="body1">Error: {filterError || productsError}</Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: viewType === "grid" ? "grid" : "flex",
                  flexDirection: viewType === "list" ? "column" : "unset",
                  gridTemplateColumns: viewType === "grid" && {
                    xs: "repeat(auto-fill, minmax(150px, 1fr))",
                    sm: "repeat(auto-fill, minmax(180px, 1fr))",
                    md: "repeat(auto-fill, minmax(200px, 1fr))",
                    lg: "repeat(auto-fill, minmax(220px, 1fr))",
                  },
                  gap: { xs: 1.5, sm: 2, md: 3, lg: 4 },
                  mb: 4,
                  p: 4,
                }}
              >
                {sortedProducts.length > 0 ? (
                  sortedProducts.map((product) => (
                    <Box
                      key={product.id}
                      sx={{
                        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                        },
                        width: viewType === "list" ? "100%" : "unset",
                      }}
                    >
                      <CollectionCard
                        id={product.id}
                        imagea={product.imagea}
                        category={product.catagory?.name || "Uncategorized"}
                        product={product.product?.name}
                        name={product.name}
                        regularprice={product.regularprice}
                        specialprice={product.specialprice}
                        brandname={product.brand?.brandname}
                        title={product.title}
                        details={product.details}
                        specification={product.specification}
                        productitemname={product.productItem?.productitemname}
                        viewType={viewType}
                      />
                    </Box>
                  ))
                ) : (
                  <Typography
                    sx={{ textAlign: "center", color: "text.secondary", gridColumn: "1 / -1", py: 6 }}
                  >
                    No products found
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

// FilterForm Component (Unchanged)
const FilterForm = ({ filters, handleChange, handleApplyFilters, handleResetFilters, brands, productItems, productData }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 220 }}>
    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>Brand</InputLabel>
      <Select
        name="brandname"
        value={filters.brandname || ""}
        onChange={handleChange}
        label="Brand"
        sx={{
          fontSize: "0.9rem",
          height: 40,
          bgcolor: "#fff",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#f1f5f9" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.9rem" }}>
          All Brands
        </MenuItem>
        {brands.map((brand) => (
          <MenuItem key={brand.id} value={brand.brandname} sx={{ fontSize: "0.9rem" }}>
            {brand.brandname}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>Product Name</InputLabel>
      <Select
        name="productName"
        value={filters.productName || ""}
        onChange={handleChange}
        label="Product Name"
        sx={{
          fontSize: "0.9rem",
          height: 40,
          bgcolor: "#fff",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#f1f5f9" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.9rem" }}>
          All Products
        </MenuItem>
        {productData.map((item) => (
          <MenuItem key={item.id} value={item.name} sx={{ fontSize: "0.9rem" }}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <TextField
      name="regularPrice"
      label="Price"
      type="number"
      value={filters.regularPrice || ""}
      onChange={handleChange}
      fullWidth
      size="small"
      sx={{
        fontSize: "0.9rem",
        bgcolor: "#fff",
        borderRadius: "8px",
        "& .MuiInputBase-root": { height: 40 },
        "&:hover": { bgcolor: "#f1f5f9" },
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
      }}
      placeholder="e.g., 500"
    />

    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>Product Item</InputLabel>
      <Select
        name="productItemId"
        value={filters.productItemId || ""}
        onChange={handleChange}
        label="Product Item"
        sx={{
          fontSize: "0.9rem",
          height: 40,
          bgcolor: "#fff",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#f1f5f9" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.9rem" }}>
          All Items
        </MenuItem>
        {productItems.map((item) => (
          <MenuItem key={item.id} value={item.id} sx={{ fontSize: "0.9rem" }}>
            {item.productitemname || item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleApplyFilters}
        fullWidth
        disabled={!Object.values(filters).some((v) => v)}
        sx={{
          fontSize: "0.5rem",
          py: 1,
          bgcolor: "#1976d2",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#1565c0", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" },
          "&:disabled": { bgcolor: "#b0bec5" },
          transition: "all 0.2s ease-in-out",
        }}
      >
        Filters
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleResetFilters}
        fullWidth
        sx={{
          fontSize: "0.5rem",
          py: 1,
          borderColor: "#f50057",
          color: "#f50057",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#fce4ec", borderColor: "#d81b60" },
          transition: "all 0.2s ease-in-out",
        }}
      >
        Reset
      </Button>
    </Box>
  </Box>
);

export default Collections;
