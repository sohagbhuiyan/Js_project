import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Container, Paper, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, token, error: authError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (authError) {
      setLocalError(authError);
    }
  }, [authError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      
      navigate("/");
          toast.success("Login successfully", {
            duration: 3000,
            style: { background: "#10B981", color: "#FFFFFF", fontWeight: "bold" },
          });
    } else if (loginUser.rejected.match(result)) {
      setLocalError(result.payload || "Login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4, marginBottom: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Login
        </Typography>

        {localError && <Alert severity="error">{localError}</Alert>}

        <form onSubmit={handleSubmit}>
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
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </form>

        <Typography mt={2} variant="body2">
          Don't have an account?{" "}
          <Link to="/registration" style={{ color: "#1976d2", textDecoration: "none" }}>
            Register now
          </Link>
        </Typography>
      </Paper>
    
    </Container>
    
  );
};

export default Login;
