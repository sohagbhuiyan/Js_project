import { Link } from "react-router-dom";
import { FaAngleDoubleRight, FaChevronDown, FaHome } from "react-icons/fa";
import { useState } from "react";

const DesktopMenu = ({ menuItems }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [hoverProductIndex, setHoverProductIndex] = useState(null);
  const [showMoreItems, setShowMoreItems] = useState(false);
  const [hoverMoreItemIndex, setHoverMoreItemIndex] = useState(null);
  const [hoverMoreProductIndex, setHoverMoreProductIndex] = useState(null);

  const firstTenItems = menuItems.slice(0, 13);
  const remainingItems = menuItems.slice(13);
  const columnClass = remainingItems.length > 6 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className="hidden md:flex items-center justify-center space-x-4 px-4 py-3 font-medium text-sm text-white bg-[#CF212B] relative z-50">
      {/* Home Menu Item */}
      <div className="relative cursor-pointer group">
        <Link to="/" className="flex items-center hover:text-gray-300">
          <FaHome className="mr-1" /> Home
        </Link>
      </div>

      {/* Category Items (First 10) */}
      {firstTenItems.map((item, index) => (
        <div
          key={item.id}
          className="relative cursor-pointer group"
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => {
            setHoverIndex(null);
            setHoverProductIndex(null);
          }}
        >
          <Link to={item.path} className="hover:text-gray-300">
            {item.name}
          </Link>
          {item.products?.length > 0 && hoverIndex === index && (
            <div className="absolute top-full left-0 w-md bg-white text-black shadow-lg rounded-md border border-gray-200 z-50">
              {item.products.map((product, productIndex) => (
                <div
                  key={product.id}
                  className="relative group/sub"
                  onMouseEnter={() => setHoverProductIndex(productIndex)}
                  onMouseLeave={() => setHoverProductIndex(null)}
                >
                  <Link
                    to={product.path}
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    {product.name}
                  </Link>
                  {product.items?.length > 0 && hoverProductIndex === productIndex && (
                    <div className="block top-0 left-full w-md bg-white text-black shadow-lg rounded-md border border-gray-300 z-50">
                      {product.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className="block px-4 py-2 hover:bg-gray-300"
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

      {/* More Items Dropdown */}
      {remainingItems.length > 0 && (
        <div
          className="relative cursor-pointer group"
          onMouseEnter={() => setShowMoreItems(true)}
          onMouseLeave={() => {
            setShowMoreItems(false);
            setHoverMoreItemIndex(null);
            setHoverMoreProductIndex(null);
          }}
        >
          <div className="flex items-center hover:text-gray-300">
            More <FaAngleDoubleRight className="ml-1" />
          </div>
          {showMoreItems && (
            <div className="absolute top-full right-0 w-120 bg-white text-black shadow-lg rounded-md border border-gray-200 z-50">
              <div className={`grid ${columnClass} gap-4 p-4`}>
                {remainingItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setHoverMoreItemIndex(index)}
                    onMouseLeave={() => {
                      setHoverMoreItemIndex(null);
                      setHoverMoreProductIndex(null);
                    }}
                  >
                    <Link
                      to={item.path}
                      className="block px-2 py-2 hover:bg-gray-100 rounded"
                    >
                      {item.name}
                    </Link>
                    {item.products?.length > 0 && hoverMoreItemIndex === index && (
                      <div className="block top-0 left-full w-54 bg-white text-black shadow-lg rounded-md border border-gray-300 z-50">
                        {item.products.map((product, productIndex) => (
                          <div
                            key={product.id}
                            className="relative group/sub"
                            onMouseEnter={() => setHoverMoreProductIndex(productIndex)}
                            onMouseLeave={() => setHoverMoreProductIndex(null)}
                          >
                            <Link
                              to={product.path}
                              className="block px-4 py-2 hover:bg-gray-200"
                            >
                              {product.name}
                            </Link>
                            {product.items?.length > 0 && hoverMoreProductIndex === productIndex && (
                              <div className="block top-0 left-full w-54 bg-white text-black shadow-lg rounded-md border border-gray-300 z-50">
                                {product.items.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    to={subItem.path}
                                    className="block px-4 py-2 hover:bg-gray-200"
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
          )}
        </div>
      )}
    </div>
  );
};

export default DesktopMenu;