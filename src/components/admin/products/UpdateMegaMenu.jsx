// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchCategoriesAndProducts,
//   fetchCategoryById,
//   fetchProductById,
//   fetchProductItemById,
//   updateCategory,
//   updateProduct,
//   updateProductItem,
//   fetchProductsByCategory,
//   clearSelectedCategory,
//   clearSelectedProduct,
//   clearSelectedProductItem,
// } from '../../../store/categorySlice';

// const UpdateMegaMenu = () => {
//   const dispatch = useDispatch();
//   const {
//     categoriesWithSub,
//     items: categories,
//     products,
//     selectedCategory,
//     selectedProduct,
//     selectedProductItem,
//     loading,
//     error,
//   } = useSelector((state) => state.categories);
//   const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');
//   const userRole = useSelector((state) => state.auth.role) || localStorage.getItem('authRole');

//   // Category state
//   const [categoryName, setCategoryName] = useState('');
//   const [categoryError, setCategoryError] = useState('');
//   const [categorySuccess, setCategorySuccess] = useState('');

//   // Product state
//   const [productName, setProductName] = useState('');
//   const [productCategoryId, setProductCategoryId] = useState('');
//   const [productError, setProductError] = useState('');
//   const [productSuccess, setProductSuccess] = useState('');

//   // Product Item state
//   const [itemName, setItemName] = useState('');
//   const [itemCategoryId, setItemCategoryId] = useState('');
//   const [itemProductId, setItemProductId] = useState('');
//   const [itemError, setItemError] = useState('');
//   const [itemSuccess, setItemSuccess] = useState('');

//   // Search state for better UX
//   const [categorySearch, setCategorySearch] = useState('');
//   const [productSearch, setProductSearch] = useState('');
//   const [itemSearch, setItemSearch] = useState('');

//   useEffect(() => {
//     dispatch(fetchCategoriesAndProducts());
//   }, [dispatch]);

//   // Auto-clear success messages after 3 seconds
//   useEffect(() => {
//     if (categorySuccess) {
//       const timer = setTimeout(() => setCategorySuccess(''), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [categorySuccess]);

//   useEffect(() => {
//     if (productSuccess) {
//       const timer = setTimeout(() => setProductSuccess(''), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [productSuccess]);

//   useEffect(() => {
//     if (itemSuccess) {
//       const timer = setTimeout(() => setItemSuccess(''), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [itemSuccess]);

//   useEffect(() => {
//     if (selectedCategory) {
//       setCategoryName(selectedCategory.name || '');
//     } else {
//       setCategoryName('');
//     }
//   }, [selectedCategory]);

//   useEffect(() => {
//     if (selectedProduct) {
//       setProductName(selectedProduct.name || '');
//       setProductCategoryId(selectedProduct.catagory?.id ? String(selectedProduct.catagory.id) : '');
//     } else {
//       setProductName('');
//       setProductCategoryId('');
//     }
//   }, [selectedProduct]);

//   useEffect(() => {
//     if (selectedProductItem) {
//       setItemName(selectedProductItem.productitemname || selectedProductItem.name || '');
//       setItemCategoryId(selectedProductItem.catagory?.id ? String(selectedProductItem.catagory.id) : '');
//       setItemProductId(selectedProductItem.product?.id ? String(selectedProductItem.product.id) : '');
//       if (selectedProductItem.catagory?.id) {
//         dispatch(fetchProductsByCategory(selectedProductItem.catagory.id));
//       }
//     } else {
//       setItemName('');
//       setItemCategoryId('');
//       setItemProductId('');
//     }
//   }, [selectedProductItem, dispatch]);

//   useEffect(() => {
//     if (itemCategoryId) {
//       dispatch(fetchProductsByCategory(itemCategoryId));
//       // Reset product ID if category changes to prevent invalid selection
//       if (selectedProductItem && String(selectedProductItem.catagory?.id) !== itemCategoryId) {
//         setItemProductId('');
//       }
//     } else {
//       dispatch({ type: 'categories/clearProducts' });
//       setItemProductId('');
//     }
//   }, [itemCategoryId, selectedProductItem, dispatch]);

//   // Filter functions for search
//   const filteredCategories = categoriesWithSub.filter(category =>
//     category.name.toLowerCase().includes(categorySearch.toLowerCase())
//   );

