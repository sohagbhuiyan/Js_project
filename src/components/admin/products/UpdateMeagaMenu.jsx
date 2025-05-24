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

  const [categoryName, setCategoryName] = useState('');
  const [productName, setProductName] = useState('');
  const [productCategoryId, setProductCategoryId] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemCategoryId, setItemCategoryId] = useState('');
  const [itemProductId, setItemProductId] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [productError, setProductError] = useState('');
  const [itemError, setItemError] = useState('');
  const [categorySuccess, setCategorySuccess] = useState('');
  const [productSuccess, setProductSuccess] = useState('');
  const [itemSuccess, setItemSuccess] = useState('');

  useEffect(() => {
    dispatch(fetchCategoriesAndProducts());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory) {
      setCategoryName(selectedCategory.name);
    } else {
      setCategoryName('');
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedProduct) {
      setProductName(selectedProduct.name);
      setProductCategoryId(selectedProduct.catagory?.id ? String(selectedProduct.catagory.id) : '');
    } else {
      setProductName('');
      setProductCategoryId('');
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProductItem) {
      setItemName(selectedProductItem.productitemname || '');
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
    dispatch(fetchProductItemById(id));
    setItemError('');
    setItemSuccess('');
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !categoryName) {
      setCategoryError('Category and name are required.');
      return;
    }

    try {
      const resultAction = await dispatch(
        updateCategory({
          id: selectedCategory.id,
          name: categoryName,
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
      setCategoryError('Failed to update category.');
      console.error('Error:', err);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !productName || !productCategoryId) {
      setProductError('Product, name, and category are required.');
      return;
    }

    try {
      const resultAction = await dispatch(
        updateProduct({
          id: selectedProduct.id,
          name: productName,
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
      setProductError('Failed to update product.');
      console.error('Error:', err);
    }
  };

  const handleUpdateProductItem = async (e) => {
    e.preventDefault();
    if (!selectedProductItem || !itemName || !itemCategoryId || !itemProductId) {
      setItemError('Item, name, category, and product are required.');
      return;
    }

    try {
      const resultAction = await dispatch(
        updateProductItem({
          id: selectedProductItem.id,
          itemName,
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
      setItemError('Failed to update product item.');
      console.error('Error:', err);
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

  if (userRole !== 'admin') {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 text-xl font-semibold">
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      {loading && <div className="text-center text-gray-600">Loading...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      {/* Update Category Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Update Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {categoriesWithSub.map((category) => (
                <li
                  key={category.id}
                  className="flex justify-between items-center p-2 bg-gray-100 rounded hover:bg-gray-200"
                >
                  <span>{category.name}</span>
                  <button
                    onClick={() => handleEditCategory(category.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Category Update Form */}
          <div>
            {selectedCategory ? (
              <form onSubmit={handleUpdateCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                    className="border rounded w-full p-2 mt-1"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                  >
                    Update Category
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelCategory}
                    className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
                {categorySuccess && <p className="text-green-600 mt-2">{categorySuccess}</p>}
                {categoryError && <p className="text-red-600 mt-2">{categoryError}</p>}
              </form>
            ) : (
              <p className="text-gray-600">Select a category to edit.</p>
            )}
          </div>
        </div>
      </div>

      {/* Update Product Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Update Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {categoriesWithSub.flatMap((category) =>
                category.products.map((product) => (
                  <li
                    key={product.id}
                    className="flex justify-between items-center p-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    <span>
                      {product.name} (Category: {category.name})
                    </span>
                    <button
                      onClick={() => handleEditProduct(product.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
          {/* Product Update Form */}
          <div>
            {selectedProduct ? (
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    className="border rounded w-full p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={productCategoryId}
                    onChange={(e) => setProductCategoryId(e.target.value)}
                    required
                    className="border rounded w-full p-2 mt-1"
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
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                  >
                    Update Product
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelProduct}
                    className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
                {productSuccess && <p className="text-green-600 mt-2">{productSuccess}</p>}
                {productError && <p className="text-red-600 mt-2">{productError}</p>}
                {categories.length === 0 && (
                  <p className="text-red-600 mt-2">No categories available. Please add a category first.</p>
                )}
              </form>
            ) : (
              <p className="text-gray-600">Select a product to edit.</p>
            )}
          </div>
        </div>
      </div>

      {/* Update Product Item Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Update Product Item</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Item List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product Items</h3>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {categoriesWithSub.flatMap((category) =>
                category.products.flatMap((product) =>
                  product.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex justify-between items-center p-2 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      <span>
                        {item.name} (Product: {product.name}, Category: {category.name})
                      </span>
                      <button
                        onClick={() => {
                          // Use item.id if available, or fetch from API
                          handleEditProductItem(item.id);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    </li>
                  ))
                )
              )}
            </ul>
          </div>
          {/* Product Item Update Form */}
          <div>
            {selectedProductItem ? (
              <form onSubmit={handleUpdateProductItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                    className="border rounded w-full p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={itemCategoryId}
                    onChange={(e) => setItemCategoryId(e.target.value)}
                    required
                    className="border rounded w-full p-2 mt-1"
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
                  <label className="block text-sm font-medium text-gray-700">
                    Product
                  </label>
                  <select
                    value={itemProductId}
                    onChange={(e) => setItemProductId(e.target.value)}
                    required
                    disabled={!itemCategoryId || products.length === 0}
                    className="border rounded w-full p-2 mt-1 disabled:bg-gray-100"
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
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                  >
                    Update Item
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelProductItem}
                    className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
                {itemSuccess && <p className="text-green-600 mt-2">{itemSuccess}</p>}
                {itemError && <p className="text-red-600 mt-2">{itemError}</p>}
                {categories.length === 0 && (
                  <p className="text-red-600 mt-2">No categories available. Please add a category first.</p>
                )}
              </form>
            ) : (
              <p className="text-gray-600">Select a product item to edit.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateMegaMenu;
