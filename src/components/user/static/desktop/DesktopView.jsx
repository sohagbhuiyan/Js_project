// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchDesktops } from "../../../../store/static/desktopSlice";
// import { fetchFilteredProducts, setFilters, resetFilters } from "../../../../store/filterSlice";
// import DesktopViewCard from "./DesktopViewCard";
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
//   Fade,
// } from "@mui/material";
// import { FaFilter, FaTimes } from "react-icons/fa";
// import { API_BASE_URL } from "../../../../store/api";

// const FilterForm = ({ filters, handleChange, handleApplyFilters, handleResetFilters, brands, productItems, productData }) => (
//   <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 220 }}>
//     <FormControl fullWidth size="small">
//       <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>Brand</InputLabel>
//       <Select
//         name="brandname"
//         value={filters.brandname || ""}
//         onChange={handleChange}
//         label="Brand"
//         sx={{
//           fontSize: "0.9rem",
//           height: 40,
//           bgcolor: "#fff",
//           borderRadius: "8px",
//           "&:hover": { bgcolor: "#f1f5f9" },
//           "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
//         }}
//       >
//         <MenuItem value="" sx={{ fontSize: "0.9rem" }}>
//           All Brands
//         </MenuItem>
//         {brands.map((brand) => (
//           <MenuItem key={brand.id} value={brand.brandname} sx={{ fontSize: "0.9rem" }}>
//             {brand.brandname}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>

//     <FormControl fullWidth size="small">
//       <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>Product Name</InputLabel>
//       <Select
//         name="productName"
//         value={filters.productName || ""}
//         onChange={handleChange}
//         label="Product Name"
//         sx={{
//           fontSize: "0.9rem",
//           height: 40,
//           bgcolor: "#fff",
//           borderRadius: "8px",
//           "&:hover": { bgcolor: "#f1f5f9" },
//           "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
//         }}
//       >
//         <MenuItem value="" sx={{ fontSize: "0.9rem" }}>
//           All Products
//         </MenuItem>
//         {productData.map((item) => (
//           <MenuItem key={item.id} value={item.name} sx={{ fontSize: "0.9rem" }}>
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
//         fontSize: "0.9rem",
//         bgcolor: "#fff",
//         borderRadius: "8px",
//         "& .MuiInputBase-root": { height: 40 },
//         "&:hover": { bgcolor: "#f1f5f9" },
//         "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
//       }}
//       placeholder="e.g., 500"
//     />

//     <FormControl fullWidth size="small">
//       <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>Product Item</InputLabel>
//       <Select
//         name="productItemId"
//         value={filters.productItemId || ""}
//         onChange={handleChange}
//         label="Product Item"
//         sx={{
//           fontSize: "0.9rem",
//           height: 40,
//           bgcolor: "#fff",
//           borderRadius: "8px",
//           "&:hover": { bgcolor: "#f1f5f9" },
//           "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
//         }}
//       >
//         <MenuItem value="" sx={{ fontSize: "0.9rem" }}>
//           All Items
//         </MenuItem>
//         {productItems.map((item) => (
//           <MenuItem key={item.id} value={item.id} sx={{ fontSize: "0.9rem" }}>
//             {item.productitemname || item.name}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>

//     <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleApplyFilters}
//         fullWidth
//         disabled={!Object.values(filters).some((v) => v)}
//         sx={{
//           fontSize: "0.5rem",
//           py: 1,
//           bgcolor: "#1976d2",
//           borderRadius: "8px",
//           "&:hover": { bgcolor: "#1565c0", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" },
//           "&:disabled": { bgcolor: "#b0bec5" },
//           transition: "all 0.2s ease-in-out",
//         }}
//       >
//         Filters
//       </Button>
//       <Button
//         variant="outlined"
//         color="secondary"
//         onClick={handleResetFilters}
//         fullWidth
//         sx={{
//           fontSize: "0.5rem",
//           py: 1,
//           borderColor: "#f50057",
//           color: "#f50057",
//           borderRadius: "8px",
//           "&:hover": { bgcolor: "#fce4ec", borderColor: "#d81b60" },
//           transition: "all 0.2s ease-in-out",
//         }}
//       >
//         Reset
//       </Button>
//     </Box>
//   </Box>
// );

