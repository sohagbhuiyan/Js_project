import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
} from "@mui/material";

const FilterForm = ({
  filters,
  handleChange,
  handleApplyFilters,
  handleResetFilters,
  filterOptions,
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxWidth: 240 }}>
    
    <Box sx={{ display: "flex", gap: 5,mb:2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleApplyFilters}
        disabled={!Object.values(filters).some((v) => v)}
        sx={{
          fontSize: "0.7rem",
          bgcolor: "#1976d2",
          borderRadius: "8px",
          "&:hover": {
            bgcolor: "#1565c0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          },
          "&:disabled": { bgcolor: "#b0bec5" },
          transition: "all 0.2s ease-in-out",
        }}
      >
        Apply
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleResetFilters}
        sx={{
          fontSize: "0.7rem",
          borderColor: "#f50057",
          color: "#f50057",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#fce4ec", borderColor: "#d81b60" },
          transition: "all 0.2s ease-in-out",
        }}
      >
        Reset
      </Button>
    </Box>
    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>Brand</InputLabel>
      <Select
        name="brandName"
        value={filters.brandName || ""}
        onChange={handleChange}
        label="Brand"
        renderValue={(selected) =>
          selected || <span style={{ color: "#999" }}>All</span>
        }
        sx={{
          fontSize: "0.8rem",
          height: 40,
          bgcolor: "#fff",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#f1f5f9" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
          },
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8rem" }}>
          All
        </MenuItem>
        {filterOptions.brands.map((brand) => (
          <MenuItem
            key={brand.id}
            value={brand.brandname}
            sx={{ fontSize: "0.8rem" }}
          >
            {brand.brandname}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>
        Processor Brand
      </InputLabel>
      <Select
        name="processorbrand"
        value={filters.processorbrand || ""}
        onChange={handleChange}
        label="Processor Brand"
        sx={{
          fontSize: "0.8rem",
          height: 40,
          bgcolor: "#fff",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#f1f5f9" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
          },
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8rem" }}>
          All
        </MenuItem>
        {filterOptions.processorBrands.map((brand) => (
          <MenuItem key={brand} value={brand} sx={{ fontSize: "0.8rem" }}>
            {brand}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>
        Generation
      </InputLabel>
      <Select
        name="generation"
        value={filters.generation || ""}
        onChange={handleChange}
        label="Generation"
        sx={{
          fontSize: "0.8rem",
          height: 40,
          bgcolor: "#fff",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#f1f5f9" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
          },
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8rem" }}>
          All
        </MenuItem>
        {filterOptions.generations.map((gen) => (
          <MenuItem key={gen} value={gen} sx={{ fontSize: "0.8rem" }}>
            {gen}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>
        Processor Type
      </InputLabel>
      <Select
        name="processortype"
        value={filters.processortype || ""}
        onChange={handleChange}
        label="Processor Type"
        sx={{
          fontSize: "0.8rem",
          height: 40,
          bgcolor: "#fff",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#f1f5f9" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
          },
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8rem" }}>
          All
        </MenuItem>
        {filterOptions.processorTypes.map((type) => (
          <MenuItem key={type} value={type} sx={{ fontSize: "0.8rem" }}>
            {type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>
        Warranty (Years)
      </InputLabel>
      <Select
        name="warranty"
        value={filters.warranty || ""}
        onChange={handleChange}
        label="Warranty (Years)"
        sx={{
          fontSize: "0.8rem",
          height: 40,
          bgcolor: "#fff",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#f1f5f9" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
          },
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8rem" }}>
          All
        </MenuItem>
        {filterOptions.warranties.map((warranty) => (
          <MenuItem key={warranty} value={warranty} sx={{ fontSize: "0.8rem" }}>
            {warranty}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>
        Display Size Range
      </InputLabel>
      <Select
        name="displaysizerange"
        value={filters.displaysizerange || ""}
        onChange={handleChange}
        label="Display Size Range"
        sx={{
          fontSize: "0.8rem",
          height: 40,
          bgcolor: "#fff",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#f1f5f9" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
          },
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8rem" }}>
          All
        </MenuItem>
        {filterOptions.displaySizeRanges.map((range) => (
          <MenuItem key={range} value={range} sx={{ fontSize: "0.8rem" }}>
            {range}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>RAM</InputLabel>
      <Select
        name="ram"
        value={filters.ram || ""}
        onChange={handleChange}
        label="RAM"
        sx={{
          fontSize: "0.8rem",
          height: 40,
          bgcolor: "#fff",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#f1f5f9" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
          },
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8rem" }}>
          All
        </MenuItem>
        {filterOptions.rams.map((ram) => (
          <MenuItem key={ram} value={ram} sx={{ fontSize: "0.8rem" }}>
            {ram}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>
        Graphics Memory
      </InputLabel>
      <Select
        name="graphicsmemory"
        value={filters.graphicsmemory || ""}
        onChange={handleChange}
        label="Graphics Memory"
        sx={{
          fontSize: "0.8rem",
          height: 40,
          bgcolor: "#fff",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#f1f5f9" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
          },
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8rem" }}>
          All
        </MenuItem>
        {filterOptions.graphicsMemories.map((memory) => (
          <MenuItem key={memory} value={memory} sx={{ fontSize: "0.8rem" }}>
            {memory}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>
        Operating System
      </InputLabel>
      <Select
        name="operatingsystem"
        value={filters.operatingsystem || ""}
        onChange={handleChange}
        label="Operating System"
        sx={{
          fontSize: "0.8rem",
          height: 40,
          bgcolor: "#fff",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#f1f5f9" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
          },
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8rem" }}>
          All
        </MenuItem>
        {filterOptions.operatingSystems.map((os) => (
          <MenuItem key={os} value={os} sx={{ fontSize: "0.8rem" }}>
            {os}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>Color</InputLabel>
      <Select
        name="color"
        value={filters.color || ""}
        onChange={handleChange}
        label="Color"
        sx={{
          fontSize: "0.8rem",
          height: 40,
          bgcolor: "#fff",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#f1f5f9" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
          },
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8rem" }}>
          All
        </MenuItem>
        {filterOptions.colors.map((color) => (
          <MenuItem key={color} value={color} sx={{ fontSize: "0.8rem" }}>
            {color}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

  </Box>
);

export default FilterForm;