//   const filteredProducts = categoriesWithSub.flatMap((category) =>
//     category.products.map(product => ({
//       ...product,
//       categoryName: category.name
//     }))
//   ).filter(product =>
//     product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
//     product.categoryName.toLowerCase().includes(productSearch.toLowerCase())
//   );

//   const filteredItems = categoriesWithSub.flatMap((category) =>
//     category.products.flatMap((product) =>
//       product.items.map((item) => ({
//         ...item,
//         productName: product.name,
//         categoryName: category.name
//       }))
//     )
//   ).filter(item =>
//     item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
//     item.productName.toLowerCase().includes(itemSearch.toLowerCase()) ||
//     item.categoryName.toLowerCase().includes(itemSearch.toLowerCase())
//   );

//   const handleEditCategory = (id) => {
//     dispatch(fetchCategoryById(id));
//     setCategoryError('');
//     setCategorySuccess('');
//   };

//   const handleEditProduct = (id) => {
//     dispatch(fetchProductById(id));
//     setProductError('');
//     setProductSuccess('');
//   };

//   const handleEditProductItem = (id) => {
//     dispatch(fetchProductItemById(id));
//     setItemError('');
//     setItemSuccess('');
//   };

//   const handleUpdateCategory = async (e) => {
//     e.preventDefault();
    
//     if (!selectedCategory) {
//       setCategoryError('Please select a category to edit.');
//       return;
//     }

//     if (!categoryName.trim()) {
//       setCategoryError('Category name cannot be empty.');
//       return;
//     }

//     // Check for duplicate category names
//     const isDuplicate = categoriesWithSub.some(cat => 
//       cat.name.toLowerCase() === categoryName.trim().toLowerCase() && cat.id !== selectedCategory.id
//     );
    
//     if (isDuplicate) {
//       setCategoryError('A category with this name already exists.');
//       return;
//     }

//     try {
//       const resultAction = await dispatch(
//         updateCategory({
//           id: selectedCategory.id,
//           name: categoryName.trim(),
//           token,
//         })
//       );
      
//       if (resultAction.meta.requestStatus === 'fulfilled') {
//         setCategorySuccess('Category updated successfully!');
//         setCategoryName('');
//         dispatch(clearSelectedCategory());
//         dispatch(fetchCategoriesAndProducts());
//       } else {
//         setCategoryError(resultAction.payload || 'Failed to update category.');
//       }
//     } catch (err) {
//       setCategoryError('Failed to update category. Please try again.');
//       console.error('Error updating category:', err);
//     }
//   };

//   const handleUpdateProduct = async (e) => {
//     e.preventDefault();
    
//     if (!selectedProduct) {
//       setProductError('Please select a product to edit.');
//       return;
//     }

//     if (!productName.trim()) {
//       setProductError('Product name cannot be empty.');
//       return;
//     }

//     if (!productCategoryId) {
//       setProductError('Please select a category for the product.');
//       return;
//     }

//     // Check for duplicate product names within the same category
//     const categoryProducts = categoriesWithSub
//       .find(cat => String(cat.id) === productCategoryId)?.products || [];
    
//     const isDuplicate = categoryProducts.some(prod => 
//       prod.name.toLowerCase() === productName.trim().toLowerCase() && prod.id !== selectedProduct.id
//     );
    
//     if (isDuplicate) {
//       setProductError('A product with this name already exists in the selected category.');
//       return;
//     }

//     try {
//       const resultAction = await dispatch(
//         updateProduct({
//           id: selectedProduct.id,
//           name: productName.trim(),
//           categoryId: productCategoryId,
//           token,
//           categories,
//         })
//       );
      
//       if (resultAction.meta.requestStatus === 'fulfilled') {
//         setProductSuccess('Product updated successfully!');
//         setProductName('');
//         setProductCategoryId('');
//         dispatch(clearSelectedProduct());
//         dispatch(fetchCategoriesAndProducts());
//       } else {
//         setProductError(resultAction.payload || 'Failed to update product.');
//       }
//     } catch (err) {
//       setProductError('Failed to update product. Please try again.');
//       console.error('Error updating product:', err);
//     }
//   };

//   const handleUpdateProductItem = async (e) => {
//     e.preventDefault();
    
//     if (!selectedProductItem) {
//       setItemError('Please select a product item to edit.');
//       return;
//     }

//     if (!itemName.trim()) {
//       setItemError('Item name cannot be empty.');
//       return;
//     }

//     if (!itemCategoryId) {
//       setItemError('Please select a category for the item.');
//       return;
//     }

