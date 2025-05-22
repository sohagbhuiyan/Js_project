import { useState } from "react";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";

const QuestionAnswer = () => {
  const [formData, setFormData] = useState({ name: "", question: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    alert("Your question has been submitted!");
    setFormData({ name: "", question: "" });
  };

  return (
    <div className="p-6 max-w-lg" elevation={3} sx={{ p: 3, mx: "auto", bgcolor: "white" }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Ask a Question
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        {/* Question Input */}
        <TextField
          label="Question"
          name="question"
          value={formData.question}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          required
          sx={{ mb: 2 }}
        />

        {/* Submit Button */}
        <Box>
          <Button type="submit" variant="contained" color="error">
            Submit
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default QuestionAnswer;