// const DesktopView = ({ isHomePage = false, sx }) => {  b  
//   const [searchParams] = useSearchParams();
//   const categoryParam = searchParams.get("category") || "";
//   const productParam = searchParams.get("product") || "";
//   const itemParam = searchParams.get("item") || "";
//   const brandnameParam = searchParams.get("brandname") || "";
//   const searchParam = searchParams.get("search") || "";
//   const [searchQuery, setSearchQuery] = useState(searchParam);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   const dispatch = useDispatch();
//   const { desktops, loading: desktopsLoading, error: desktopsError } = useSelector(
//     (state) => state.desktops
//   );
//   const { filteredProducts, filters, loading: filterLoading, error: filterError } = useSelector(
//     (state) => state.filter
//   );

//   const [brands, setBrands] = useState([]);
//   const [productItems, setProductItems] = useState([]);
//   const [productData, setProductData] = useState([]);

//   const showFilter = !isHomePage && (categoryParam || productParam || itemParam || brandnameParam);

//   useEffect(() => {
//     dispatch(fetchDesktops());
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

//   useEffect(() => {
//     setSearchQuery(searchParam);
//   }, [searchParam]);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     dispatch(setFilters({ [name]: value }));
//   };

//   const handleApplyFilters = () => {
//     if (filters.regularPrice && filters.regularPrice < 0) {
//       alert("Price cannot be negative.");
//       return;
//     }
//     dispatch(fetchFilteredProducts(filters));
//     setIsFilterOpen(false);
//   };

//   const handleResetFilters = () => {
//     dispatch(resetFilters());
//     setIsFilterOpen(false);
//   };

//   const urlFilteredDesktops = desktops.filter((desktop) => {
//     if (itemParam) {
//       return desktop.productItem?.productitemname?.toLowerCase() === itemParam.toLowerCase();
//     }
//     if (productParam) {
//       return (
//         desktop.product?.name?.toLowerCase() === productParam.toLowerCase() ||
//         desktop.name?.toLowerCase() === productParam.toLowerCase()
//       );
//     }
//     if (categoryParam) {
//       return desktop.catagory?.name?.toLowerCase() === categoryParam.toLowerCase();
//     }
//     if (brandnameParam) {
//       return desktop.brand?.brandname?.toLowerCase() === brandnameParam.toLowerCase();
//     }
//     if (searchQuery) {
//       return (
//         desktop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         desktop.catagory?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         desktop.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         desktop.ram?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         desktop.productItem?.productitemname?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     return true;
//   });

//   const displayDesktops = filteredProducts.length > 0 ? filteredProducts : urlFilteredDesktops;

//   return (
//     <Box
//       sx={{
//         py: { xs: 1, md: 1 },
//         px: { xs: 1, md: 1 },
//         bgcolor: "#ffffff",
//         borderRadius: "12px",
//         boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
//         ...sx,
//       }}
//     >
//       <Box sx={{ display: "flex", gap: { xs: 1, md: 2 }, flexDirection: { xs: "column", md: "row" } }}>
//         {/* Mobile Filter Button */}
//         {showFilter && (
//           <Fade in={showFilter}>
//             <Box
//               onClick={() => setIsFilterOpen(true)}
//               sx={{
//                 display: { xs: "flex", md: "none" },
//                 alignItems: "center",
//                 gap: 0.5,
//                 position: "fixed",
//                 top: { xs: 63, sm: 130 },
//                 left: { xs: 1, sm: 4 },
//                 cursor: "pointer",
//                 bgcolor: "#07a966",
//                 color: "#ffffff",
//                 borderRadius: "8px",
//                 padding: "2px 4px",
//                 boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
//                 transition: "all 0.3s ease-in-out",
//                 "&:hover": {
//                   bgcolor: "#07a966",
//                   boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
//                 },
//                 zIndex: 1000,
//               }}
//             >
//               <FaFilter size={8} />
//               <Typography variant="caption" sx={{ fontWeight: "medium", fontSize: "0.75rem" }}>
//                 Filter
//               </Typography>
//             </Box>
//           </Fade>
//         )}

