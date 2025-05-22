import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategoriesAndProducts } from '../../../store/categorySlice';

const ViewCategories = () => {
  const dispatch = useDispatch();
  const { categoriesWithSub, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategoriesAndProducts());
  }, [dispatch]);

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-red-500 p-6">Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">View Categories and Products</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Category ID</th>
              <th className="py-2 px-4 border">Category (Menu)</th>
              <th className="py-2 px-4 border">Items (Submenu)</th>
            </tr>
          </thead>
          <tbody>
            {categoriesWithSub.map((category) => (
              <tr key={category.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border">{category.id}</td>
                <td className="py-2 px-4 border">{category.name}</td>
                <td className="py-2 px-4 border">
                  {category.subMenu && category.subMenu.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {category.subMenu.map((product) => (
                        <li key={product.name}>{product.name}</li>
                      ))}
                    </ul>
                  ) : (
                    'No products'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewCategories;
