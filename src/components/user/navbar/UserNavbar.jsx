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
  const { categoriesWithSub, error } = useSelector((state) => state.categories);

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
    <div className="sticky top-0 z-[90] flex flex-col w-full">
      {/* TopBar - hide/show on scroll for desktop */}
      <div
        className={`bg-[#CF212B] text-white transition-all duration-300 ease-in-out
        ${showTopBarMenu ? 'opacity-100 max-h-[100px]' : 'opacity-0 max-h-0 overflow-hidden'}`}
      >
        <TopBar />
      </div>

      {/* Sticky Logo, SearchBar, NavIcons */}
      <div className="bg-[#CF212B] text-white shadow-md transition-all duration-300 z-50">
        <div className="flex items-center justify-between px-5 py-2 md:py-1 md:px-6 lg:px-12">
          {/* Hamburger for mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-xl"
          >
            {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
          </button>

          {/* Logo + Search + NavIcons */}
          <div className="flex flex-1 items-center justify-center gap-3 px-2 md:gap-15">
            <img
              src={logo}
              className="h-6 md:h-9.5 cursor-pointer"
              onClick={() => {
                window.location.href = '/';
                closeAllDropdowns();
              }}
              alt="Techno shop"
            />

            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

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
          className={`transition-all duration-300 ease-in-out
          ${showTopBarMenu ? 'opacity-100 max-h-[400px]' : 'opacity-0 max-h-0 overflow-hidden'}`}
        >
          <DesktopMenu menuItems={categoriesWithSub} />
        </div>
      </div>

      {/* Mobile Menu - always sticky and visible */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => {
          setMobileMenuOpen(false);
          closeAllDropdowns();
        }}
        menuItems={categoriesWithSub}
      />

      {/* Mobile Bottom Icons */}
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
  );
};

export default UserNavbar;
