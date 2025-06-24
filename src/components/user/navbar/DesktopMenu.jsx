
// import { Link } from "react-router-dom";
// import { FaAngleDoubleRight, FaHome } from "react-icons/fa";
// import { useState, useRef, useEffect } from "react";

// const DesktopMenu = ({ menuItems }) => {
//   const [hoverIndex, setHoverIndex] = useState(null);
//   const [hoverProductIndex, setHoverProductIndex] = useState(null);
//   const [showMoreItems, setShowMoreItems] = useState(false);
//   const [hoverMoreItemIndex, setHoverMoreItemIndex] = useState(null);
//   const [hoverMoreProductIndex, setHoverMoreProductIndex] = useState(null);
//   const megamenuRefs = useRef([]);

//   const firstTwelveItems = menuItems.slice(0, 11); 
//   const remainingItems = menuItems.slice(11); // Remaining items go to "More" dropdown
//   const columnClass = remainingItems.length > 6 ? "grid-cols-3" : "grid-cols-2";

//   // Function to adjust megamenu position to stay within viewport
//   const adjustMegamenuPosition = (element) => {
//     if (!element) return;
//     const rect = element.getBoundingClientRect();
//     const viewportHeight = window.innerHeight;
//     if (rect.bottom > viewportHeight) {
//       element.style.top = `-${rect.height - 20}px`; // Move up to fit within viewport
//     } else {
//       element.style.top = "0"; // Reset to default
//     }
//   };

//   // Adjust megamenu position when opened
//   useEffect(() => {
//     megamenuRefs.current.forEach((ref, index) => {
//       if ((hoverProductIndex === index || hoverMoreProductIndex === index) && ref) {
//         adjustMegamenuPosition(ref);
//       }
//     });
//   }, [hoverProductIndex, hoverMoreProductIndex]);

//   return (
//     <div className="hidden md:flex items-center justify-center space-x-3 px-6 py-0 font-medium text-sm text-white bg-[#CF212B] relative z-20">
//       {/* Home Menu Item */}
//       <div className="relative cursor-pointer group">
//         <Link
//           to="/"
//           className="flex items-center "
//         >
//           <FaHome className="mr-1" />
         
//         </Link>
//       </div>

//       {/* Category Items (First 12) */}
//       {firstTwelveItems.map((item, index) => (
//         <div
//           key={item.id}
//           className="relative cursor-pointer group"
//           onMouseEnter={() => setHoverIndex(index)}
//           onMouseLeave={() => {
//             setHoverIndex(null);
//             setHoverProductIndex(null);
//           }}
//         >
//           <Link
//             to={item.path}
//             className="px-3 py-1 rounded-md transition-colors duration-200 hover:text-[#c5c5c5]"
//           >
//             {item.name}
//           </Link>
//           {item.products?.length > 0 && hoverIndex === index && (
//             <div className="absolute top-full left-0 w-72 bg-gray-300 text-black shadow-lg rounded-md border border-gray-200 z-50 animate-fadeIn">
//               {item.products.map((product, productIndex) => (
//                 <div
//                   key={product.id}
//                   className="relative group/sub"
//                   onMouseEnter={() => setHoverProductIndex(productIndex)}
//                   onMouseLeave={() => setHoverProductIndex(null)}
//                 >
//                   <Link
//                     to={product.path}
//                     className="block px-4 py-2 hover:bg-gray-200 rounded transition-colors duration-150"
//                   >
//                     {product.name}
//                   </Link>
//                   {product.items?.length > 0 && hoverProductIndex === productIndex && (
//                     <div
//                       ref={(el) => (megamenuRefs.current[productIndex] = el)}
//                       className="absolute top-0 left-full w-64 bg-gray-300 text-black shadow-lg rounded-md border border-gray-500 z-50 animate-fadeIn"
//                     >
//                       {product.items.map((subItem) => (
//                         <Link
//                           key={subItem.name}
//                           to={subItem.path}
//                           className="block px-4 py-2 hover:bg-gray-200 rounded transition-colors duration-150"
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
//           <div className="flex items-center px-3 py-2 rounded-md transition-colors duration-200">
//             More Items<FaAngleDoubleRight className="ml-1" />
//           </div>
//           {showMoreItems && (
//             <div className="absolute top-full right-0 w-96 bg-gray-300 text-black shadow-lg rounded-md border border-gray-500 z-50 animate-fadeIn">
//               <div className={`grid ${columnClass} gap-4 p-2`}>
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
//                       className="block px-3 py-2 hover:bg-gray-200 border-gray-500 border rounded transition-colors duration-150"
//                     >
//                       {item.name}
//                     </Link>
//                     {item.products?.length > 0 && hoverMoreItemIndex === index && (
//                       <div className="block top-0 left-full w-44 bg-gray-300 text-black shadow-lg border-gray-500 border rounded-md z-50 animate-fadeIn">
//                         {item.products.map((product, productIndex) => (
//                           <div
//                             key={product.id}
//                             className="relative group/sub"
//                             onMouseEnter={() => setHoverMoreProductIndex(productIndex)}
//                             onMouseLeave={() => setHoverMoreProductIndex(null)}
//                           >
//                             <Link
//                               to={product.path}
//                               className="block px-4 py-2 hover:bg-gray-200 rounded transition-colors duration-150"
//                             >
//                               {product.name}
//                             </Link>
//                             {product.items?.length > 0 && hoverMoreProductIndex === productIndex && (
//                               <div
//                                 ref={(el) => (megamenuRefs.current[productIndex] = el)}
//                                 className="block top-0 left-full w-44 bg-gray-300 text-black shadow-lg rounded-md border border-gray-500 z-50 animate-fadeIn"
//                               >
//                                 {product.items.map((subItem) => (
//                                   <Link
//                                     key={subItem.name}
//                                     to={subItem.path}
//                                     className="block px-4 py-2 hover:bg-gray-200 rounded transition-colors duration-150"
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


