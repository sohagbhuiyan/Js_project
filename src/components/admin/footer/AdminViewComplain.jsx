import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
} from "@mui/material";

const AdminViewComplain = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("complaints")) || [];
    setComplaints(stored);
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: "white", mb: 3 }}>
        User Complaints
      </Typography>

      {complaints.length === 0 ? (
        <Typography sx={{ color: "gray" }}>
          No complaints submitted yet.
        </Typography>
      ) : (
        complaints.map((item, index) => (
          <Paper
            key={index}
            sx={{
              backgroundColor: "#1F2937",
              color: "white",
              p: 3,
              mb: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {item.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: "gray" }}>
              {item.email}
            </Typography>
            <Divider sx={{ borderColor: "gray", mb: 1 }} />
            <Typography variant="body1">{item.complaint}</Typography>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default AdminViewComplain;