//     if (!itemProductId) {
//       setItemError('Please select a product for the item.');
//       return;
//     }

//     // Check for duplicate item names within the same product
//     const selectedCategory = categoriesWithSub.find(cat => String(cat.id) === itemCategoryId);
//     const selectedProductItems = selectedCategory?.products
//       .find(prod => String(prod.id) === itemProductId)?.items || [];
    
//     const isDuplicate = selectedProductItems.some(item => 
//       item.name.toLowerCase() === itemName.trim().toLowerCase() && item.id !== selectedProductItem.id
//     );
    
//     if (isDuplicate) {
//       setItemError('An item with this name already exists in the selected product.');
//       return;
//     }

//     try {
//       const resultAction = await dispatch(
//         updateProductItem({
//           id: selectedProductItem.id,
//           itemName: itemName.trim(),
//           categoryId: itemCategoryId,
//           productId: itemProductId,
//           token,
//           categories,
//           products,
//         })
//       );
      
//       if (resultAction.meta.requestStatus === 'fulfilled') {
//         setItemSuccess('Product item updated successfully!');
//         setItemName('');
//         setItemCategoryId('');
//         setItemProductId('');
//         dispatch(clearSelectedProductItem());
//         dispatch(fetchCategoriesAndProducts());
//       } else {
//         setItemError(resultAction.payload || 'Failed to update product item.');
//       }
//     } catch (err) {
//       setItemError('Failed to update product item. Please try again.');
//       console.error('Error updating product item:', err);
//     }
//   };

//   const handleCancelCategory = () => {
//     dispatch(clearSelectedCategory());
//     setCategoryName('');
//     setCategoryError('');
//     setCategorySuccess('');
//   };

//   const handleCancelProduct = () => {
//     dispatch(clearSelectedProduct());
//     setProductName('');
//     setProductCategoryId('');
//     setProductError('');
//     setProductSuccess('');
//   };

//   const handleCancelProductItem = () => {
//     dispatch(clearSelectedProductItem());
//     setItemName('');
//     setItemCategoryId('');
//     setItemProductId('');
//     setItemError('');
//     setItemSuccess('');
//   };

//   // Loading component
//   const LoadingSpinner = () => (
//     <div className="flex justify-center items-center py-8">
//       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       <span className="ml-2 text-gray-600">Loading...</span>
//     </div>
//   );

//   // Search input component
//   const SearchInput = ({ value, onChange, placeholder }) => (
//     <div className="mb-4">
//       <input
//         type="text"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//     </div>
//   );

//   if (userRole !== 'admin') {
//     return (
//       <div className="p-8 text-center">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           <strong className="font-bold">Access Denied!</strong>
//           <span className="block sm:inline"> You do not have permission to access this page.</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 max-w-6xl mx-auto space-y-8">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">Update MegaMenu System</h1>
//         <p className="text-gray-600 mt-2">Manage categories, products (submenu), and product items</p>
//       </div>

//       {loading && <LoadingSpinner />}
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           <strong className="font-bold">Error:</strong> {error}
//         </div>
//       )}

//       {/* Update Category Section */}
//       <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
//         <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Update Category</h2>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Category List */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4 text-gray-700">Categories ({filteredCategories.length})</h3>
//             <SearchInput
//               value={categorySearch}
//               onChange={setCategorySearch}
//               placeholder="Search categories..."
//             />
//             <div className="border rounded-lg max-h-96 overflow-y-auto">
//               {filteredCategories.length > 0 ? (
//                 <ul className="space-y-1">
//                   {filteredCategories.map((category) => (
//                     <li
//                       key={category.id}
//                       className={`flex justify-between items-center p-3 hover:bg-gray-50 border-b last:border-b-0 ${
//                         selectedCategory?.id === category.id ? 'bg-blue-50 border-blue-200' : ''
//                       }`}
//                     >
//                       <span className="font-medium text-gray-800">{category.name}</span>
//                       <button
//                         onClick={() => handleEditCategory(category.id)}
//                         className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
//                       >
//                         Edit
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">No categories found</p>
//               )}
//             </div>
//           </div>
          