// import { Link } from "react-router-dom";
// import { FaAngleDoubleRight, FaHome } from "react-icons/fa";
// import { useState, useRef, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// // import { fetchPublishedProducts } from "./store/productSlice";

// const DesktopMenu = ({ menuItems }) => {
//   const dispatch = useDispatch();
//   const { products, loading } = useSelector((state) => state.products);
//   const [hoverIndex, setHoverIndex] = useState(null);
//   const [hoverProductIndex, setHoverProductIndex] = useState(null);
//   const [showMoreItems, setShowMoreItems] = useState(false);
//   const [hoverMoreItemIndex, setHoverMoreItemIndex] = useState(null);
//   const [hoverMoreProductIndex, setHoverMoreProductIndex] = useState(null);
//   const [showLaptopSubMenu, setShowLaptopSubMenu] = useState(false);
//   const [hoverAccessoryIndex, setHoverAccessoryIndex] = useState(null); // For Accessories sub-items
//   const megamenuRefs = useRef([]);

//   // Fetch published products on mount
//   // useEffect(() => {
//   //   dispatch(fetchPublishedProducts());
//   // }, [dispatch]);

//   // Filter menuItems to include only published products
//   const filteredMenuItems = menuItems.map(item => ({
//     ...item,
//     products: item.products?.filter(product => 
//       products.some(p => p.id === product.id && p.isPublished)
//     ) || []
//   }));

//   const firstSixItems = filteredMenuItems.slice(0, 7); // Reduced to 6 for space
//   const remainingItems = filteredMenuItems.slice(6);
//   const columnClass = remainingItems.length > 4 ? "grid-cols-3" : "grid-cols-2";

//   // Laptop submenu with Accessories
//   const laptopSubMenuItems = [
//     { name: "Acer", path: "/laptops/acer" },
//     { name: "Dell", path: "/laptops/dell" },
//     { name: "ASUS", path: "/laptops/asus" },
//     { name: "HP", path: "/laptops/hp" },
//     { name: "Lenovo", path: "/laptops/lenovo" },
//     { name: "Toshiba", path: "/laptops/toshiba" },
//     { name: "MSI", path: "/laptops/msi" },
//     { name: "Apple", path: "/laptops/apple" },
//     { name: "Infinix", path: "/laptops/infinix" },
//     { name: "Microsoft", path: "/laptops/microsoft" },
//     { name: "Gigabyte", path: "/laptops/gigabyte" },
//     {
//       name: "Accessories",
//       path: "/laptops/accessories",
//       items: [
//         { name: "Bag", path: "/laptops/accessories/bag" },
//         { name: "RAM", path: "/laptops/accessories/ram" },
//         { name: "Mouse", path: "/laptops/accessories/mouse" },
//         { name: "Keyboard", path: "/laptops/accessories/keyboard" },
//         { name: "Cooling Pad", path: "/laptops/accessories/cooling-pad" },
//         { name: "Charger", path: "/laptops/accessories/charger" },
//       ],
//     },
//   ];

