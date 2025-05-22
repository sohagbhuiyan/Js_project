import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Slider,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";

const FilteredProducts = () => {
  const [brandname, setBrandname] = useState("Hp");
  const [productName, setProductName] = useState("");
  const [regularPrice, setRegularPrice] = useState(1000);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const brandOptions = ["Hp", "Dell", "Asus", "Acer"];

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        let url = `http://75.119.134.82:6161/api/productDetails/filter?brandname=${brandname}`;
        if (productName) url += `&productName=${productName}`;
        if (regularPrice) url += `&regularPrice=${regularPrice}`;
        const res = await axios.get(url);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [brandname, productName, regularPrice]);

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2, py: 4 }}>
      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          🔍 Filter Products
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="Brand Name"
              value={brandname}
              onChange={(e) => setBrandname(e.target.value)}
            >
              {brandOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Product Name"
              fullWidth
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography gutterBottom>Regular Price: ≤ ${regularPrice}</Typography>
            <Slider
              value={regularPrice}
              onChange={(e, newValue) => setRegularPrice(newValue)}
              min={50}
              max={3000}
              step={50}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box textAlign="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" mt={4}>
          No products found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                {product.imagea && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={`http://75.119.134.82:6161/images/${product.imagea}`}
                    alt={product.productName}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {product.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Brand: {product.brandname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${product.regularPrice}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default FilteredProducts;