//           {/* Category Update Form */}
//           <div>
//             {selectedCategory ? (
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h4 className="text-lg font-semibold mb-4 text-gray-800">
//                   Editing: {selectedCategory.name}
//                 </h4>
//                 <form onSubmit={handleUpdateCategory} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Category Name
//                     </label>
//                     <input
//                       type="text"
//                       value={categoryName}
//                       onChange={(e) => setCategoryName(e.target.value)}
//                       required
//                       className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter category name"
//                     />
//                   </div>
//                   <div className="flex space-x-3">
//                     <button
//                       type="submit"
//                       className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
//                     >
//                       Update Category
//                     </button>
//                     <button
//                       type="button"
//                       onClick={handleCancelCategory}
//                       className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                   {categorySuccess && (
//                     <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded">
//                       {categorySuccess}
//                     </div>
//                   )}
//                   {categoryError && (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">
//                       {categoryError}
//                     </div>
//                   )}
//                 </form>
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">Select a category to edit</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Update Product Section */}
//       <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
//         <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Update Product (Submenu)</h2>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Product List */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4 text-gray-700">Products ({filteredProducts.length})</h3>
//             <SearchInput
//               value={productSearch}
//               onChange={setProductSearch}
//               placeholder="Search products..."
//             />
//             <div className="border rounded-lg max-h-96 overflow-y-auto">
//               {filteredProducts.length > 0 ? (
//                 <ul className="space-y-1">
//                   {filteredProducts.map((product) => (
//                     <li
//                       key={product.id}
//                       className={`flex justify-between items-center p-3 hover:bg-gray-50 border-b last:border-b-0 ${
//                         selectedProduct?.id === product.id ? 'bg-blue-50 border-blue-200' : ''
//                       }`}
//                     >
//                       <div>
//                         <span className="font-medium text-gray-800 block">{product.name}</span>
//                         <span className="text-sm text-gray-500">Category: {product.categoryName}</span>
//                       </div>
//                       <button
//                         onClick={() => handleEditProduct(product.id)}
//                         className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
//                       >
//                         Edit
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">No products found</p>
//               )}
//             </div>
//           </div>
          
//           {/* Product Update Form */}
//           <div>
//             {selectedProduct ? (
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h4 className="text-lg font-semibold mb-4 text-gray-800">
//                   Editing: {selectedProduct.name}
//                 </h4>
//                 <form onSubmit={handleUpdateProduct} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Product Name
//                     </label>
//                     <input
//                       type="text"
//                       value={productName}
//                       onChange={(e) => setProductName(e.target.value)}
//                       required
//                       className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter product name"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Category
//                     </label>
//                     <select
//                       value={productCategoryId}
//                       onChange={(e) => setProductCategoryId(e.target.value)}
//                       required
//                       className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="">Select Category</option>
//                       {categories.length > 0 ? (
//                         categories.map((category) => (
//                           <option key={category.id} value={String(category.id)}>
//                             {category.name}
//                           </option>
//                         ))
//                       ) : (
//                         <option value="" disabled>No categories available</option>
//                       )}
//                     </select>
//                   </div>
//                   <div className="flex space-x-3">
//                     <button
//                       type="submit"
//                       className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
//                     >
//                       Update Product
//                     </button>
//                     <button
//                       type="button"
//                       onClick={handleCancelProduct}
//                       className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                   {productSuccess && (
//                     <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded">
//                       {productSuccess}
//                     </div>
//                   )}
//                   {productError && (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">
//                       {productError}
//                     </div>
//                   )}
//                   {categories.length === 0 && (
//                     <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded">
//                       No categories available. Please add a category first.
//                     </div>
//                   )}
//                 </form>
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">Select a product to edit</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Update Product Item Section */}
//       <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
//         <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Update Product Item (MegaMenu Items)</h2>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Product Item List */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4 text-gray-700">Product Items ({filteredItems.length})</h3>
//             <SearchInput
//               value={itemSearch}
//               onChange={setItemSearch}
//               placeholder="Search product items..."
//             />
//             <div className="border rounded-lg max-h-96 overflow-y-auto">
//               {filteredItems.length > 0 ? (
//                 <ul className="space-y-1">
//                   {filteredItems.map((item, index) => (
//                     <li
//                       key={`${item.id || item.name}-${index}`}
//                       className={`flex justify-between items-center p-3 hover:bg-gray-50 border-b last:border-b-0 ${
//                         selectedProductItem?.id === item.id ? 'bg-blue-50 border-blue-200' : ''
//                       }`}
//                     >
//                       <div>
//                         <span className="font-medium text-gray-800 block">{item.name}</span>
//                         <span className="text-sm text-gray-500">
//                           Product: {item.productName} | Category: {item.categoryName}
//                         </span>
//                       </div>
//                       <button
//                         onClick={() => handleEditProductItem(item.id)}
//                         className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
//                       >
//                         Edit
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">No product items found</p>
//               )}
//             </div>
//           </div>
          
