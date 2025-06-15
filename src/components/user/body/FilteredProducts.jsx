import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Divider,
  Drawer,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import FilterListIcon from "@mui/icons-material/FilterList";
import { API_BASE_URL } from "../../../store/api";

const priceRange = [0, 360000];
const warrantyOptions = [0, 1, 2]; // Assuming warranty in years (0 = No warranty, 1 = 1 year, 2 = 2 years)

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 300,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down("sm")]: {
      width: 250,
    },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const StyledSidebar = styled(Box)(({ theme }) => ({
  width: 150,
  paddingRight: theme.spacing(3),
  marginLeft: "-5rem",
  padding: "4px 15px",
  border : `0.5px solid ${theme.palette.grey[400]}`,
  borderRight: `1px solid ${theme.palette.grey[400]}`,
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const FilteredProducts = () => {
  const [minPrice, setMinPrice] = useState(priceRange[0]);
  const [maxPrice, setMaxPrice] = useState(priceRange[1]);
  const [selectedWarranties, setSelectedWarranties] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Reset filters
  const resetFilters = () => {
    setMinPrice(priceRange[0]);
    setMaxPrice(priceRange[1]);
    setSelectedWarranties([]);
  };

  // Fetch filtered products using ccBuilder API
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchFiltered = async () => {
        setLoading(true);
        try {
          let query = `regularprice=${minPrice}-${maxPrice}`;
          if (selectedWarranties.length > 0) {
            query += `&warranty=${selectedWarranties.join(",")}`;
          }

          const res = await axios.get(
            `${API_BASE_URL}/api/ccbuilder/items/filter?${query}`
          );
          setProducts(res.data);
        } catch (err) {
          console.error("Fetch error:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchFiltered();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [minPrice, maxPrice, selectedWarranties]);

  // Handle warranty checkbox changes
  const handleWarrantyChange = (warranty) => {
    setSelectedWarranties((prev) =>
      prev.includes(warranty)
        ? prev.filter((w) => w !== warranty)
        : [...prev, warranty]
    );
  };

  // Toggle mobile drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sidebar content
  const drawerContent = (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Filter
        </Typography>
        <Button
          variant="text"
          color="primary"
          onClick={resetFilters}
          sx={{ textTransform: "none" }}
        >
          Clear
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box mb={3}>
        <Typography fontWeight="bold" mb={1}>
          Price Range
        </Typography>
        <Slider
          value={[minPrice, maxPrice]}
          onChange={(e, newVal) => {
            setMinPrice(newVal[0]);
            setMaxPrice(newVal[1]);
          }}
          min={priceRange[0]}
          max={priceRange[1]}
          step={5000}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `$${value}`}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="caption">${minPrice}</Typography>
          <Typography variant="caption">${maxPrice}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography fontWeight="bold" mb={1}>
        Warranty
      </Typography>
      <FormGroup>
        {warrantyOptions.map((warranty) => (
          <FormControlLabel
            key={warranty}
            control={
              <Checkbox
                checked={selectedWarranties.includes(warranty)}
                onChange={() => handleWarrantyChange(warranty)}
              />
            }
            label={warranty === 0 ? "No Warranty" : `${warranty} Year${warranty > 1 ? "s" : ""}`}
          />
        ))}
      </FormGroup>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", p: { xs: 1, md: 0 } }}>
      {/* Mobile Filter Button */}
      <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={handleDrawerToggle}
          sx={{ textTransform: "none" }}
        >
          Filters
        </Button>
      </Box>

      {/* Sidebar for Desktop */}
      <StyledSidebar>
        {drawerContent}
      </StyledSidebar>

      {/* Mobile Drawer */}
      <StyledDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {drawerContent}
      </StyledDrawer>

      {/* Product View */}
      <Box sx={{ flexGrow: 1, pl: { md: 2 } }}>
        {loading ? (
          <Box textAlign="center" mt={10}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Typography textAlign="center" mt={5} variant="h6">
            No products found.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <StyledCard>
                  <CardMedia
                    component="img"
                    height="100"
                    image={`${API_BASE_URL}/images/${product.imagea || "default.jpg"}`}
                    alt={product.name}
                    // onError={(e) => {
                    //   e.target.src = "/fallback.png"; // Fallback if image not found
                    // }}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ${product.regularprice}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Warranty: {product.warranty === 0 ? "No Warranty" : `${product.warranty} Year${product.warranty > 1 ? "s" : ""}`}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default FilteredProducts;
