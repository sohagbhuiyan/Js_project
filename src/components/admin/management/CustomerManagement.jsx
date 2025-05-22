import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../../store/authSlice";
import { fetchOrders, fetchUserOrders } from "../../../store/orderSlice";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Collapse,
  Divider,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { Navigate } from "react-router-dom";

const CustomerManagement = () => {
  const dispatch = useDispatch();
  const { allUsers, role, token, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { orders, userOrders, loading: orderLoading, error: orderError } = useSelector((state) => state.order);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);

  // Get token from Redux or localStorage
  const authToken = token || localStorage.getItem("authToken");

  // Redirect if not admin or no token
  if (!authToken || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    dispatch(fetchAllUsers()); // Fetch all users
    dispatch(fetchOrders()); // Fetch all orders
  }, [dispatch]);

  const handleViewDetails = (email) => {
    if (selectedUserEmail === email) {
      setSelectedUserEmail(null); // Collapse if already open
    } else {
      setSelectedUserEmail(email);
      dispatch(fetchUserOrders({ email })); // Fetch orders for the selected user
    }
  };

  // Ensure allUsers is an array
  const customers = Array.isArray(allUsers) ? allUsers : [];

  // Calculate total orders per user (from all orders)
  const getTotalOrders = (email) => {
    return orders.filter((order) => order.user?.email === email).length;
  };

  const isLoading = authLoading || orderLoading;
  const error = authError || orderError;

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" fontWeight={600} sx={{ mb: 4 }}>
        Customer Management
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

      {!isLoading && !error && customers.length === 0 && (
        <Typography>No customers found.</Typography>
      )}

      {!isLoading && !error && customers.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="customers table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Phone Number</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Total Orders</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <React.Fragment key={customer.id || customer._id}>
                  <TableRow>
                    <TableCell>{customer.id || customer._id || "N/A"}</TableCell>
                    <TableCell>{customer.name || "Not provided"}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phoneNo || "Not provided"}</TableCell>
                    <TableCell>{customer.role || "user"}</TableCell>
                    <TableCell>{getTotalOrders(customer.email)}</TableCell>
                    
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                      <Collapse in={selectedUserEmail === customer.email} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, bgcolor: "grey.100" }}>
                          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            Customer Details: {customer.name || "Not provided"}
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Box sx={{ mb: 2 }}>
                            <Typography><strong>Email:</strong> {customer.email}</Typography>
                            <Typography><strong>Phone:</strong> {customer.phoneNo || "Not provided"}</Typography>
                            <Typography><strong>Role:</strong> {customer.role || "user"}</Typography>
                            <Typography><strong>Total Orders:</strong>  {getTotalOrders(customer.email)}</Typography>
                          </Box>
                          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            Order History
                          </Typography>
                          {orderLoading && (
                            <CircularProgress size={24} sx={{ display: "block", mx: "auto" }} />
                          )}
                          {orderError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                              Error: {orderError}
                            </Alert>
                          )}
                          {!orderLoading && !orderError && userOrders.length === 0 && (
                               <Typography>No orders found for this customer.</Typography>
                          )}
                          {!orderLoading && !orderError && userOrders.length > 0 && (
                            <TableContainer component={Paper}>
                              <Table size="small" aria-label="order history table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {userOrders.map((order) => (
                                    <TableRow key={order.id || order._id}>
                                      <TableCell>{order.id || order._id || "N/A"}</TableCell>
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
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default CustomerManagement;
