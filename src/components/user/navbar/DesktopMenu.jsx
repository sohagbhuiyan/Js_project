// import { Link } from "react-router-dom";
// import { FaAngleDoubleRight, FaChevronDown, FaHome } from "react-icons/fa";
// import { useState } from "react";

// const DesktopMenu = ({ menuItems }) => {
//   const [hoverIndex, setHoverIndex] = useState(null);
//   const [hoverProductIndex, setHoverProductIndex] = useState(null);
//   const [showMoreItems, setShowMoreItems] = useState(false);
//   const [hoverMoreItemIndex, setHoverMoreItemIndex] = useState(null);
//   const [hoverMoreProductIndex, setHoverMoreProductIndex] = useState(null);

//   const firstTenItems = menuItems.slice(0, 13);
//   const remainingItems = menuItems.slice(13);
//   const columnClass = remainingItems.length > 6 ? "grid-cols-3" : "grid-cols-2";

//   return (
//     <div className="hidden md:flex items-center justify-center space-x-4 px-4 py-2 font-medium text-sm text-white bg-[#CF212B] relative z-40">
//       {/* Home Menu Item */}
//       <div className="relative cursor-pointer group">
//         <Link to="/" className="flex items-center hover:text-gray-300">
//           <FaHome className="mr-1" />
//         </Link>
//       </div>

//       {/* Category Items (First 10) */}
//       {firstTenItems.map((item, index) => (
//         <div
//           key={item.id}
//           className="relative cursor-pointer group"
//           onMouseEnter={() => setHoverIndex(index)}
//           onMouseLeave={() => {
//             setHoverIndex(null);
//             setHoverProductIndex(null);
//           }}
//         >
//           <Link to={item.path} className="hover:text-gray-300">
//             {item.name}
//           </Link>
//           {item.products?.length > 0 && hoverIndex === index && (
//             <div className="absolute top-full left-0 w-md bg-white text-black shadow-lg rounded-md border border-gray-200 z-50">
//               {item.products.map((product, productIndex) => (
//                 <div
//                   key={product.id}
//                   className="relative group/sub"
//                   onMouseEnter={() => setHoverProductIndex(productIndex)}
//                   onMouseLeave={() => setHoverProductIndex(null)}
//                 >
//                   <Link
//                     to={product.path}
//                     className="block px-4 py-2 hover:bg-gray-200"
//                   >
//                     {product.name}
//                   </Link>
//                   {product.items?.length > 0 && hoverProductIndex === productIndex && (
//                     <div className="block top-0 left-full w-md bg-white text-black shadow-lg rounded-md border border-gray-300 z-50">
//                       {product.items.map((subItem) => (
//                         <Link
//                           key={subItem.name}
//                           to={subItem.path}
//                           className="block px-4 py-2 hover:bg-gray-300"
//                         >
//                           {subItem.name}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}

//       {/* More Items Dropdown */}
//       {remainingItems.length > 0 && (
//         <div
//           className="relative cursor-pointer group"
//           onMouseEnter={() => setShowMoreItems(true)}
//           onMouseLeave={() => {
//             setShowMoreItems(false);
//             setHoverMoreItemIndex(null);
//             setHoverMoreProductIndex(null);
//           }}
//         >
//           <div className="flex items-center hover:text-gray-300">
//             More <FaAngleDoubleRight className="ml-1" />
//           </div>
//           {showMoreItems && (
//             <div className="absolute top-full right-0 w-120 bg-white text-black shadow-lg rounded-md border border-gray-200 z-50">
//               <div className={`grid ${columnClass} gap-4 p-4`}>
//                 {remainingItems.map((item, index) => (
//                   <div
//                     key={item.id}
//                     className="relative"
//                     onMouseEnter={() => setHoverMoreItemIndex(index)}
//                     onMouseLeave={() => {
//                       setHoverMoreItemIndex(null);
//                       setHoverMoreProductIndex(null);
//                     }}
//                   >
//                     <Link
//                       to={item.path}
//                       className="block px-2 py-2 hover:bg-gray-100 rounded"
//                     >
//                       {item.name}
//                     </Link>
//                     {item.products?.length > 0 && hoverMoreItemIndex === index && (
//                       <div className="block top-0 left-full w-54 bg-white text-black shadow-lg rounded-md border border-gray-300 z-50">
//                         {item.products.map((product, productIndex) => (
//                           <div
//                             key={product.id}
//                             className="relative group/sub"
//                             onMouseEnter={() => setHoverMoreProductIndex(productIndex)}
//                             onMouseLeave={() => setHoverMoreProductIndex(null)}
//                           >
//                             <Link
//                               to={product.path}
//                               className="block px-4 py-2 hover:bg-gray-200"
//                             >
//                               {product.name}
//                             </Link>
//                             {product.items?.length > 0 && hoverMoreProductIndex === productIndex && (
//                               <div className="block top-0 left-full w-54 bg-white text-black shadow-lg rounded-md border border-gray-300 z-50">
//                                 {product.items.map((subItem) => (
//                                   <Link
//                                     key={subItem.name}
//                                     to={subItem.path}
//                                     className="block px-4 py-2 hover:bg-gray-200"
//                                   >
//                                     {subItem.name}
//                                   </Link>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DesktopMenu;
import { Link } from "react-router-dom";
import { FaAngleDoubleRight, FaHome } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

