
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check, X, AlertCircle } from 'lucide-react';
import {
  addCategory,
  addProduct,
  addItem,
  fetchCategories,
  fetchProductsByCategory,
  clearProducts,
  fetchCategoriesAndProducts,
} from '../../../store/categorySlice';

const AddCategory = () => {
  const dispatch = useDispatch();
  const { items: categories, products, loading, error } = useSelector((state) => state.categories);
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');
  const userRole = useSelector((state) => state.auth.role) || localStorage.getItem('authRole');

  const [categoryName, setCategoryName] = useState('');
  const [categorySuccess, setCategorySuccess] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [productCategoryId, setProductCategoryId] = useState('');
  const [productName, setProductName] = useState('');
  const [productSuccess, setProductSuccess] = useState('');
  const [productError, setProductError] = useState('');
  const [itemCategoryId, setItemCategoryId] = useState('');
  const [itemProductId, setItemProductId] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemSuccess, setItemSuccess] = useState('');
  const [itemError, setItemError] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
    return () => {
      dispatch(clearProducts());
    };
  }, [dispatch]);

  useEffect(() => {
    if (itemCategoryId) {
      dispatch(fetchProductsByCategory(itemCategoryId));
    } else {
      dispatch(clearProducts());
      setItemProductId('');
    }
  }, [itemCategoryId, dispatch]);

  // Clear success messages after 3 seconds
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

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setCategorySuccess('');
    setCategoryError('');

    if (!categoryName.trim()) {
      setCategoryError('Category name is required.');
      return;
    }

    try {
      const resultAction = await dispatch(addCategory({ name: categoryName.trim(), token }));
      if (addCategory.fulfilled.match(resultAction)) {
        setCategorySuccess('Category (Menu) added successfully!');
        setCategoryName('');
        dispatch(fetchCategories());
        dispatch(fetchCategoriesAndProducts());
      } else {
        setCategoryError(resultAction.payload || 'Failed to add category.');
      }
    } catch (err) {
      setCategoryError('Failed to add category.');
      console.error('Error:', err);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductSuccess('');
    setProductError('');

    if (!productCategoryId || !productName.trim()) {
      setProductError('All fields are required.');
      return;
    }

    try {
      const resultAction = await dispatch(
        addProduct({
          productName: productName.trim(),
          categoryId: productCategoryId,
          productitemname: '', // Optional field, set to empty if not used
          token,
          categories,
        })
      );

      if (addProduct.fulfilled.match(resultAction)) {
        setProductSuccess('Submenu added to category successfully!');
        setProductName('');
        setProductCategoryId('');
        dispatch(fetchCategoriesAndProducts());
      } else {
        setProductError(resultAction.payload || 'Failed to add product.');
      }
    } catch (err) {
      setProductError('Failed to add product.');
      console.error('Error:', err);
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    setItemSuccess('');
    setItemError('');

    if (!itemCategoryId || !itemProductId || !itemName.trim()) {
      setItemError('All fields are required.');
      return;
    }

    try {
      const resultAction = await dispatch(
        addItem({
          itemName: itemName.trim(),
          categoryId: itemCategoryId,
          productId: itemProductId,
          token,
          categories,
          products,
        })
      );

      if (addItem.fulfilled.match(resultAction)) {
        setItemSuccess('Item (Mega-menu) added successfully!');
        setItemName('');
        setItemCategoryId('');
        setItemProductId('');
        dispatch(fetchCategoriesAndProducts());
      } else {
        setItemError(resultAction.payload || 'Failed to add item.');
      }
    } catch (err) {
      setItemError('Failed to add item.');
      console.error('Error:', err);
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You do not have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const SuccessAlert = ({ message, onClose }) => (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Check className="h-5 w-5 text-green-500 mr-2" />
        <span className="text-green-800 font-medium">{message}</span>
      </div>
      <button onClick={onClose} className="text-green-500 hover:text-green-700" aria-label="Close alert">
        <X className="h-4 w-4" />
      </button>
    </div>
  );

  const ErrorAlert = ({ message, onClose }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-red-800 font-medium">{message}</span>
      </div>
      <button onClick={onClose} className="text-red-500 hover:text-red-700" aria-label="Close alert">
        <X className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-2xl mx-auto space-y-12">
        <h1 className="text-center text-3xl font-bold mb-8 text-blue-600">Add Category Section</h1>

        {/* Add Category Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Add New Category (Menu)</h2>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                id="categoryName"
                type="text"
                placeholder="Enter Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-required="true"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
              aria-label="Add category"
            >
              Add Category
            </button>
          </form>
          {categorySuccess && (
            <div className="mt-4">
              <SuccessAlert message={categorySuccess} onClose={() => setCategorySuccess('')} />
            </div>
          )}
          {categoryError && (
            <div className="mt-4">
              <ErrorAlert message={categoryError} onClose={() => setCategoryError('')} />
            </div>
          )}
        </div>

        {/* Add Product Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Add New Submenu (Under Category)</h2>
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div>
              <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="productCategory"
                value={productCategoryId}
                onChange={(e) => setProductCategoryId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-required="true"
              >
                <option value="">Select Category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                Submenu Name
              </label>
              <input
                id="productName"
                type="text"
                placeholder="Enter Submenu Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-required="true"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
              aria-label="Add product"
            >
              Add Submenu
            </button>
          </form>
          {productSuccess && (
            <div className="mt-4">
              <SuccessAlert message={productSuccess} onClose={() => setProductSuccess('')} />
            </div>
          )}
          {productError && (
            <div className="mt-4">
              <ErrorAlert message={productError} onClose={() => setProductError('')} />
            </div>
          )}
        </div>

        {/* Add Item Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Add New Item (Mega-menu)</h2>
          <form onSubmit={handleItemSubmit} className="space-y-4">
            <div>
              <label htmlFor="itemCategory" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="itemCategory"
                value={itemCategoryId}
                onChange={(e) => setItemCategoryId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-required="true"
              >
                <option value="">Select Category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="itemProduct" className="block text-sm font-medium text-gray-700 mb-2">
                Submenu
              </label>
              <select
                id="itemProduct"
                value={itemProductId}
                onChange={(e) => setItemProductId(e.target.value)}
                required
                disabled={!itemCategoryId || loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                aria-required="true"
              >
                <option value="">{loading ? 'Loading...' : 'Select Submenu'}</option>
                {products?.length > 0 ? (
                  products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No submenus available
                  </option>
                )}
              </select>
            </div>
            <div>
              <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
                Item Name
              </label>
              <input
                id="itemName"
                type="text"
                placeholder="Enter Item (Mega-menu) Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-required="true"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
              aria-label="Add item"
            >
              Add Item
            </button>
          </form>
          {itemSuccess && (
            <div className="mt-4">
              <SuccessAlert message={itemSuccess} onClose={() => setItemSuccess('')} />
            </div>
          )}
          {itemError && (
            <div className="mt-4">
              <ErrorAlert message={itemError} onClose={() => setItemError('')} />
            </div>
          )}
          {error && (
            <div className="mt-4">
              <ErrorAlert message={error} onClose={() => {}} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
