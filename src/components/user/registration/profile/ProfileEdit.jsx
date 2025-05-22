import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Grid, Paper, TextField, Button, MenuItem, Typography, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const ProfileEdit = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [profileData, setProfileData] = useState({ name: "", email: "" ,phoneNo:""});
  
    useEffect(() => {
      const fetchProfileData = async () => {
        try {
          const response = await axios.get("http://108.181.173.121:6061/api/userRegistration/get");
          setProfileData({
            name: response.data.name, // Adjust according to the actual response structure
            email: response.data.email,
            phoneNo: response.data.phoneNo, // Adjust according to the actual response structure
          });
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };
  
      fetchProfileData();
    }, []);
  
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 2 }}>
        <Grid container spacing={2}>
          {/* Sidebar */}
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Avatar sx={{ width: 80, height: 80, margin: "auto" }} />
              <Typography variant="h6" sx={{ mt: 1 }}>{profileData.name}</Typography>
              <Typography variant="body2">{profileData.phoneNo}</Typography>
              <Typography variant="body2" color="text.secondary">N/A</Typography>
              <Button fullWidth sx={{ mt: 2 }}>Orders</Button>
              <Button fullWidth variant="contained" sx={{ my: 1 }}>Profile</Button>
              <Button fullWidth>Favorites</Button>
            </Paper>
          </Grid>
  
          {/* Profile Form */}
          <Grid item xs={12} sm={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Account Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Full Name" variant="outlined" value={profileData.name} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Phone No" variant="outlined" value={profileData.phoneNo} disabled />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email" variant="outlined" value={profileData.email} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Address" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField select fullWidth label="Gender" variant="outlined">
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button variant="outlined" component="label" fullWidth>
                    Upload Image
                    <input type="file" hidden />
                  </Button>
                </Grid>
              </Grid>
              <Button fullWidth variant="contained" sx={{ mt: 2 }}>Update Information</Button>
            </Paper>
  
            <Paper sx={{ p: 2, mt: 3 }}>
              <Typography variant="h6" gutterBottom>Password</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Old Password" type="password" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="New Password" type="password" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Confirm Password" type="password" variant="outlined" />
                </Grid>
              </Grid>
              <Button fullWidth variant="contained" sx={{ mt: 2 }}>Update Password</Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  };
  
  export default ProfileEdit;
