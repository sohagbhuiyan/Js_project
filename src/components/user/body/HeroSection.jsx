import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHeroImages } from '../../../store/heroSlice';
import { Box, CircularProgress, Alert, IconButton } from '@mui/material';

const FALLBACK_IMAGE = '/images/placeholder.png';

const HeroSection = () => {
  const dispatch = useDispatch();
  const { images, loading, error } = useSelector((state) => state.hero);
  const [currentSetIndex, setCurrentSetIndex] = useState(0); // Index for cycling through image sets
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // Index for sliding between imagea and imageb

  useEffect(() => {
    if (!images || images.length === 0) {
      dispatch(fetchHeroImages());
    }
  }, [dispatch, images]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev === 0 ? 1 : 0));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!images || images.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 4 }}>
        No images available.
      </Alert>
    );
  }

  const currentImageSet = images[currentSetIndex];
  const imagesArray = [currentImageSet.imagea, currentImageSet.imageb];

  return (
    <Box className="container mx-auto px-2 py-2">
      {/* Desktop View */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' }, // Show only on desktop (md and up)
          flexDirection: 'row',
          gap: 1,
          alignItems: 'stretch',
          height: { md: '412px' },
          position: 'relative',
        }}
      >
        {/* First Column: Sliding images (imagea and imageb) - 75% width */}
        <Box
          sx={{
            flex: 3,
            maxWidth: '75%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 1.5,
          }}
        >
          <div className="relative w-full h-full">
            <div
              className={`absolute w-full h-full transition-transform duration-1000 ease-in-out ${
                currentSlideIndex === 0 ? 'translate-x-0 z-10' : '-translate-x-full z-0'
              }`}
              style={{ zIndex: currentSlideIndex === 0 ? 10 : 0 }}
            >
              <img
                src={imagesArray[0] || FALLBACK_IMAGE}
                alt="Slider 1"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = FALLBACK_IMAGE;
                }}
                loading="lazy"
              />
            </div>
            <div
              className={`absolute w-full h-full transition-transform duration-1000 ease-in-out ${
                currentSlideIndex === 1 ? 'translate-x-0 z-10' : 'translate-x-full z-0'
              }`}
              style={{ zIndex: currentSlideIndex === 1 ? 10 : 0 }}
            >
              <img
                src={imagesArray[1] || FALLBACK_IMAGE}
                alt="Slider 2"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = FALLBACK_IMAGE;
                }}
                loading="lazy"
              />
            </div>

            {/* Circle navigation for slides */}
            <div className="absolute bottom-2 left-1/2 z-12 transform -translate-x-1/2 flex space-x-2">
              {imagesArray.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`w-10 h-1  rounded-full cursor-pointer transition-all duration-300 ease-in ${
                    currentSlideIndex === index ? 'bg-gray-500' : 'bg-white'
                  }`}
                />
              ))}
            </div>
          </div>
        </Box>

        {/* Second Column: Two rows with imagec and imaged - 25% width */}
        <Box
          sx={{
            flex: 1,
            maxWidth: '25%',
            display: 'flex',
            flexDirection: 'column',
      
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, position: 'relative' }}>
            <img
              src={currentImageSet.imagec || FALLBACK_IMAGE}
              alt="Hero Image C"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '5px',
              }}
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
              loading="lazy"
            />
          </Box>
          <Box sx={{ flex: 1, position: 'relative' }}>
            <img
              src={currentImageSet.imaged || FALLBACK_IMAGE}
              alt="Hero Image D"
              style={{
                width: '100%',
                height: '94%',
                objectFit: 'cover',
                borderRadius: '5px',
              }}
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
              loading="lazy"
            />
          </Box>
        </Box>
      </Box>

      {/* Mobile View */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' }, // Show only on mobile (xs)
          flexDirection: 'column',
          gap: 1,
          mt: 1,
          position: 'relative',
        }}
      >
        {/* First Row: Slider */}
        <Box sx={{ position: 'relative', height: '200px', overflow: 'hidden', borderRadius: 1 }}>
          <div
            className={`absolute w-full h-full transition-transform duration-1000 ease-in-out ${
              currentSlideIndex === 0 ? 'translate-x-0 z-10' : '-translate-x-full z-10'
            }`}
            style={{ zIndex: currentSlideIndex === 0 ? 10 : 0 }}
          >
            <img
              src={imagesArray[0] || FALLBACK_IMAGE}
              alt="Slider 1"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
              loading="lazy"
            />
          </div>
          <div
            className={`absolute w-full h-full transition-transform duration-1000 ease-in-out ${
              currentSlideIndex === 1 ? 'translate-x-0 z-10' : 'translate-x-full z-10'
            }`}
            style={{ zIndex: currentSlideIndex === 1 ? 10 : 0 }}
          >
            <img
              src={imagesArray[1] || FALLBACK_IMAGE}
              alt="Slider 2"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
              loading="lazy"
            />
          </div>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {imagesArray.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentSlideIndex(index)}
                className={`w-6 h-0.5 rounded-full cursor-pointer transition-all duration-300 ease-in ${
                  currentSlideIndex === index ? 'bg-gray-500' : 'bg-white'
                }`}
              />
            ))}
          </div>
        </Box>

        {/* Second Row: imagec and imaged in two columns */}
        <Box sx={{ display: 'flex', gap: 1, height: '100px' }}>
          <Box sx={{ flex: 1, position: 'relative' }}>
            <img
              src={currentImageSet.imagec || FALLBACK_IMAGE}
              alt="Hero Image C"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '5px',
              }}
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
              loading="lazy"
            />
          </Box>
          <Box sx={{ flex: 1, position: 'relative' }}>
            <img
              src={currentImageSet.imaged || FALLBACK_IMAGE}
              alt="Hero Image D"
              style={{
                width: '100%',
                height: '100%',
        
                borderRadius: '5px',
              }}
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
              loading="lazy"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