//   const adjustMegamenuPosition = (element) => {
//     if (!element) return;
//     const rect = element.getBoundingClientRect();
//     const viewportHeight = window.innerHeight;
//     if (rect.bottom > viewportHeight) {
//       element.style.top = `-${rect.height - 5}px`; // Reduced offset
//     } else {
//       element.style.top = "0";
//     }
//   };

//   useEffect(() => {
//     megamenuRefs.current.forEach((ref, index) => {
//       if ((hoverProductIndex === index || hoverMoreProductIndex === index || hoverAccessoryIndex === index) && ref) {
//         adjustMegamenuPosition(ref);
//       }
//     });
//   }, [hoverProductIndex, hoverMoreProductIndex, hoverAccessoryIndex]);

//   return (
//     <div className="hidden md:flex justify-center space-x-2 px-4 py-1 text-sm font-semibold text-white bg-[#CF212B] relative z-10">
//       {/* Home Menu Item */}
//       <div className="relative cursor-pointer group">
//         <Link to="/" className="flex items-center px-2 py-0.5 rounded-md hover:text-gray-200">
//           <FaHome className="mr-0.5" />
//         </Link>
//       </div>

//       {/* Laptop Menu Item with Submenu */}
//       <div
//         className="relative cursor-pointer group"
//         onMouseEnter={() => setShowLaptopSubMenu(true)}
//         onMouseLeave={() => {
//           setShowLaptopSubMenu(false);
//           setHoverAccessoryIndex(null);
//         }}
//       >
//         <Link
//           to="/laptops"
//           className="px-2 py-0.5 rounded-md transition-colors duration-200 hover:text-gray-200"
//         >
//           Laptop
//         </Link>
//         {showLaptopSubMenu && (
//           <div
//             className="absolute left-0 right-0 bg-gray-300 text-black rounded-b-md z-50 border-t border-gray-200 shadow-lg"
//             style={{ top: '100%', width: '120vw', maxWidth: '1200px', margin: '0 auto' }}
//           >
//             <div className="grid grid-cols-5 gap-2 px-6 py-3">
//               {laptopSubMenuItems.map((item, index) => (
//                 <div
//                   key={item.name}
//                   className="relative group/sub"
//                   onMouseEnter={() => item.items && setHoverAccessoryIndex(index)}
//                   onMouseLeave={() => item.items && setHoverAccessoryIndex(null)}
//                 >
//                   <Link
//                     to={item.path}
//                     className="block px-2 py-1 text-xs font-medium hover:bg-gray-100 rounded transition-colors duration-150"
//                   >
//                     {item.name}
//                   </Link>
//                   {item.items?.length > 0 && hoverAccessoryIndex === index && (
//                     <div
//                       ref={(el) => (megamenuRefs.current[index] = el)}
//                       className="absolute top-0 left-full w-64 bg-gray-200 shadow-lg rounded-lg border border-gray-200 z-100"
//                     >
//                       {item.items.map((subItem) => (
//                         <Link
//                           key={subItem.name}
//                           to={subItem.path}
//                           className="block px-2 py-1 text-xs font-medium text-black hover:bg-gray-100 rounded transition-colors duration-150"
//                         >
//                           {subItem.name}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Static Menu Items */}
//       {["Desktop", "Printer", "Camera", "Network"].map((name) => (
//         <div key={name} className="relative cursor-pointer group">
//           <Link
//             to={`/${name.toLowerCase()}`}
//             className="px-2 py-0.5 rounded-md transition-colors duration-200 hover:text-gray-400"
//           >
//             {name}
//           </Link>
//         </div>
//       ))}

