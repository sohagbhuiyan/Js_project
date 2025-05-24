import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logo } from '../../../Utils/images';
import TopBar from './TopBar';
import NavIcons from './NavIcons';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import { FaBars, FaTimes } from 'react-icons/fa';
import { fetchCategoriesAndProducts } from '../../../store/categorySlice';

const UserNavbar = () => {
  const dispatch = useDispatch();
  const { categoriesWithSub, loading, error } = useSelector((state) => state.categories);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showTopBarMenu, setShowTopBarMenu] = useState(true);

  const lastScrollY = useRef(0);

  useEffect(() => {
    dispatch(fetchCategoriesAndProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching categories or products:', error);
    }
  }, [error]);

  // Scroll behavior for desktop: sticky logo/search/icons, delayed topbar & menu reappear
  useEffect(() => {
    const threshold = 100;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (window.innerWidth >= 768) {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollDown = currentScrollY > lastScrollY.current;
            const scrollUp = currentScrollY < lastScrollY.current;

            if (scrollDown && currentScrollY > 80) {
              setShowTopBarMenu(false);
            } else if (
              scrollUp &&
              lastScrollY.current - currentScrollY > threshold
            ) {
              setShowTopBarMenu(true);
            }

            if (currentScrollY <= 10) {
              setShowTopBarMenu(true);
            }

            lastScrollY.current = currentScrollY;
            ticking = false;
          });

          ticking = true;
        }
      } else {
        setShowTopBarMenu(true); // Always show on mobile
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const toggleCartDropdown = () => {
    setCartDropdownOpen(!cartDropdownOpen);
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
    setCartDropdownOpen(false);
  };

  return (
    <div className="sticky top-0 z-[99] flex flex-col w-full bg-[#CF212B]">
      {/* TopBar - hide/show on scroll for desktop */}
      <div
        className={`bg-[#CF212B] text-white transition-all duration-300 ease-in-out
        ${showTopBarMenu ? 'opacity-100 max-h-[100px]' : 'opacity-0 max-h-0 overflow-hidden'}`}
      >
        <TopBar />
      </div>

      {/* Sticky Logo, SearchBar, NavIcons */}
      <div className="bg-[#CF212B] text-white shadow-md transition-all duration-300 z-[100]">
        <div className="flex items-center justify-between px-4 py-2 md:py-2 md:px-6 lg:px-12">
          {/* Hamburger for mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-xl"
          >
            {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
          </button>

          {/* Logo + Search + NavIcons */}
          <div className="flex flex-1 items-center justify-between md:justify-center gap-3 md:gap-12 lg:gap-16">
            <img
              src={logo}
              className="h-6 md:h-8 lg:h-10 cursor-pointer"
              onClick={() => {
                window.location.href = '/';
                closeAllDropdowns();
              }}
              alt="Techno shop"
            />

            <div className="flex-1 max-w-md mx-2 md:mx-4">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>

            <NavIcons
              variant="desktop"
              activeDropdown={activeDropdown}
              toggleDropdown={toggleDropdown}
              cartDropdownOpen={cartDropdownOpen}
              toggleCartDropdown={toggleCartDropdown}
              cartCount={cartCount}
              closeAllDropdowns={closeAllDropdowns}
            />
          </div>
        </div>

        {/* DesktopMenu - hide/show on scroll */}
        <div
          className={`transition-all duration-300 ease-in-out bg-[#CF212B]
          ${showTopBarMenu ? 'opacity-100 max-h-[400px]' : 'opacity-0 max-h-0 overflow-hidden'}`}
        >
          {loading ? (
            <div className="text-center text-white py-2">Loading...</div>
          ) : error ? (
            <div className="text-center text-yellow-300 py-2">Error: {error}</div>
          ) : (
            <DesktopMenu menuItems={categoriesWithSub} />
          )}
        </div>
      </div>

      {/* Mobile Menu - slide-in from left */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => {
          setMobileMenuOpen(false);
          closeAllDropdowns();
        }}
        menuItems={categoriesWithSub}
      />

      {/* Mobile Bottom Icons */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#CF212B] text-white shadow-md z-[100]">
        <NavIcons
          variant="mobile"
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
          cartDropdownOpen={cartDropdownOpen}
          toggleCartDropdown={toggleCartDropdown}
          cartCount={cartCount}
          closeAllDropdowns={closeAllDropdowns}
        />
      </div>
    </div>
  );
};

export default UserNavbar;