//         {/* Filter Sidebar (Desktop) / Drawer (Mobile) */}
//         {showFilter && (
//           <>
//             <Drawer
//               anchor="left"
//               open={isFilterOpen}
//               onClose={() => setIsFilterOpen(false)}
//               sx={{
//                 "& .MuiDrawer-paper": {
//                   width: { xs: "80vw", sm: "20vw", md: "40vw" },
//                   maxWidth: "200px",
//                   bgcolor: "#fafafa",
//                   p: 2,
//                   transition: "transform 0.3s ease-in-out",
//                 },
//               }}
//             >
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                 <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
//                   Filters
//                 </Typography>
//                 <IconButton onClick={() => setIsFilterOpen(false)} aria-label="Close filters">
//                   <FaTimes size={10} color="#333" />
//                 </IconButton>
//               </Box>
//               <FilterForm
//                 filters={filters}
//                 handleChange={handleFilterChange}
//                 handleApplyFilters={handleApplyFilters}
//                 handleResetFilters={handleResetFilters}
//                 brands={brands}
//                 productItems={productItems}
//                 productData={productData}
//               />
//             </Drawer>

//             <Paper
//               sx={{
//                 width: { md: 200 },
//                 flexShrink: 0,
//                 display: { xs: "none", md: "block" },
//                 p: 3,
//                 bgcolor: "#fafafa",
//                 borderRadius: "12px",
//                 boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                 border: "1px solid #e0e0e0",
//               }}
//             >
//               <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#333" }}>
//                 Filter Desktops
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

//         {/* Desktops Section */}
//         <Box sx={{ flexGrow: 1 }}>
//           {filterLoading || desktopsLoading ? (
//             <Box sx={{ textAlign: "center", py: 10 }}>
//               <Typography variant="body1" color="textSecondary">
//                 Loading...
//               </Typography>
//             </Box>
//           ) : filterError || desktopsError ? (
//             <Box sx={{ textAlign: "center", py: 6, color: "error.main" }}>
//               <Typography variant="body1">Error: {filterError || desktopsError}</Typography>
//             </Box>
//           ) : (
//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: {
//                   xs: "repeat(auto-fill, minmax(150px, 1fr))",
//                   sm: "repeat(auto-fill, minmax(180px, 1fr))",
//                   md: "repeat(auto-fill, minmax(200px, 1fr))",
//                   lg: "repeat(auto-fill, minmax(220px, 1fr))",
//                 },
//                 gap: { xs: 1.5, sm: 2, md: 3, lg: 4 },
//                 mb: 4,
//                 p: 4,
//               }}
//             >
//               {displayDesktops.length > 0 ? (
//                 displayDesktops.map((desktop) => (
//                   <Box
//                     key={desktop.id}
//                     sx={{
//                       transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
//                       "&:hover": {
//                         transform: "translateY(-4px)",
//                         boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
//                       },
//                     }}
//                   >
//                     <DesktopViewCard
//                       id={desktop.id}
//                       imagea={desktop.imagea}
//                       category={desktop.catagory?.name || "Uncategorized"}
//                       name={desktop.name}
//                       ram={desktop.ram}
//                       regularprice={desktop.regularprice}
//                       specialprice={desktop.specialprice}
//                     />
//                   </Box>
//                 ))
//               ) : (
//                 <Typography
//                   sx={{ textAlign: "center", color: "text.secondary", gridColumn: "1 / -1", py: 6 }}
//                 >
//                   No desktops found
//                 </Typography>
//               )}
//             </Box>
//           )}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default DesktopView;


import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDesktops } from "../../../../store/static/desktopSlice";

import DesktopViewCard from "./DesktopViewCard";

import { useSearchParams } from "react-router-dom";
import {
  Box,
  IconButton,
  Drawer,
  Typography,
  Paper,
  Fade,
} from "@mui/material";
import { FaFilter, FaTimes } from "react-icons/fa";
import { API_BASE_URL } from "../../../../store/api";
import { fetchFilteredDesktops, resetFilters, setFilters } from "../../../../store/filters/allFilterSlice";
import FilterForm from "../Filter/FilterForm";

