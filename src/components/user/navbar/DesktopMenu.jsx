import { Link } from "react-router-dom";
import { FaAngleDoubleRight, FaChevronDown, FaHome } from "react-icons/fa";
import { useState } from "react";

const DesktopMenu = ({ menuItems }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showMoreItems, setShowMoreItems] = useState(false);
  const [hoverMoreItemIndex, setHoverMoreItemIndex] = useState(null);

  const firstTenItems = menuItems.slice(0, 12);
  const remainingItems = menuItems.slice(10);

  const columnClass = remainingItems.length > 6 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className="hidden md:flex items-center justify-center space-x-2 px-2 py-3 font-medium text-sm md:space-x-6 md:px-4 relative z-40">
      
      {/* HOME MENU ITEM */}
      <div className="relative cursor-pointer group">
        <Link to="/" className="flex items-center hover:text-gray-300">
          <FaHome className="mr-1" />
        </Link>
      </div>

      {/* CATEGORY ITEMS (FIRST 10) */}
      {firstTenItems.map((item, index) => (
        <div
          key={index}
          className="relative cursor-pointer group"
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <Link to={item.path || "#"} className="hover:text-gray-300">
            {item.name}
          </Link>

          {item.subMenu?.length > 0 && hoverIndex === index && (
            <div className="absolute top-full left-0 mt-0 w-64 bg-white text-black shadow-lg rounded-md border border-gray-300 z-40">
              {item.subMenu
                .filter((subItem) => subItem.name && subItem.path)
                .map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    to={subItem.path}
                    className="block px-4 py-2 rounded-md hover:bg-gray-200"
                  >
                    {subItem.name}
                  </Link>
                ))}
            </div>
          )}
        </div>
      ))}

      {/* MORE ITEMS DROPDOWN */}
      {remainingItems.length > 0 && (
        <div
          className="relative cursor-pointer group"
          onMouseEnter={() => setShowMoreItems(true)}
          onMouseLeave={() => {
            setShowMoreItems(false);
            setHoverMoreItemIndex(null);
          }}
        >
          <div className="flex items-center hover:text-gray-300">
            More Items <FaAngleDoubleRight className="ml-1" />
          </div>

          {showMoreItems && (
            <div className="absolute top-full right-0 mt-0 w-2xl bg-white text-black shadow-lg rounded-md border border-gray-200 z-40">
              <div className={`grid ${columnClass} gap-2 p-2`}>
                {remainingItems.map((item, index) => (
                  <div
                    key={index}
                    className="relative"
                    onMouseEnter={() => setHoverMoreItemIndex(index)}
                    onMouseLeave={() => setHoverMoreItemIndex(null)}
                  >
                    <Link
                      to={item.path || "#"}
                      className="flex justify-between items-center px-2 py-2 rounded-md hover:bg-gray-100"
                    >
                      <span>{item.name}</span>
                      {item.subMenu?.length > 0 && (
                        <FaChevronDown className="text-xs ml-1" />
                      )}
                    </Link>

                    {item.subMenu?.length > 0 && hoverMoreItemIndex === index && (
                      <div className="block top-0 left-full ml-0 w-50 bg-white text-black shadow-lg rounded-md border border-gray-300 z-40">
                        {item.subMenu
                          .filter((subItem) => subItem.name && subItem.path)
                          .map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              to={`/collections?search=${encodeURIComponent(subItem.name)}`}
                              className="block px-4 py-2 rounded-md hover:bg-gray-200 whitespace-nowrap"
                            >
                              {subItem.name}
                            </Link>
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
