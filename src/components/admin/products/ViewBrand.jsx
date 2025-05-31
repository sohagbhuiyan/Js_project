import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBrands, updateBrand, deleteBrand } from "../../../store/brandSlice";

const ViewBrand = () => {
  const [editingBrand, setEditingBrand] = useState(null);
  const [editBrandName, setEditBrandName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  const { items: brands, loading, error } = useSelector((state) => state.brands);
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');
  const userRole = useSelector((state) => state.auth.role) || localStorage.getItem('authRole');

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleEditClick = (brand) => {
    setEditingBrand(brand.id);
    setEditBrandName(brand.brandname);
  };

  const handleCancelEdit = () => {
    setEditingBrand(null);
    setEditBrandName('');
  };

  const handleUpdateSubmit = async (e, brandId) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const resultAction = await dispatch(updateBrand({ 
        id: brandId, 
        brandname: editBrandName, 
        token 
      }));
      
      if (resultAction.meta.requestStatus === 'fulfilled') {
        setSuccessMessage('Brand updated successfully!');
        setEditingBrand(null);
        setEditBrandName('');
      } else {
        setErrorMessage('Failed to update brand.');
      }
    } catch (err) {
      setErrorMessage('Failed to update brand.');
      console.error('Error:', err);
    }
  };

  const handleDelete = async (brandId) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      setSuccessMessage('');
      setErrorMessage('');

      try {
        const resultAction = await dispatch(deleteBrand({ id: brandId, token }));
        
        if (resultAction.meta.requestStatus === 'fulfilled') {
          setSuccessMessage('Brand deleted successfully!');
        } else {
          setErrorMessage('Failed to delete brand.');
        }
      } catch (err) {
        setErrorMessage('Failed to delete brand.');
        console.error('Error:', err);
      }
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <p className="text-red-600 text-center text-xl font-semibold">
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Brands</h2>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <p>Loading brands...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {brand.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingBrand === brand.id ? (
                    <form 
                      onSubmit={(e) => handleUpdateSubmit(e, brand.id)}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="text"
                        value={editBrandName}
                        onChange={(e) => setEditBrandName(e.target.value)}
                        className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                        disabled={loading}
                      />
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                        disabled={loading}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    brand.brandname
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingBrand !== brand.id && (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditClick(brand)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit Brand"
                        disabled={loading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(brand) => handleDelete(brand.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Brand"
                        disabled={loading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {brands.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No brands found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBrand;