import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";

const MobileMenu = ({ isOpen, onClose, menuItems }) => {
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(null);
  const [nestedSubmenuOpen, setNestedSubmenuOpen] = useState(null);

  const handleCloseMenu = () => {
    setMobileSubmenuOpen(null);
    setNestedSubmenuOpen(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed top-0 left-0 h-full w-54 bg-gray-900 text-white z-50">
      <button
        onClick={handleCloseMenu}
        className="absolute top-4 right-4 text-xl cursor-pointer"
      >
        <FaTimes />
      </button>

      <h2 className="text-sm font-bold text-green-400 p-4">Menu</h2>

      <div className="flex flex-col space-y-2 px-3 overflow-y-auto pb-10 h-[calc(100vh-60px)]">
        {menuItems.map((item, index) => (
          <div key={index} className="py-2 text-xs border-b border-gray-700">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => {
                if (item.subMenu && item.subMenu.length > 0) {
                  setMobileSubmenuOpen(mobileSubmenuOpen === index ? null : index);
                }
              }}
            >
              <Link to={item.path || "#"} className="hover:text-gray-300">
                {item.name}
              </Link>

              {/* ✅ Show dropdown arrow only if subMenu exists and has items */}
              {item.subMenu && item.subMenu.length > 0 && (
                <span className="ml-2">
                  {mobileSubmenuOpen === index ? "▲" : "▼"}
                </span>
              )}
            </div>

            {/* First-level submenu */}
            {item.subMenu && item.subMenu.length > 0 && mobileSubmenuOpen === index && (
              <div className="ml-1 mt-2 bg-gray-800 p-1 rounded-md">
                {item.subMenu.map((subItem, subIndex) => (
                  <div key={subIndex} className="mb-1">
                    <div
                      className="flex justify-between items-center cursor-pointer px-1 py-1 hover:bg-gray-700 rounded"
                      onClick={() => {
                        if (subItem.subMenu && subItem.subMenu.length > 0) {
                          setNestedSubmenuOpen(
                            nestedSubmenuOpen === subIndex ? null : subIndex
                          );
                        }
                      }}
                    >
                      {subItem.path ? (
                        <Link to={subItem.path} className="block w-full">
                          {subItem.name}
                        </Link>
                      ) : (
                        <span>{subItem.name}</span>
                      )}

                      {/* ✅ Show nested dropdown arrow only if nested submenu exists */}
                      {subItem.subMenu && subItem.subMenu.length > 0 && (
                        <span className="ml-1">
                          {nestedSubmenuOpen === subIndex ? "▲" : "▼"}
                        </span>
                      )}
                    </div>

                    {/* Nested submenu (second level) */}
                    {subItem.subMenu && subItem.subMenu.length > 0 && nestedSubmenuOpen === subIndex && (
                      <div className="ml-1 mt-1 bg-gray-700 p-1 rounded">
                        {subItem.subMenu.map((nestedItem, nestedIndex) => (
                          <Link
                            key={nestedIndex}
                            to={nestedItem.path}
                            className="block text-white text-xs p-1 hover:bg-gray-600 rounded-md"
                          >
                            {nestedItem.name}
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
