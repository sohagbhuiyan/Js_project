// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProfile } from "../../../store/authSlice";
// import { fetchOrders } from "../../../store/orderSlice";
// import { fetchProducts } from "../../../store/productSlice";
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import { People, ShoppingCart, Inventory, Storefront } from "@mui/icons-material";

// const Dashboard = () => {
  
//   const dispatch = useDispatch();
//   const { profile, loading: authLoading, error: authError } = useSelector((state) => state.auth);
//   const { orders, loading: orderLoading, error: orderError } = useSelector((state) => state.order);
//   const { products, loading: productLoading, error: productError } = useSelector((state) => state.products);

//   useEffect(() => {
//     dispatch(fetchProfile()); // Fetches all users
//     dispatch(fetchOrders()); // Fetches all orders
//     dispatch(fetchProducts()); // Fetches all products
//   }, [dispatch]);

//   // Calculate metrics
//   const totalUsers = Array.isArray(profile) ? profile.length : 0;
//   const activeUsers = orders
//     ? [...new Set(orders.map((order) => order.user?.email || order.user?.id))].length
//     : 0;
//   const totalOrders = orders ? orders.length : 0;
//   const totalProducts = products ? products.length : 0;

//   // Get recent orders (last 5)
//   const recentOrders = orders ? orders.slice(0, 5) : [];

//   // Loading and error states
//   const isLoading = authLoading || orderLoading || productLoading;
//   const error = authError || orderError || productError;

//   return (
//     <Box className="p-6 bg-gray-50 min-h-screen">
//       <Typography variant="h4" fontWeight={600} sx={{ mb: 4 }}>
//         Dashboard 
//       </Typography>

//       {isLoading && (
//         <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
//           <CircularProgress />
//         </Box>
//       )}

//       {error && (
//         <Alert severity="error" sx={{ mb: 4 }}>
//           Error: {error}
//         </Alert>
//       )}

//       {!isLoading && !error && (
//         <>
//           {/* Metrics Cards */}
//           <Grid container spacing={3} sx={{ mb: 6 }}>
//             <Grid item xs={12} sm={6} md={3}>
//               <Card sx={{ display: "flex", alignItems: "center", p: 1 }}>
//                 <ShoppingCart sx={{ fontSize: 30, color: "primary.main", mr: 1 }} />
//                 <CardContent>
//                   <Typography variant="h6" fontWeight={600}>
//                     Active Users
//                   </Typography>
//                   <Typography variant="h4"  ml={3}>{activeUsers}</Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <Card sx={{ display: "flex", alignItems: "center", p:1 }}>
//                 <Inventory sx={{ fontSize: 30, color: "primary.main", mr: 1 }} />
//                 <CardContent>
//                   <Typography variant="h6" fontWeight={600}>
//                     Total Products
//                   </Typography>
//                   <Typography variant="h4"  ml={3}>{totalProducts}</Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} sm={5} md={3}>
//               <Card sx={{ display: "flex", alignItems: "center", p: 1 }}>
//                 <Storefront sx={{ fontSize: 30, color: "primary.main", mr: 1 }} />
//                 <CardContent>
//                   <Typography variant="h6" fontWeight={600}>
//                     Total Orders
//                   </Typography>
//                   <Typography variant="h4"  ml={3}>{totalOrders}</Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>

//           {/* Recent Orders Table */}

//         </>
//       )}
//     </Box>
//   );
// };

// export default Dashboard;

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
import { ShoppingCart, Inventory, Storefront } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { orders, loading: orderLoading, error: orderError } = useSelector((state) => state.order);
  const { products, loading: productLoading, error: productError } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchOrders());
    dispatch(fetchProducts());
  }, [dispatch]);

  const activeUsers = orders ? [...new Set(orders.map((o) => o.user?.email || o.user?.id))].length : 0;
  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;
  const recentOrders = orders?.slice(0, 5) || [];

  const isLoading = authLoading || orderLoading || productLoading;
  const error = authError || orderError || productError;

  const chartData = [
    { name: "Users", value: activeUsers },
    { name: "Orders", value: totalOrders },
    { name: "Products", value: totalProducts },
  ];

  return (
    <Box
      className="p-1 bg-gray-50 "
      sx={{
        mt: { xs: 8, md: 10 },
        zIndex: 0,
    
      }}
    >
      <Typography variant="h4" fontWeight={600} sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          Error: {error}
        </Alert>
      ) : (
        <>
          {/* Metrics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
                <ShoppingCart sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="subtitle1">Total Users</Typography>
                  <Typography variant="h5">{activeUsers}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
                <Storefront sx={{ fontSize: 32, color: "success.main", mr: 2 }} />
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="subtitle1">Total Orders</Typography>
                  <Typography variant="h5">{totalOrders}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
                <Inventory sx={{ fontSize: 32, color: "warning.main", mr: 2 }} />
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="subtitle1">Total Products</Typography>
                  <Typography variant="h5">{totalProducts}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Chart */}
          <Card sx={{ mb: 5, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Overview Chart
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={chartData}
                barCategoryGap="30%"
                margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDataOverflow />
                <Tooltip />
                <Bar dataKey="value" fill="#1976d2" barSize={40} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent Orders */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent Orders
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>Order ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total</TableCell>
              
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.user?.email || "N/A"}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>${order.total || "N/A"}</TableCell>
              
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default Dashboard;