const DesktopMenu = ({ menuItems }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [hoverProductIndex, setHoverProductIndex] = useState(null);
  const [showMoreItems, setShowMoreItems] = useState(false);
  const [hoverMoreItemIndex, setHoverMoreItemIndex] = useState(null);
  const [hoverMoreProductIndex, setHoverMoreProductIndex] = useState(null);
  const megamenuRefs = useRef([]);

  const firstTwelveItems = menuItems.slice(0, 12); // Changed from 13 to 12
  const remainingItems = menuItems.slice(12); // Remaining items go to "More" dropdown
  const columnClass = remainingItems.length > 6 ? "grid-cols-3" : "grid-cols-2";

  // Function to adjust megamenu position to stay within viewport
  const adjustMegamenuPosition = (element) => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    if (rect.bottom > viewportHeight) {
      element.style.top = `-${rect.height - 20}px`; // Move up to fit within viewport
    } else {
      element.style.top = "0"; // Reset to default
    }
  };

  // Adjust megamenu position when opened
  useEffect(() => {
    megamenuRefs.current.forEach((ref, index) => {
      if ((hoverProductIndex === index || hoverMoreProductIndex === index) && ref) {
        adjustMegamenuPosition(ref);
      }
    });
  }, [hoverProductIndex, hoverMoreProductIndex]);

  return (
    <div className="hidden md:flex items-center justify-center space-x-2 px-6 py-0 font-medium text-sm text-white bg-[#CF212B] relative z-20">
      {/* Home Menu Item */}
      <div className="relative cursor-pointer group">
        <Link
          to="/"
          className="flex items-center "
        >
          <FaHome className="mr-1" />
         
        </Link>
      </div>

      {/* Category Items (First 12) */}
      {firstTwelveItems.map((item, index) => (
        <div
          key={item.id}
          className="relative cursor-pointer group"
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => {
            setHoverIndex(null);
            setHoverProductIndex(null);
          }}
        >
          <Link
            to={item.path}
            className="px-3 py-1 rounded-md transition-colors duration-200 hover:text-[#c5c5c5]"
          >
            {item.name}
          </Link>
          {item.products?.length > 0 && hoverIndex === index && (
            <div className="absolute top-full left-0 w-64 bg-white text-black shadow-lg rounded-md border border-gray-200 z-50 animate-fadeIn">
              {item.products.map((product, productIndex) => (
                <div
                  key={product.id}
                  className="relative group/sub"
                  onMouseEnter={() => setHoverProductIndex(productIndex)}
                  onMouseLeave={() => setHoverProductIndex(null)}
                >
                  <Link
                    to={product.path}
                    className="block px-4 py-2 hover:bg-gray-100 rounded transition-colors duration-150"
                  >
                    {product.name}
                  </Link>
                  {product.items?.length > 0 && hoverProductIndex === productIndex && (
                    <div
                      ref={(el) => (megamenuRefs.current[productIndex] = el)}
                      className="absolute top-0 left-full w-64 bg-white text-black shadow-lg rounded-md border border-gray-300 z-50 animate-fadeIn"
                    >
                      {product.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className="block px-4 py-2 hover:bg-gray-100 rounded transition-colors duration-150"
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
          <div className="flex items-center px-3 py-2 rounded-md transition-colors duration-200 hover:bg-white hover:text-[#CF212B]">
            More <FaAngleDoubleRight className="ml-1" />
          </div>
          {showMoreItems && (
            <div className="absolute top-full right-0 w-96 bg-white text-black shadow-lg rounded-md border border-gray-200 z-50 animate-fadeIn">
              <div className={`grid ${columnClass} gap-4 p-2`}>
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
                      className="block px-3 py-2 hover:bg-gray-100 rounded transition-colors duration-150"
                    >
                      {item.name}
                    </Link>
                    {item.products?.length > 0 && hoverMoreItemIndex === index && (
                      <div className="block top-0 left-full w-44 bg-white text-black shadow-lg rounded-md border border-gray-300 z-50 animate-fadeIn">
                        {item.products.map((product, productIndex) => (
                          <div
                            key={product.id}
                            className="relative group/sub"
                            onMouseEnter={() => setHoverMoreProductIndex(productIndex)}
                            onMouseLeave={() => setHoverMoreProductIndex(null)}
                          >
                            <Link
                              to={product.path}
                              className="block px-4 py-2 hover:bg-gray-100 rounded transition-colors duration-150"
                            >
                              {product.name}
                            </Link>
                            {product.items?.length > 0 && hoverMoreProductIndex === productIndex && (
                              <div
                                ref={(el) => (megamenuRefs.current[productIndex] = el)}
                                className="block top-0 left-full w-44 bg-white text-black shadow-lg rounded-md border border-gray-300 z-50 animate-fadeIn"
                              >
                                {product.items.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    to={subItem.path}
                                    className="block px-4 py-2 hover:bg-gray-100 rounded transition-colors duration-150"
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