//       {/* Category Items (First 6) */}
//       {firstSixItems.map((item, index) => (
//         <div
//           key={item.id}
//           className="relative cursor-pointer group"
//           onMouseEnter={() => setHoverIndex(index)}
//           onMouseLeave={() => {
//             setHoverIndex(null);
//             setHoverProductIndex(null);
//           }}
//         >
//           <Link
//             to={item.path}
//             className="px-2 py-0.5 rounded-md transition-colors duration-200 hover:text-gray-200"
//           >
//             {item.name}
//           </Link>
//           {item.products?.length > 0 && hoverIndex === index && (
//             <div className="absolute left-0 w-screen bg-white text-black shadow-lg rounded-md border-t border-gray-200 z-50">
//               <div className="grid grid-cols-2 gap-2 px-4 py-2 max-w-[800px] mx-auto">
//                 {item.products.map((product, productIndex) => (
//                   <div
//                     key={product.id}
//                     className="relative group/sub"
//                     onMouseEnter={() => setHoverProductIndex(productIndex)}
//                     onMouseLeave={() => setHoverProductIndex(null)}
//                   >
//                     <Link
//                       to={product.path}
//                       className="block px-2 py-1 text-xs font-medium hover:bg-gray-100 rounded transition-colors duration-150"
//                     >
//                       {product.name}
//                     </Link>
//                     {product.items?.length > 0 && hoverProductIndex === productIndex && (
//                       <div
//                         ref={(el) => (megamenuRefs.current[productIndex] = el)}
//                         className="absolute top-0 left-full w-64 bg-white text-black shadow-lg rounded border border-gray-200 z-200"
//                       >
//                         {product.items.map((subItem) => (
//                           <Link
//                             key={subItem.name}
//                             to={subItem.path}
//                             className="block px-2 py-1 text-xs font-medium hover:bg-gray-100 rounded transition-colors duration-150"
//                           >
//                             {subItem.name}
//                           </Link>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
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
//           <div className="flex items-center px-2 py-0.5 rounded-md transition-colors duration-200">
//             More
//             <FaAngleDoubleRight className="ml-0.5" />
//           </div>
//           {showMoreItems && (
//             <div className="absolute top-full right-0 w-80 bg-white text-black shadow-lg rounded-md border border-gray-200 z-50">
//               <div className={`grid ${columnClass} gap-2 p-2`}>
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
//                       className="block px-2 py-1 text-xs font-medium hover:bg-gray-100 rounded transition-colors duration-150"
//                     >
//                       {item.name}
//                     </Link>
//                     {item.products?.length > 0 && hoverMoreItemIndex === index && (
//                       <div className="absolute top-0 left-full w-48 bg-white text-black shadow-lg rounded border-gray-200 border z-100">
//                         {item.products.map((product, productIndex) => (
//                           <div
//                             key={product.id}
//                             className="relative group/sub"
//                             onMouseEnter={() => setHoverMoreProductIndex(productIndex)}
//                             onMouseLeave={() => setHoverMoreProductIndex(null)}
//                           >
//                             <Link
//                               to={product.path}
//                               className="block px-2 py-1 text-xs font-medium hover:bg-gray-100 rounded transition-colors duration-150"
//                             >
//                               {product.name}
//                             </Link>
//                             {product.items?.length > 0 && hoverMoreProductIndex === productIndex && (
//                               <div
//                                 ref={(el) => (megamenuRefs.current[productIndex] = el)}
//                                 className="absolute top-0 left-full w-48 bg-white text-black shadow-lg rounded border border-gray-200 z-200"
//                               >
//                                 {product.items.map((subItem) => (
//                                   <Link
//                                     key={subItem.name}
//                                     to={subItem.path}
//                                     className="block px-2 py-1 text-xs font-medium hover:bg-gray-100 rounded transition-colors duration-150"
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
import { useDispatch, useSelector } from "react-redux";
// import { fetchPublishedProducts } from "./store/productSlice";