const DesktopView = () => {
  const [searchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const dispatch = useDispatch();
  const { desktops, loading: desktopsLoading, error: desktopsError } = useSelector(
    (state) => state.desktops
  );
  const { filteredDesktops, filters, loading: filterLoading, error: filterError } = useSelector(
    (state) => state.allfilter
  );

  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    processorBrands: ["Intel", "AMD", "Apple"],
    generations: ["8th", "9th","10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th"],
    processorTypes: ["Core i3", "Core i5", "Core i7", "Core i9", "Ryzen 3", "Ryzen 5", "Ryzen 7", "Ryzen 9", "Ryzen 11", "Ryzen 13", "Ryzen 15"],
    warranties: ["1", "2", "3","4","5", "6 ", "7 ","8 "],
    displaySizeRanges: ["14", "15", "16","17", "18", "20","21","22", "23", "24"],
    rams: ["4", "8", "16", "32", "64"],
    graphicsMemories: ["Integrated", "2", "4", "6", "8","16","32",],
    operatingSystems: ["Windows 9", "Windows 10", "Windows 11", "macOS", "Linux"],
    colors: ["Black", "Silver", "White", "Grey", "Pink", "Green", "Blue"],
  });

  useEffect(() => {
    dispatch(fetchDesktops());
    const fetchFilterOptions = async () => {
      try {
        const [brandsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/brands/get/all`),
        ]);

        const brandsData = await brandsRes.json();

        setFilterOptions((prev) => ({
          ...prev,
          brands: brandsData,

        }));
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
    dispatch(fetchFilteredDesktops(filters));
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setIsFilterOpen(false);
  };

  const urlFilteredDesktops = desktops.filter((desktop) => {
    if (searchQuery) {
      return (
        desktop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desktop.catagory?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desktop.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desktop.ram?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desktop.productItem?.productitemname?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const displayDesktops = filteredDesktops.length > 0 ? filteredDesktops : urlFilteredDesktops;

  return (
    <Box
      sx={{
        py: { xs: 1, md: 1 },
        px: { xs: 1, md: 1 },
        bgcolor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
   
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: { xs: 1, md: 2 },
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Mobile Filter Button */}
        <Fade in={true}>
          <Box
            onClick={() => setIsFilterOpen(true)}
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 0.5,
              position: "fixed",
              top: { xs: 63, sm: 130 },
              left: { xs: 1, sm: 4 },
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
              zIndex: 1000,
            }}
          >
            <FaFilter size={8} />
            <Typography
              variant="caption"
              sx={{ fontWeight: "medium", fontSize: "0.75rem" }}
            >
              Filter
            </Typography>
          </Box>
        </Fade>

        {/* Filter Sidebar (Desktop) / Drawer (Mobile) */}
        <>
          <Drawer
            anchor="left"
            open={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            sx={{
              "& .MuiDrawer-paper": {
                width: { xs: "80vw", sm: "20vw", md: "40vw" },
                maxWidth: "220px",
                bgcolor: "#fafafa",
                p: 2,
                transition: "transform 0.3s ease-in-out",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "skyblue" }}
              >
                Filters By
              </Typography>
              <IconButton
                onClick={() => setIsFilterOpen(false)}
                aria-label="Close filters"
              >
                <FaTimes size={10} color="#333" />
              </IconButton>
            </Box>
            <FilterForm
              filters={filters}
              handleChange={handleFilterChange}
              handleApplyFilters={handleApplyFilters}
              handleResetFilters={handleResetFilters}
              filterOptions={filterOptions}
            />
          </Drawer>

          <Paper
            sx={{
              width: { md: 240 },
              flexShrink: 0,
              display: { xs: "none", md: "block" },
              p: 3,
              bgcolor: "#fafafa",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "skyblue" }}
            >
              Filter By
            </Typography>
            <FilterForm
              filters={filters}
              handleChange={handleFilterChange}
              handleApplyFilters={handleApplyFilters}
              handleResetFilters={handleResetFilters}
              filterOptions={filterOptions}
              productType="desktop"
            />
          </Paper>
        </>

        {/* Desktops Section */}
        <Box sx={{ flexGrow: 1 }}>
          {filterLoading || desktopsLoading ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <Typography variant="body1" color="textSecondary">
                Loading...
              </Typography>
            </Box>
          ) : filterError || desktopsError ? (
            <Box sx={{ textAlign: "center", py: 6, color: "error.main" }}>
              <Typography variant="body1">
                Error: {filterError || desktopsError}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
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
              {displayDesktops.length > 0 ? (
                displayDesktops.map((desktop) => (
                  <Box
                    key={desktop.id}
                    sx={{
                      transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <DesktopViewCard
                      id={desktop.id}
                      imagea={desktop.imagea}
                      category={desktop.catagory?.name || "Uncategorized"}
                      name={desktop.name}
                      ram={desktop.ram}
                      regularprice={desktop.regularprice}
                      specialprice={desktop.specialprice}
                    />
                  </Box>
                ))
              ) : (
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    gridColumn: "1 / -1",
                    py: 6,
                  }}
                >
                  No desktops found
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DesktopView;
