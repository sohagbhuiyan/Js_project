import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, addProduct, addItem, fetchCategories, fetchProductsByCategory, clearProducts, fetchCategoriesAndProducts } from '../../../store/categorySlice';

const AddCategory = () => {
  const dispatch = useDispatch();
  const { items: categories, products, error } = useSelector((state) => state.categories);
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
    }
  }, [itemCategoryId, dispatch]);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setCategorySuccess('');
    setCategoryError('');

    try {
      const resultAction = await dispatch(addCategory({ name: categoryName, token }));
      if (resultAction.meta.requestStatus === 'fulfilled') {
        setCategorySuccess('Category (Menu) added successfully!');
        setCategoryName('');
        dispatch(fetchCategories());
        dispatch(fetchCategoriesAndProducts());
      } else {
        setCategoryError('Failed to add category.');
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

    if (!productCategoryId || !productName) {
      setProductError('All fields are required.');
      return;
    }

    try {
      const resultAction = await dispatch(
        addProduct({
          productName,
          categoryId: productCategoryId,
          token,
          categories,
        })
      );

      if (resultAction.meta.requestStatus === 'fulfilled') {
        setProductSuccess('Submenu added on category successfully!');
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

    if (!itemCategoryId || !itemProductId || !itemName) {
      setItemError('All fields are required.');
      return;
    }

    try {
      const resultAction = await dispatch(
        addItem({
          token,
          itemName,
          categoryId: itemCategoryId,
          productId: itemProductId,
          categories,
          products,
        })
      );

      if (resultAction.meta.requestStatus === 'fulfilled') {
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

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-12">
      {userRole === 'admin' ? (
        <>
          {/* Add Category Form */}
          <div>
            <h1 className='text-center text-2xl font-bold mb-4 text-blue-600'>Add Category Section</h1>
            <h2 className="text-2xl font-bold mb-6">Add New Category (Menu)</h2>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Enter Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                className="border rounded w-full p-2"
              />
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Add Category
              </button>
            </form>
            {categorySuccess && <p className="text-green-600 mt-4">{categorySuccess}</p>}
            {categoryError && <p className="text-red-600 mt-4">{categoryError}</p>}
          </div>

          {/* Add Product Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Add New Submenu (Under Category)</h2>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <select
                value={productCategoryId}
                onChange={(e) => setProductCategoryId(e.target.value)}
                required
                className="border rounded w-full p-2"
              >
                <option value="">Select Category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Enter submenu Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="border rounded w-full p-2"
              />
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Add Product
              </button>
            </form>
            {productSuccess && <p className="text-green-600 mt-4">{productSuccess}</p>}
            {productError && <p className="text-red-600 mt-4">{productError}</p>}
          </div>

          {/* Add Item (Submenu) Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Add New Item (Meag menu) </h2>
            <form onSubmit={handleItemSubmit} className="space-y-4">
              <select
                value={itemCategoryId}
                onChange={(e) => setItemCategoryId(e.target.value)}
                required
                className="border rounded w-full p-2"
              >
                <option value="">Select Category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={itemProductId}
                onChange={(e) => setItemProductId(e.target.value)}
                required
                disabled={!itemCategoryId}
                className="border rounded w-full p-2 disabled:bg-gray-100"
              >
                <option value="">Select Submenu</option>
                {products?.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Enter Item (Mega-menu) Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
                className="border rounded w-full p-2"
              />
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Add Item
              </button>
            </form>
            {itemSuccess && <p className="text-green-600 mt-4">{itemSuccess}</p>}
            {itemError && <p className="text-red-600 mt-4">{itemError}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>
        </>
      ) : (
        <p className="text-red-600 text-center text-xl font-semibold">
          You do not have permission to access this page.
        </p>
      )}
    </div>
  );
};

export default AddCategory;