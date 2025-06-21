import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Slider,
} from '@mui/material';

const FilterForm = ({
  filters,
  handleChange,
  handleApplyFilters,
  handleResetFilters,
  filterOptions,
  productType = 'desktop', // 'desktop', 'laptop', 'printer', 'camera', or 'network'
}) => {
  const renderFilterField = (name, label, options, unit = '') => (
    <FormControl fullWidth size="small" key={name}>
      <InputLabel sx={{ fontSize: '0.9rem', color: '#555' }}>{label}</InputLabel>
      <Select
        name={name}
        value={filters[name] || ''}
        onChange={handleChange}
        label={label}
        renderValue={(selected) =>
          selected ? `${selected}${unit}` : <span style={{ color: '#999' }}>All</span>
        }
        sx={{
          fontSize: '0.8rem',
          height: 40,
          bgcolor: '#fff',
          borderRadius: '8px',
          '&:hover': { bgcolor: '#f1f5f9' },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
          },
        }}
      >
        <MenuItem value="" sx={{ fontSize: '0.8rem' }}>
          All
        </MenuItem>
        {options.map((option) => (
          <MenuItem
            key={option.id || option}
            value={option.brandname || option}
            sx={{ fontSize: '0.8rem' }}
          >
            {option.brandname || option}{unit}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const handlePriceChange = (event, newValue) => {
    handleChange({
      target: {
        name: 'regularprice',
        value: newValue[1], // Use max value for single price filter
      },
    });
  };

  const priceRange = filters.regularprice
    ? [0, filters.regularprice]
    : [0, filterOptions.maxPrice || 200000];

  const commonFields = [
    { name: 'regularprice', label: 'Price', type: 'slider' },
    { name: 'brandName', label: 'Brand', options: filterOptions.brands },
    { name: 'warranty', label: 'Warranty (Years)', options: filterOptions.warranties, unit: ' years' },
  ];

  const desktopFields = [
    {
      name: 'processorbrand',
      label: 'Processor Brand',
      options: filterOptions.processorBrands || [],
    },
    { name: 'generation', label: 'Generation', options: filterOptions.generations || [] },
    {
      name: 'processortype',
      label: 'Processor Type',
      options: filterOptions.processortypes || [],
    },
    {
      name: 'displaysizerange',
      label: 'Display Size Range',
      options: filterOptions.displaySizeRanges || [],
      unit: ' inch',
    },
    { name: 'ram', label: 'RAM', options: filterOptions.rams || [], unit: ' GB' },
    {
      name: 'graphicsmemory',
      label: 'Graphics Memory',
      options: filterOptions.graphicsMemories || [],
      unit: ' GB',
    },
    {
      name: 'operatingsystem',
      label: 'Operating System',
      options: filterOptions.operatingSystems || [],
    },
    { name: 'color', label: 'Color', options: filterOptions.colors || [] },
  ];

  const laptopFields = [
    { name: 'generation', label: 'Generation', options: filterOptions.generations || [], unit: 'th' },
    {
      name: 'processortype',
      label: 'Processor Type',
      options: filterOptions.processorTypes || [],
    },
    {
      name: 'displaysizerange',
      label: 'Display Size Range',
      options: filterOptions.displaySizeRanges || [],
      unit: ' inch',
    },
    { name: 'ram', label: 'RAM', options: filterOptions.rams || [], unit: ' GB' },
    {
      name: 'graphicsmemory',
      label: 'Graphics Memory',
      options: filterOptions.graphicsMemories || [],
      unit: ' GB',
    },
    {
      name: 'operatingsystem',
      label: 'Operating System',
      options: filterOptions.operatingSystems || [],
    },
    { name: 'color', label: 'Color', options: filterOptions.colors || [] },
    {
      name: 'weightrange',
      label: 'Weight Range',
      options: filterOptions.weightRanges || ['<1.5kg', '1.5-2kg', '>2kg'],
    },
    {
      name: 'fingerprintsensor',
      label: 'Fingerprint Sensor',
      options: filterOptions.fingerprintSensors || ['Yes', 'No'],
    },
    {
      name: 'lan',
      label: 'LAN',
      options: filterOptions.lans || ['Yes', 'No', 'Gigabit Ethernet'],
    },
    {
      name: 'graphicschipset',
      label: 'Graphics Chipset',
      options:
        filterOptions.graphicsChipsets ||
        ['Intel Iris Xe', 'NVIDIA GeForce GTX', 'NVIDIA GeForce RTX', 'AMD Radeon'],
    },
    {
      name: 'maxramsupport',
      label: 'Max RAM Support',
      options: filterOptions.maxRamSupports || ['16GB', '32GB', '64GB', '128GB'],
    },
    {
      name: 'touchscreen',
      label: 'Touchscreen',
      options: filterOptions.touchscreens || ['Yes', 'No'],
    },
    {
      name: 'displayresolutionrange',
      label: 'Display Resolution',
      options:
        filterOptions.displayResolutionRanges ||
        ['1366x768', '1920x1080', '2560x1440', '3840x2160'],
    },
  ];

  const printerFields = [
    { name: 'type', label: 'Printer Type', options: filterOptions.type || [] },
    { name: 'printspeed', label: 'Print Speed', options: filterOptions.printspeed || [] },
    { name: 'printwidth', label: 'Print Width', options: filterOptions.printwidth || [] },
    {
      name: 'printresolution',
      label: 'Print Resolution',
      options: filterOptions.printresolution || [],
    },
    { name: 'interfaces', label: 'Interfaces', options: filterOptions.interfaces || [] },
    { name: 'bodycolor', label: 'Body Color', options: filterOptions.bodycolor || [] },
  ];

  const cameraFields = [
    { name: 'totalpixel', label: 'Total Pixel', options: filterOptions.totalpixel || [] },
    { name: 'displaysize', label: 'Display Size', options: filterOptions.displaysize || [] },
    { name: 'digitalzoom', label: 'Digital Zoom', options: filterOptions.digitalzoom || [] },
    { name: 'opticalzoom', label: 'Optical Zoom', options: filterOptions.opticalzoom || [] },
  ];

  const networkFields = [
    { name: 'mimotechnology', label: 'MIMO Technology', options: filterOptions.mimotechnologies || [] },
    { name: 'vpnsupport', label: 'VPN Support', options: filterOptions.vpnsupports || [] },
    { name: 'wificoveragerange', label: 'WiFi Coverage Range', options: filterOptions.wificoverageranges || [] },
    { name: 'datatransferrate', label: 'Data Transfer Rate', options: filterOptions.datatransferrates || [] },
    { name: 'datatransferratewifi', label: 'WiFi Data Transfer Rate', options: filterOptions.datatransferratewifis || [] },
    { name: 'numberoflanport', label: 'Number of LAN Ports', options: filterOptions.numberoflanports || [] },
    { name: 'numberofwanport', label: 'Number of WAN Ports', options: filterOptions.numberofwanports || [] },
    { name: 'wannetworkstandard', label: 'WAN Network Standard', options: filterOptions.wannetworkstandards || [] },
    { name: 'lannetworkstandard', label: 'LAN Network Standard', options: filterOptions.lannetworkstandards || [] },
    { name: 'wifigeneration', label: 'WiFi Generation', options: filterOptions.wifigenerations || [] },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 240 }}>
      {/* Apply and Reset Buttons */}
      <Box sx={{ display: 'flex', gap: 5, mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleApplyFilters}
          disabled={!Object.values(filters).some((v) => v && (Array.isArray(v) ? v.length > 0 : true))}
          sx={{
            fontSize: '0.7rem',
            bgcolor: '#1976d2',
            borderRadius: '8px',
            '&:hover': {
              bgcolor: '#1565c0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            },
            '&:disabled': { bgcolor: '#b0bec5' },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Apply
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleResetFilters}
          sx={{
            fontSize: '0.7rem',
            borderColor: '#f50057',
            color: '#f50057',
            borderRadius: '8px',
            '&:hover': { bgcolor: '#fce4ec', borderColor: '#d81b60' },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Reset
        </Button>
      </Box>

      {/* Common Filter Fields */}
      {commonFields.map((field) =>
        field.type === 'slider' ? (
          <Box key={field.name} sx={{ px: 1 }}>
            <Typography variant="body2" sx={{ fontSize: '0.9rem', color: '#555', mb: 1 }}>
              {field.label}: Tk {priceRange[0]} - Tk {priceRange[1]}
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={filterOptions.maxPrice || 200000}
              step={50}
              sx={{
                color: '#1976d2',
                '& .MuiSlider-thumb': {
                  height: 18,
                  width: 18,
                  bgcolor: '#fff',
                  border: '2px solid #1976d2',
                  '&:hover': { boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)' },
                },
                '& .MuiSlider-track': { height: 4 },
                '& .MuiSlider-rail': { height: 4, bgcolor: '#e0e0e0' },
                '& .MuiSlider-valueLabel': {
                  fontSize: '0.75rem',
                  bgcolor: '#1976d2',
                  color: '#fff',
                  borderRadius: '4px',
                  padding: '2px 6px',
                },
              }}
            />
          </Box>
        ) : (
          renderFilterField(field.name, field.label, field.options, field.unit || '')
        )
      )}

      {/* Product-Specific Filter Fields */}
      {productType === 'desktop' &&
        desktopFields.map((field) =>
          renderFilterField(field.name, field.label, field.options, field.unit || '')
        )}

      {productType === 'laptop' &&
        laptopFields.map((field) =>
          renderFilterField(field.name, field.label, field.options, field.unit || '')
        )}

      {productType === 'printer' &&
        printerFields.map((field) =>
          renderFilterField(field.name, field.label, field.options, field.unit || '')
        )}

      {productType === 'camera' &&
        cameraFields.map((field) =>
          renderFilterField(field.name, field.label, field.options, field.unit || '')
        )}

      {productType === 'network' &&
        networkFields.map((field) =>
          renderFilterField(field.name, field.label, field.options, field.unit || '')
        )}
    </Box>
  );
};

export default FilterForm;