//           {/* Product Item Update Form */}
//           <div>
//             {selectedProductItem ? (
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h4 className="text-lg font-semibold mb-4 text-gray-800">
//                   Editing: {selectedProductItem.productitemname || selectedProductItem.name}
//                 </h4>
//                 <form onSubmit={handleUpdateProductItem} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Item Name
//                     </label>
//                     <input
//                       type="text"
//                       value={itemName}
//                       onChange={(e) => setItemName(e.target.value)}
//                       required
//                       className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter item name"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Category
//                     </label>
//                     <select
//                       value={itemCategoryId}
//                       onChange={(e) => setItemCategoryId(e.target.value)}
//                       required
//                       className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="">Select Category</option>
//                       {categories.length > 0 ? (
//                         categories.map((category) => (
//                           <option key={category.id} value={String(category.id)}>
//                             {category.name}
//                           </option>
//                         ))
//                       ) : (
//                         <option value="" disabled>No categories available</option>
//                       )}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Product
//                     </label>
//                     <select
//                       value={itemProductId}
//                       onChange={(e) => setItemProductId(e.target.value)}
//                       required
//                       disabled={!itemCategoryId || products.length === 0}
//                       className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                     >
//                       <option value="">Select Product</option>
//                       {products.length > 0 ? (
//                         products.map((product) => (
//                           <option key={product.id} value={String(product.id)}>
//                             {product.name}
//                           </option>
//                         ))
//                       ) : (
//                         <option value="" disabled>
//                           {itemCategoryId ? 'No products available' : 'Select a category first'}
//                         </option>
//                       )}
//                     </select>
//                   </div>
//                   <div className="flex space-x-3">
//                     <button
//                       type="submit"
//                       className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
//                     >
//                       Update Item
//                     </button>
//                     <button
//                       type="button"
//                       onClick={handleCancelProductItem}
//                       className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                   {itemSuccess && (
//                     <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded">
//                       {itemSuccess}
//                     </div>
//                   )}
//                   {itemError && (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">
//                       {itemError}
//                     </div>
//                   )}
//                   {categories.length === 0 && (
//                     <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded">
//                       No categories available. Please add a category first.
//                     </div>
//                   )}
//                 </form>
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">Select a product item to edit</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateMegaMenu;



import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategoriesAndProducts,
  fetchCategoryById,
  fetchProductById,
  fetchProductItemById,
  updateCategory,
  updateProduct,
  updateProductItem,
  fetchProductsByCategory,
  clearSelectedCategory,
  clearSelectedProduct,
  clearSelectedProductItem,
} from '../../../store/categorySlice';

