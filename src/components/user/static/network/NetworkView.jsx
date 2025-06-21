import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  IconButton,
  Drawer,
  Typography,
  Paper,
  Fade,
} from '@mui/material';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { API_BASE_URL } from '../../../../store/api';
import {
  fetchNetworks,
} from '../../../../store/static/networkSlice';
import {
  setFilters,
  resetFilters,
} from '../../../../store/filters/allfilterSlice';
import FilterForm from '../Filter/FilterForm';
import NetworkViewCard from './NetworkViewCard';

const NetworkView = () => {
  const [searchParams] = useSearchParams();
  const searchParam = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const dispatch = useDispatch();
  const { networks, loading: networksLoading, error: networksError } = useSelector(
    (state) => state.networks
  );
  const {
    filteredNetworks = networks, // Fallback to all networks if no filteredNetworks
    filters,
    loading: filterLoading,
    error: filterError,
  } = useSelector((state) => state.allfilter);

  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    bandwidth: ['100Mbps', '300Mbps', '500Mbps', '1Gbps', '2.5Gbps'],
    coverage: ['100m', '200m', '300m', '500m', '1km'],
    warranties: ['1', '2', '3', '4', '5'],
    maxPrice: 200000, // Adjust based on expected network equipment price range
    mimotechnologies: ['2x2', '4x4', '8x8'],
    vpnsupports: ['Yes', 'No'],
    wificoverageranges: ['100m', '200m', '300m', '500m', '1000m'],
    color: ['Black', 'White', 'Grey', 'Silver', 'Red', 'Green' ],
    datatransferrates: ['100Mbps', '1Gbps', '2.5Gbps', '5Gbps', '10Gbps'],
    datatransferratewifis: ['300Mbps', '600Mbps', '1200Mbps', '2400Mbps', '4800Mbps'],
    numberoflanports: ['1', '2', '4', '8', '16'],
    numberofwanports: ['1', '2', '4'],
    wannetworkstandards: ['10/100', 'Gigabit', '2.5GbE', '10GbE'],
    lannetworkstandards: ['10/100', 'Gigabit', '2.5GbE', '10GbE'],
    wifigenerations: ['Wi-Fi 4', 'Wi-Fi 5', 'Wi-Fi 6', 'Wi-Fi 6E', 'Wi-Fi 7'],

  });

  useEffect(() => {
    dispatch(fetchNetworks());
    const fetchFilterOptions = async () => {
      try {
        const [brandsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/brands/get/all`),
        ]);
        const brandsData = await brandsRes.json();
        setFilterOptions((prev) => ({
          ...prev,
          brands: brandsData,
        }));
      } catch (err) {
        console.error('Failed to fetch filter options:', err);
      }
    };
    fetchFilterOptions();
  }, [dispatch]);

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
  };

  const handleApplyFilters = () => {
    // Assuming a fetchFilteredNetworks action or client-side filtering
    dispatch(setFilters(filters));
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setIsFilterOpen(false);
  };

  const urlFilteredNetworks = networks.filter((network) => {
    if (searchQuery) {
      return (
        network.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        network.catagory?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        network.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        network.productItem?.productitemname?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const displayNetworks =
    filteredNetworks.length > 0 ? filteredNetworks : urlFilteredNetworks;

  return (
    <Box
      sx={{
        py: { xs: 1, md: 1 },
        px: { xs: 1, md: 1 },
        bgcolor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 1, md: 2 },
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Mobile Filter Button */}
        <Fade in={true}>
          <Box
            onClick={() => setIsFilterOpen(true)}
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 0.5,
              position: 'fixed',
              top: { xs: 63, sm: 130 },
              left: { xs: 1, sm: 4 },
              cursor: 'pointer',
              bgcolor: '#07a966',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '2px 4px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                bgcolor: '#07a966',
                boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
              },
              zIndex: 1000,
            }}
          >
            <FaFilter size={8} />
            <Typography
              variant="caption"
              sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}
            >
              Filter
            </Typography>
          </Box>
        </Fade>

        {/* Filter Sidebar (Desktop) / Drawer (Mobile) */}
        <>
          <Drawer
            anchor="left"
            open={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                width: { xs: '80vw', sm: '20vw', md: '40vw' },
                maxWidth: '220px',
                bgcolor: '#fafafa',
                p: 2,
                transition: 'transform 0.3s ease-in-out',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: 'skyblue' }}
              >
                Filters By
              </Typography>
              <IconButton
                onClick={() => setIsFilterOpen(false)}
                aria-label="Close filters"
              >
                <FaTimes size={10} color="#333" />
              </IconButton>
            </Box>
            <FilterForm
              filters={filters}
              handleChange={handleFilterChange}
              handleApplyFilters={handleApplyFilters}
              handleResetFilters={handleResetFilters}
              filterOptions={filterOptions}
              productType="network"
            />
          </Drawer>

          <Paper
            sx={{
              width: { md: 240 },
              flexShrink: 0,
              display: { xs: 'none', md: 'block' },
              p: 3,
              bgcolor: '#fafafa',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: 'skyblue' }}
            >
              Filter By
            </Typography>
            <FilterForm
              filters={filters}
              handleChange={handleFilterChange}
              handleApplyFilters={handleApplyFilters}
              handleResetFilters={handleResetFilters}
              filterOptions={filterOptions}
              productType="network"
            />
          </Paper>
        </>

        {/* Networks Section */}
        <Box sx={{ flexGrow: 1 }}>
          {filterLoading || networksLoading ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant="body1" color="textSecondary">
                Loading...
              </Typography>
            </Box>
          ) : filterError || networksError ? (
            <Box sx={{ textAlign: 'center', py: 6, color: 'error.main' }}>
              <Typography variant="body1">
                Error: {filterError || networksError}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(auto-fill, minmax(150px, 1fr))',
                  sm: 'repeat(auto-fill, minmax(180px, 1fr))',
                  md: 'repeat(auto-fill, minmax(200px, 1fr))',
                  lg: 'repeat(auto-fill, minmax(220px, 1fr))',
                },
                gap: { xs: 1.5, sm: 2, md: 3, lg: 4 },
                mb: 4,
                p: 4,
              }}
            >
              {displayNetworks.length > 0 ? (
                displayNetworks.map((network) => (
                  <Box
                    key={network.id}
                    sx={{
                      transition:
                        'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <NetworkViewCard
                      id={network.id}
                      imagea={network.imagea}
                      category={network.catagory?.name || 'Uncategorized'}
                      name={network.name}
                      regularprice={network.regularprice}
                      specialprice={network.specialprice}
                    />
                  </Box>
                ))
              ) : (
                <Typography
                  sx={{
                    textAlign: 'center',
                    color: 'text.secondary',
                    gridColumn: '1 / -1',
                    py: 6,
                  }}
                >
                  No networks found
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default NetworkView;
