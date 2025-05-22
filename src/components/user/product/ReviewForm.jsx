import { useState } from "react";
import { Box, TextField, Button, Rating, Typography, Paper } from "@mui/material";

const ReviewForm =()=> {
  const [review, setReview] = useState({ name: "", text: "", rating: 0 });

  const handleChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (event, newValue) => {
    setReview({ ...review, rating: newValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Review Submitted:", review);
    alert("Your review has been submitted!");
    setReview({ name: "", text: "", rating: 0 });
  };

  return (
    <div className="p-6 max-w-lg">
      <Typography variant="h6" gutterBottom>
        Your Review
      </Typography>

      {/* Star Rating */}
      <Box className="mb-4">
        <Rating
          name="rating"
          value={review.rating}
          onChange={handleRatingChange}
          size="medium"
        />
      </Box>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Name"
          name="name"
          value={review.name}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          required
        />
        <TextField
          label="Review"
          name="text"
          value={review.text}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          required
          sx={{ mt: 2 }}
        />
        <Button type="submit" variant="contained" color="error" sx={{ mt: 2 }} >
          Submit Review
        </Button>
      </form>
    </div>
  );
}
export default ReviewForm;
