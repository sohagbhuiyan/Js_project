import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../../store/authSlice";
import { fetchOrders } from "../../../store/orderSlice";
import { fetchProducts } from "../../../store/productSlice";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { People, ShoppingCart, Inventory, Storefront } from "@mui/icons-material";

const Dashboard = () => {
  
  const dispatch = useDispatch();
  const { profile, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { orders, loading: orderLoading, error: orderError } = useSelector((state) => state.order);
  const { products, loading: productLoading, error: productError } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProfile()); // Fetches all users
    dispatch(fetchOrders()); // Fetches all orders
    dispatch(fetchProducts()); // Fetches all products
  }, [dispatch]);

  // Calculate metrics
  const totalUsers = Array.isArray(profile) ? profile.length : 0;
  const activeUsers = orders
    ? [...new Set(orders.map((order) => order.user?.email || order.user?.id))].length
    : 0;
  const totalOrders = orders ? orders.length : 0;
  const totalProducts = products ? products.length : 0;

  // Get recent orders (last 5)
  const recentOrders = orders ? orders.slice(0, 5) : [];

  // Loading and error states
  const isLoading = authLoading || orderLoading || productLoading;
  const error = authError || orderError || productError;

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" fontWeight={600} sx={{ mb: 4 }}>
        Dashboard 
      </Typography>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          Error: {error}
        </Alert>
      )}

      {!isLoading && !error && (
        <>
          {/* Metrics Cards */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ display: "flex", alignItems: "center", p: 1 }}>
                <People sx={{ fontSize: 30, color: "primary.main", mr: 1 }} />
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    Total Users
                  </Typography>
                  <Typography variant="h4" ml={3}>{totalUsers}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ display: "flex", alignItems: "center", p: 1 }}>
                <ShoppingCart sx={{ fontSize: 30, color: "primary.main", mr: 1 }} />
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    Active Users
                  </Typography>
                  <Typography variant="h4"  ml={3}>{activeUsers}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ display: "flex", alignItems: "center", p:1 }}>
                <Inventory sx={{ fontSize: 30, color: "primary.main", mr: 1 }} />
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    Total Products
                  </Typography>
                  <Typography variant="h4"  ml={3}>{totalProducts}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={3}>
              <Card sx={{ display: "flex", alignItems: "center", p: 1 }}>
                <Storefront sx={{ fontSize: 30, color: "primary.main", mr: 1 }} />
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    Total Orders
                  </Typography>
                  <Typography variant="h4"  ml={3}>{totalOrders}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Orders Table */}
          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            Recent Orders
          </Typography>
          {recentOrders.length === 0 ? (
            <Typography>No orders available.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="recent orders table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id || order._id}>
                      <TableCell>{order.id || order._id || "N/A"}</TableCell>
                      <TableCell>{order.profile?.email || order.profile?.name || "N/A"}</TableCell>
                      <TableCell>{order.productDetails?.name || "N/A"}</TableCell>
                      <TableCell>{order.quantity || "N/A"}</TableCell>
                      <TableCell>${(order.price || 0).toFixed(2)}</TableCell>
                      <TableCell>{order.status || "Pending"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Box>
  );
};

export default Dashboard;