const DesktopMenu = ({ menuItems }) => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [hoverProductIndex, setHoverProductIndex] = useState(null);
  const [showMoreItems, setShowMoreItems] = useState(false);
  const [hoverMoreItemIndex, setHoverMoreItemIndex] = useState(null);
  const [hoverMoreProductIndex, setHoverMoreProductIndex] = useState(null);
  const [showLaptopSubMenu, setShowLaptopSubMenu] = useState(false);
  const [hoverAccessoryIndex, setHoverAccessoryIndex] = useState(null);
  const megamenuRefs = useRef([]);
  const timeoutRef = useRef(null); // Added for delayed onMouseLeave

  // Filter menuItems to include only published products
  const filteredMenuItems = menuItems.map(item => ({
    ...item,
    products: item.products?.filter(product => 
      products.some(p => p.id === product.id && p.isPublished)
    ) || []
  }));

  const firstSixItems = filteredMenuItems.slice(0, 7);
  const remainingItems = filteredMenuItems.slice(7); // Adjusted to start from index 7
  const columnClass = remainingItems.length > 4 ? "grid-cols-3" : "grid-cols-2";

  // Laptop submenu with Accessories
  const laptopSubMenuItems = [
    { name: "Acer", path: "/laptops/acer" },
    { name: "Dell", path: "/laptops/dell" },
    { name: "ASUS", path: "/laptops/asus" },
    { name: "HP", path: "/laptops/hp" },
    { name: "Lenovo", path: "/laptops/lenovo" },
    { name: "Toshiba", path: "/laptops/toshiba" },
    { name: "MSI", path: "/laptops/msi" },
    { name: "Apple", path: "/laptops/apple" },
    { name: "Infinix", path: "/laptops/infinix" },
    { name: "Microsoft", path: "/laptops/microsoft" },
    { name: "Gigabyte", path: "/laptops/gigabyte" },
    {
      name: "Accessories",
      path: "/laptops/accessories",
      items: [
        { name: "Bag", path: "/laptops/accessories/bag" },
        { name: "RAM", path: "/laptops/accessories/ram" },
        { name: "Mouse", path: "/laptops/accessories/mouse" },
        { name: "Keyboard", path: "/laptops/accessories/keyboard" },
        { name: "Cooling Pad", path: "/laptops/accessories/cooling-pad" },
        { name: "Charger", path: "/laptops/accessories/charger" },
      ],
    },
  ];

  const adjustMegamenuPosition = (element) => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    if (rect.bottom > viewportHeight) {
      element.style.top = `-${rect.height - 5}px`; // Move up if exceeding viewport height
    } else {
      element.style.top = "0";
    }
    // Ensure megamenu stays within viewport width
    if (rect.right > viewportWidth) {
      element.style.left = `-${rect.width}px`; // Shift left if exceeding viewport width
    } else {
      element.style.left = "100%";
    }
  };

  useEffect(() => {
    megamenuRefs.current.forEach((ref, index) => {
      if ((hoverProductIndex === index || hoverMoreProductIndex === index || hoverAccessoryIndex === index) && ref) {
        adjustMegamenuPosition(ref);
      }
    });
  }, [hoverProductIndex, hoverMoreProductIndex, hoverAccessoryIndex]);

  // Handle delayed onMouseLeave to allow clicks
  const handleMouseEnter = (setState, value) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setState(value);
  };

  const handleMouseLeave = (setState) => {
    timeoutRef.current = setTimeout(() => {
      setState(null);
    }, 200); // 200ms delay to allow clicks
  };

  return (
    <div className="hidden md:flex justify-center space-x-2 px-4 py-1 text-sm font-semibold text-white bg-[#CF212B] relative z-50">
      {/* Home Menu Item */}
      <div className="relative cursor-pointer">
        <Link to="/" className="flex items-center px-2 py-0.5 rounded-md hover:text-gray-200 transition-colors duration-200">
          <FaHome className="mr-0.5" />
        </Link>
      </div>

      {/* Laptop Menu Item with Submenu */}
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => handleMouseEnter(setShowLaptopSubMenu, true)}
        onMouseLeave={() => handleMouseLeave(() => {
          setShowLaptopSubMenu(false);
          setHoverAccessoryIndex(null);
        })}
      >
        <Link
          to="/laptops"
          className="px-2 py-0.5 rounded-md transition-colors duration-200 hover:text-gray-200"
        >
          Laptop
        </Link>
        {showLaptopSubMenu && (
          <div
            className="absolute left-0 right-0 bg-gray-300 text-black rounded-b-md z-60 border-t border-gray-200 shadow-lg"
            style={{ top: '100%', width: '120vw', maxWidth: '1200px', margin: '0 auto' }}
          >
            <div className="grid grid-cols-5 gap-2 px-6 py-3">
              {laptopSubMenuItems.map((item, index) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.items && handleMouseEnter(setHoverAccessoryIndex, index)}
                  onMouseLeave={() => item.items && handleMouseLeave(setHoverAccessoryIndex)}
                >
                  <Link
                    to={item.path}
                    className="block px-2 py-1 text-xs font-medium hover:bg-gray-100 rounded transition-colors duration-150"
                  >
                    {item.name}
                  </Link>
                  {item.items?.length > 0 && hoverAccessoryIndex === index && (
                    <div
                      ref={(el) => (megamenuRefs.current[index] = el)}
                      className="absolute top-0 left-full w-64 bg-gray-200 shadow-lg rounded-lg border border-gray-200 z-70"
                    >
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className="block px-2 py-1 text-xs font-medium text-black hover:bg-gray-100 rounded transition-colors duration-150"
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

      {/* Static Menu Items */}
      {["Desktop", "Printer", "Camera", "Network"].map((name) => (
        <div key={name} className="relative cursor-pointer">
          <Link
            to={`/${name.toLowerCase()}`}
            className="px-2 py-0.5 rounded-md transition-colors duration-200 hover:text-gray-400"
          >
            {name}
          </Link>
        </div>
      ))}

      {/* Category Items (First 6) */}
      {firstSixItems.map((item, index) => (
        <div
          key={item.id}
          className="relative cursor-pointer"
          onMouseEnter={() => handleMouseEnter(setHoverIndex, index)}
          onMouseLeave={() => handleMouseLeave(() => {
            setHoverIndex(null);
            setHoverProductIndex(null);
          })}
        >
          <Link
            to={item.path}
            className="px-2 py-0.5 rounded-md transition-colors duration-200 hover:text-gray-200"
          >
            {item.name}
          </Link>
          {item.products?.length > 0 && hoverIndex === index && (
            <div className="absolute left-0 w-screen bg-white text-black shadow-lg rounded-md border-t border-gray-200 z-60">
              <div className="grid grid-cols-2 gap-2 px-4 py-2 max-w-[800px] mx-auto">
                {item.products.map((product, productIndex) => (
                  <div
                    key={product.id}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(setHoverProductIndex, productIndex)}
                    onMouseLeave={() => handleMouseLeave(setHoverProductIndex)}
                  >
                    <Link
                      to={product.path}
                      className="block px-2 py-1 text-xs font-medium hover:bg-gray-100 rounded transition-colors duration-150"
                    >
                      {product.name}
                    </Link>
                    {product.items?.length > 0 && hoverProductIndex === productIndex && (
                      <div
                        ref={(el) => (megamenuRefs.current[productIndex] = el)}
                        className="absolute top-0 left-full w-64 bg-white text-black shadow-lg rounded border border-gray-200 z-70"
                      >
                        {product.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className="block px-2 py-1 text-xs font-medium hover:bg-gray-100 rounded transition-colors duration-150"
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
      ))}

      {/* More Items Dropdown */}
      {remainingItems.length > 0 && (
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => handleMouseEnter(setShowMoreItems, true)}
          onMouseLeave={() => handleMouseLeave(() => {
            setShowMoreItems(false);
            setHoverMoreItemIndex(null);
            setHoverMoreProductIndex(null);
          })}
        >
          <div className="flex items-center px-2 py-0.5 rounded-md transition-colors duration-200 hover:text-gray-200">
            More
            <FaAngleDoubleRight className="ml-0.5" />
          </div>
          {showMoreItems && (
            <div className="absolute top-full right-0 w-80 bg-white text-black shadow-lg rounded-md border border-gray-200 z-60">
              <div className={`grid ${columnClass} gap-2 p-2`}>
                {remainingItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(setHoverMoreItemIndex, index)}
                    onMouseLeave={() => handleMouseLeave(() => {
                      setHoverMoreItemIndex(null);
                      setHoverMoreProductIndex(null);
                    })}
                  >
                    <Link
                      to={item.path}
                      className="block px-2 py-1 text-xs font-medium hover:bg-gray-100 rounded transition-colors duration-150"
                    >
                      {item.name}
                    </Link>
                    {item.products?.length > 0 && hoverMoreItemIndex === index && (
                      <div className="absolute top-0 left-full w-48 bg-white text-black shadow-lg rounded border-gray-200 border z-70">
                        {item.products.map((product, productIndex) => (
                          <div
                            key={product.id}
                            className="relative"
                            onMouseEnter={() => handleMouseEnter(setHoverMoreProductIndex, productIndex)}
                            onMouseLeave={() => handleMouseLeave(setHoverMoreProductIndex)}
                          >
                            <Link
                              to={product.path}
                              className="block px-2 py-1 text-xs font-medium hover:bg-gray-100 rounded transition-colors duration-150"
                            >
                              {product.name}
                            </Link>
                            {product.items?.length > 0 && hoverMoreProductIndex === productIndex && (
                              <div
                                ref={(el) => (megamenuRefs.current[productIndex] = el)}
                                className="absolute top-0 left-full w-48 bg-white text-black shadow-lg rounded border border-gray-200 z-80"
                              >
                                {product.items.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    to={subItem.path}
                                    className="block px-2 py-1 text-xs font-medium hover:bg-gray-100 rounded transition-colors duration-150"
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
