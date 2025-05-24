import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";

const MobileMenu = ({ isOpen, onClose, menuItems }) => {
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(null);
  const [mobileProductSubmenuOpen, setMobileProductSubmenuOpen] = useState(null);

  const handleCloseMenu = () => {
    setMobileSubmenuOpen(null);
    setMobileProductSubmenuOpen(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50">
      <button
        onClick={handleCloseMenu}
        className="absolute top-4 right-4 text-xl cursor-pointer"
      >
        <FaTimes />
      </button>

      <h2 className="text-lg font-bold text-green-400 p-4">Menu</h2>

      <div className="flex flex-col space-y-2 px-3 overflow-y-auto pb-10 h-[calc(100vh-60px)]">
        {/* Home Menu Item */}
        <div className="py-2 text-sm border-b border-gray-700">
          <Link to="/" onClick={handleCloseMenu} className="block hover:text-gray-300">
            Home
          </Link>
        </div>

        {/* Category Items */}
        {menuItems.map((item, index) => (
          <div key={item.id} className="py-2 text-sm border-b border-gray-700">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => {
                setMobileSubmenuOpen(mobileSubmenuOpen === index ? null : index);
                setMobileProductSubmenuOpen(null);
              }}
            >
              <Link
                to={item.path}
                className="hover:text-gray-300"
                onClick={(e) => {
                  if (item.products?.length > 0) e.preventDefault();
                }}
              >
                {item.name}
              </Link>
              {item.products?.length > 0 && (
                <span className="ml-2">
                  {mobileSubmenuOpen === index ? "▲" : "▼"}
                </span>
              )}
            </div>

            {/* Product Submenu */}
            {item.products?.length > 0 && mobileSubmenuOpen === index && (
              <div className="ml-4 mt-2 bg-gray-800 p-2 rounded-md">
                {item.products.map((product, productIndex) => (
                  <div key={product.id} className="mb-1">
                    <div
                      className="flex justify-between items-center cursor-pointer px-2 py-1 hover:bg-gray-700 rounded"
                      onClick={() => {
                        setMobileProductSubmenuOpen(
                          mobileProductSubmenuOpen === productIndex ? null : productIndex
                        );
                      }}
                    >
                      <Link
                        to={product.path}
                        className="block w-full hover:text-gray-300"
                        onClick={(e) => {
                          if (product.items?.length > 0) e.preventDefault();
                        }}
                      >
                        {product.name}
                      </Link>
                      {product.items?.length > 0 && (
                        <span className="ml-2">
                          {mobileProductSubmenuOpen === productIndex ? "▲" : "▼"}
                        </span>
                      )}
                    </div>

                    {/* Product Item Submenu */}
                    {product.items?.length > 0 && mobileProductSubmenuOpen === productIndex && (
                      <div className="ml-4 mt-1 bg-gray-700 p-2 rounded">
                        {product.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className="block text-sm px-2 py-1 hover:bg-gray-600 rounded-md"
                            onClick={handleCloseMenu}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;