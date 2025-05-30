// import React, { useState, useEffect } from "react";
// import { TextField, Button, Box, Container, Typography, Paper, Alert } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { registerUser, clearError } from "../../../store/authSlice";
// import { useNavigate, Link } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";

// const Registration = () => {
//   const [formData, setFormData] = useState({ name: "", email: "", phoneNo: "", password: "" });
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error, token } = useSelector((state) => state.auth);
//   const [successMessage, setSuccessMessage] = useState("");

//   useEffect(() => {
//     dispatch(clearError());
//   }, [dispatch]);

//   useEffect(() => {
//     if (token) {
//       navigate("/");
//     }
//   }, [token, navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSuccessMessage("");

//     const result = await dispatch(registerUser(formData));

//     if (registerUser.fulfilled.match(result)) {
//       setSuccessMessage("Registration successful!");
//       navigate("/login");
//       toast.success("Registration successful!", {
//             duration: 3000,
//             style: { background: "#10B981", color: "#FFFFFF", fontWeight: "bold" },
//           });
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Paper elevation={3} sx={{ padding: 4, marginTop: 4, marginBottom: 2 }}>
//         <Typography variant="h5" component="h2" gutterBottom>
//           Register
//         </Typography>

//         {successMessage && <Alert severity="success">{successMessage}</Alert>}
//         {error && <Alert severity="error">{error}</Alert>}

//         <form onSubmit={handleSubmit}>
//           <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} margin="normal" required />
//           <TextField fullWidth label="Phone Number" name="phoneNo" value={formData.phoneNo} onChange={handleChange} margin="normal" />
//           <TextField fullWidth type="email" label="Email" name="email" value={formData.email} onChange={handleChange} margin="normal" required />
//           <TextField fullWidth type="password" label="Password" name="password" value={formData.password} onChange={handleChange} margin="normal" required />
//           <Box mt={2}>
//             <Button type="submit" variant="contained" color="error" fullWidth disabled={loading}>
//               {loading ? "Registering..." : "Register"}
//             </Button>
//           </Box>
//         </form>

//         <Typography mt={2} variant="body2">
//           Already registered?{" "}
//           <Link to="/login" style={{ color: "#1976d2", textDecoration: "none" }}>
//             Login now
//           </Link>
//         </Typography>
//       </Paper>
//        <Toaster position="top-right" />
//     </Container>
//   );
// };

// export default Registration;


import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Container, Typography, Paper, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../../../store/authSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Registration = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phoneNo: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState("");

  // Clear errors on component mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Check for activation status from query parameter
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const isActivated = query.get("activated");

    if (isActivated === "true") {
      // Show success toast and redirect to login page after activation
      toast.success("Account activated! Please log in.", {
        duration: 3000,
        style: { background: "#10B981", color: "#FFFFFF", fontWeight: "bold" },
      });
      navigate("/login");
    }
  }, [navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      setSuccessMessage("Registration successful! Please check your Gmail to activate your account.");
      // Redirect to Gmail
      window.location.href = "https://mail.google.com";
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4, marginBottom: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Register
        </Typography>

        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            type="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="error" fullWidth disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </Box>
        </form>

        <Typography mt={2} variant="body2">
          Already registered?{" "}
          <Link to="/login" style={{ color: "#1976d2", textDecoration: "none" }}>
            Login now
          </Link>
        </Typography>
      </Paper>
      <Toaster position="top-right" />
    </Container>
  );
};

export default Registration;