const UpdateMegaMenu = () => {
  const dispatch = useDispatch();
  const {
    categoriesWithSub,
    items: categories,
    products,
    selectedCategory,
    selectedProduct,
    selectedProductItem,
    loading,
    error,
  } = useSelector((state) => state.categories);
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');
  const userRole = useSelector((state) => state.auth.role) || localStorage.getItem('authRole');

  // Category state
  const [categoryName, setCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categorySuccess, setCategorySuccess] = useState('');

  // Product state
  const [productName, setProductName] = useState('');
  const [productCategoryId, setProductCategoryId] = useState('');
  const [productError, setProductError] = useState('');
  const [productSuccess, setProductSuccess] = useState('');

  // Product Item state
  const [itemName, setItemName] = useState('');
  const [itemCategoryId, setItemCategoryId] = useState('');
  const [itemProductId, setItemProductId] = useState('');
  const [itemError, setItemError] = useState('');
  const [itemSuccess, setItemSuccess] = useState('');

  // Search state for better UX
  const [categorySearch, setCategorySearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');

  useEffect(() => {
    dispatch(fetchCategoriesAndProducts());
  }, [dispatch]);

  // Auto-clear success messages after 3 seconds
  useEffect(() => {
    if (categorySuccess) {
      const timer = setTimeout(() => setCategorySuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [categorySuccess]);

  useEffect(() => {
    if (productSuccess) {
      const timer = setTimeout(() => setProductSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [productSuccess]);

  useEffect(() => {
    if (itemSuccess) {
      const timer = setTimeout(() => setItemSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [itemSuccess]);

  useEffect(() => {
    if (selectedCategory) {
      setCategoryName(selectedCategory.name || '');
    } else {
      setCategoryName('');
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedProduct) {
      setProductName(selectedProduct.name || '');
      setProductCategoryId(selectedProduct.catagory?.id ? String(selectedProduct.catagory.id) : '');
    } else {
      setProductName('');
      setProductCategoryId('');
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProductItem) {
      setItemName(selectedProductItem.productitemname || selectedProductItem.name || '');
      setItemCategoryId(selectedProductItem.catagory?.id ? String(selectedProductItem.catagory.id) : '');
      setItemProductId(selectedProductItem.product?.id ? String(selectedProductItem.product.id) : '');
      if (selectedProductItem.catagory?.id) {
        dispatch(fetchProductsByCategory(selectedProductItem.catagory.id));
      }
    } else {
      setItemName('');
      setItemCategoryId('');
      setItemProductId('');
    }
  }, [selectedProductItem, dispatch]);

  useEffect(() => {
    if (itemCategoryId) {
      dispatch(fetchProductsByCategory(itemCategoryId));
      // Reset product ID if category changes to prevent invalid selection
      if (selectedProductItem && String(selectedProductItem.catagory?.id) !== itemCategoryId) {
        setItemProductId('');
      }
    } else {
      dispatch({ type: 'categories/clearProducts' });
      setItemProductId('');
    }
  }, [itemCategoryId, selectedProductItem, dispatch]);

  // Filter functions for search
  const filteredCategories = categoriesWithSub.filter(category =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredProducts = categoriesWithSub.flatMap((category) =>
    category.products.map(product => ({
      ...product,
      categoryName: category.name
    }))
  ).filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.categoryName.toLowerCase().includes(productSearch.toLowerCase())
  );
console.log("categoriesWithSub \n\n\n: ", categoriesWithSub)
  const filteredItems = categoriesWithSub.flatMap((category) =>
    category.products.flatMap((product) =>
      product.items.map((item) => ({
        ...item,
        // Ensure we have an id - use item.id if available, otherwise create a unique identifier
        id: item.id || item.productitemid || `${product.id}`,
        name: item.name || item.productitemname || '',
        productName: product.name,
        categoryName: category.name,
        productId: product.id,
        categoryId: category.id
      }))
    )
  ).filter(item =>
    (item.name || '').toLowerCase().includes(itemSearch.toLowerCase()) ||
    (item.productName || '').toLowerCase().includes(itemSearch.toLowerCase()) ||
    (item.categoryName || '').toLowerCase().includes(itemSearch.toLowerCase())
  );

  const handleEditCategory = (id) => {
    dispatch(fetchCategoryById(id));
    setCategoryError('');
    setCategorySuccess('');
  };

  const handleEditProduct = (id) => {
    dispatch(fetchProductById(id));
    setProductError('');
    setProductSuccess('');
  };

  const handleEditProductItem = (id) => {
    console.log('handleEditProductItem called with ID:', id);
    if (!id) {
      console.error('No ID provided for product item');
      setItemError('Unable to edit item: No ID found');
      return;
    }
    dispatch(fetchProductItemById(id));
    setItemError('');
    setItemSuccess('');
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      setCategoryError('Please select a category to edit.');
      return;
    }

    if (!categoryName.trim()) {
      setCategoryError('Category name cannot be empty.');
      return;
    }

    // Check for duplicate category names
    const isDuplicate = categoriesWithSub.some(cat => 
      cat.name.toLowerCase() === categoryName.trim().toLowerCase() && cat.id !== selectedCategory.id
    );
    
    if (isDuplicate) {
      setCategoryError('A category with this name already exists.');
      return;
    }

    try {
      const resultAction = await dispatch(
        updateCategory({
          id: selectedCategory.id,
          name: categoryName.trim(),
          token,
        })
      );
      
      if (resultAction.meta.requestStatus === 'fulfilled') {
        setCategorySuccess('Category updated successfully!');
        setCategoryName('');
        dispatch(clearSelectedCategory());
        dispatch(fetchCategoriesAndProducts());
      } else {
        setCategoryError(resultAction.payload || 'Failed to update category.');
      }
    } catch (err) {
      setCategoryError('Failed to update category. Please try again.');
      console.error('Error updating category:', err);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      setProductError('Please select a product to edit.');
      return;
    }

    if (!productName.trim()) {
      setProductError('Product name cannot be empty.');
      return;
    }

    if (!productCategoryId) {
      setProductError('Please select a category for the product.');
      return;
    }

    // Check for duplicate product names within the same category
    const categoryProducts = categoriesWithSub
      .find(cat => String(cat.id) === productCategoryId)?.products || [];
    
    const isDuplicate = categoryProducts.some(prod => 
      prod.name.toLowerCase() === productName.trim().toLowerCase() && prod.id !== selectedProduct.id
    );
    
    if (isDuplicate) {
      setProductError('A product with this name already exists in the selected category.');
      return;
    }

    try {
      const resultAction = await dispatch(
        updateProduct({
          id: selectedProduct.id,
          name: productName.trim(),
          categoryId: productCategoryId,
          token,
          categories,
        })
      );
      
      if (resultAction.meta.requestStatus === 'fulfilled') {
        setProductSuccess('Product updated successfully!');
        setProductName('');
        setProductCategoryId('');
        dispatch(clearSelectedProduct());
        dispatch(fetchCategoriesAndProducts());
      } else {
        setProductError(resultAction.payload || 'Failed to update product.');
      }
    } catch (err) {
      setProductError('Failed to update product. Please try again.');
      console.error('Error updating product:', err);
    }
  };

  const handleUpdateProductItem = async (e) => {
    e.preventDefault();
    
    if (!selectedProductItem) {
      setItemError('Please select a product item to edit.');
      return;
    }

    if (!itemName.trim()) {
      setItemError('Item name cannot be empty.');
      return;
    }

    if (!itemCategoryId) {
      setItemError('Please select a category for the item.');
      return;
    }

    if (!itemProductId) {
      setItemError('Please select a product for the item.');
      return;
    }

    // Check for duplicate item names within the same product
    const selectedCategory = categoriesWithSub.find(cat => String(cat.id) === itemCategoryId);
    const selectedProductItems = selectedCategory?.products
      .find(prod => String(prod.id) === itemProductId)?.items || [];
    
    const isDuplicate = selectedProductItems.some(item => item.id !== selectedProductItem.id);
    
    if (isDuplicate) {
      setItemError('An item with this name already exists in the selected product.');
      return;
    }

    try {
      const resultAction = await dispatch(
        updateProductItem({
          id: selectedProductItem.id,
          itemName: itemName.trim(),
          categoryId: itemCategoryId,
          productId: itemProductId,
          token,
          categories,
          products,
        })
      );
      
      if (resultAction.meta.requestStatus === 'fulfilled') {
        setItemSuccess('Product item updated successfully!');
        setItemName('');
        setItemCategoryId('');
        setItemProductId('');
        dispatch(clearSelectedProductItem());
        dispatch(fetchCategoriesAndProducts());
      } else {
        setItemError(resultAction.payload || 'Failed to update product item.');
      }
    } catch (err) {
      setItemError('Failed to update product item. Please try again.');
      console.error('Error updating product item:', err);
    }
  };

  const handleCancelCategory = () => {
    dispatch(clearSelectedCategory());
    setCategoryName('');
    setCategoryError('');
    setCategorySuccess('');
  };

  const handleCancelProduct = () => {
    dispatch(clearSelectedProduct());
    setProductName('');
    setProductCategoryId('');
    setProductError('');
    setProductSuccess('');
  };

  const handleCancelProductItem = () => {
    dispatch(clearSelectedProductItem());
    setItemName('');
    setItemCategoryId('');
    setItemProductId('');
    setItemError('');
    setItemSuccess('');
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );

  // Search input component
  const SearchInput = ({ value, onChange, placeholder }) => (
    <div className="mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  if (userRole !== 'admin') {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Access Denied!</strong>
          <span className="block sm:inline"> You do not have permission to access this page.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Update MegaMenu System</h1>
        <p className="text-gray-600 mt-2">Manage categories, products (submenu), and product items</p>
      </div>

      {loading && <LoadingSpinner />}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error:</strong> {error}
        </div>
      )}

      {/* Update Category Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Update Category</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category List */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Categories ({filteredCategories.length})</h3>
            <SearchInput
              value={categorySearch}
              onChange={setCategorySearch}
              placeholder="Search categories..."
            />
            <div className="border rounded-lg max-h-96 overflow-y-auto">
              {filteredCategories.length > 0 ? (
                <ul className="space-y-1">
                  {filteredCategories.map((category) => (
                    <li
                      key={category.id}
                      className={`flex justify-between items-center p-3 hover:bg-gray-50 border-b last:border-b-0 ${
                        selectedCategory?.id === category.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <span className="font-medium text-gray-800">{category.name}</span>
                      <button
                        onClick={() => handleEditCategory(category.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8">No categories found</p>
              )}
            </div>
          </div>
          
          {/* Category Update Form */}
          <div>
            {selectedCategory ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  Editing: {selectedCategory.name}
                </h4>
                <form onSubmit={handleUpdateCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter category name"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Update Category
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelCategory}
                      className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  {categorySuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded">
                      {categorySuccess}
                    </div>
                  )}
                  {categoryError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">
                      {categoryError}
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Select a category to edit</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update Product Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Update Product (Submenu)</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product List */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Products ({filteredProducts.length})</h3>
            <SearchInput
              value={productSearch}
              onChange={setProductSearch}
              placeholder="Search products..."
            />
            <div className="border rounded-lg max-h-96 overflow-y-auto">
              {filteredProducts.length > 0 ? (
                <ul className="space-y-1">
                  {filteredProducts.map((product) => (
                    <li
                      key={product.id}
                      className={`flex justify-between items-center p-3 hover:bg-gray-50 border-b last:border-b-0 ${
                        selectedProduct?.id === product.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div>
                        <span className="font-medium text-gray-800 block">{product.name}</span>
                        <span className="text-sm text-gray-500">Category: {product.categoryName}</span>
                      </div>
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8">No products found</p>
              )}
            </div>
          </div>
          
          {/* Product Update Form */}
          <div>
            {selectedProduct ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  Editing: {selectedProduct.name}
                </h4>
                <form onSubmit={handleUpdateProduct} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={productCategoryId}
                      onChange={(e) => setProductCategoryId(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <option key={category.id} value={String(category.id)}>
                            {category.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No categories available</option>
                      )}
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Update Product
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelProduct}
                      className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  {productSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded">
                      {productSuccess}
                    </div>
                  )}
                  {productError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">
                      {productError}
                    </div>
                  )}
                  {categories.length === 0 && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded">
                      No categories available. Please add a category first.
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Select a product to edit</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update Product Item Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Update Product Item (MegaMenu Items)</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Item List */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Product Items ({filteredItems.length})</h3>
            <SearchInput
              value={itemSearch}
              onChange={setItemSearch}
              placeholder="Search product items..."
            />
            <div className="border rounded-lg max-h-96 overflow-y-auto">
              {filteredItems.length > 0 ? (
                <ul className="space-y-1">
                  {filteredItems.map((item, index) => (
                    <li
                      key={`item-${item.id}-${index}`}
                      className={`flex justify-between items-center p-3 hover:bg-gray-50 border-b last:border-b-0 ${
                        selectedProductItem?.id === item.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div>
                        <span className="font-medium text-gray-800 block">{item.name}</span>
                        <span className="text-sm text-gray-500">
                          Product: {item.productName} | Category: {item.categoryName}
                        </span>
                        <span className="text-xs text-gray-400">ID: {item.id}</span>
                      </div>
                      <button
                        onClick={() => {
                          console.log('Editing item with ID:', item.id, 'Item data:', item);
                          handleEditProductItem(item.id);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8">No product items found</p>
              )}
            </div>
          </div>
          
          {/* Product Item Update Form */}
          <div>
            {selectedProductItem ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  Editing: {selectedProductItem.productitemname || selectedProductItem.name}
                </h4>
                <form onSubmit={handleUpdateProductItem} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter item name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={itemCategoryId}
                      onChange={(e) => setItemCategoryId(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <option key={category.id} value={String(category.id)}>
                            {category.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No categories available</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product
                    </label>
                    <select
                      value={itemProductId}
                      onChange={(e) => setItemProductId(e.target.value)}
                      required
                      disabled={!itemCategoryId || products.length === 0}
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Product</option>
                      {products.length > 0 ? (
                        products.map((product) => (
                          <option key={product.id} value={String(product.id)}>
                            {product.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          {itemCategoryId ? 'No products available' : 'Select a category first'}
                        </option>
                      )}
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Update Item
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelProductItem}
                      className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  {itemSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded">
                      {itemSuccess}
                    </div>
                  )}
                  {itemError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">
                      {itemError}
                    </div>
                  )}
                  {categories.length === 0 && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded">
                      No categories available. Please add a category first.
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Select a product item to edit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateMegaMenu;