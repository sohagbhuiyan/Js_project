import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBrands, fetchBrandById, updateBrand, deleteBrand, clearSelectedBrand } from "../../../store/brandSlice";

const ViewBrand = () => {
  const dispatch = useDispatch();
  const { items: brands, loading, error } = useSelector((state) => state.brands);
//   const userRole = useSelector((state) => state.auth.role) || localStorage.getItem('authRole');
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');

  const [editBrandId, setEditBrandId] = useState(null);
  const [editBrandName, setEditBrandName] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleEditClick = (brand) => {
    setEditBrandId(brand._id);
    setEditBrandName(brand.brandname);
    setEditError('');
    setEditSuccess('');
    dispatch(fetchBrandById({ id: brand._id }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');

    if (!editBrandName.trim()) {
      setEditError('Brand name is required');
      return;
    }

    try {
      const resultAction = await dispatch(updateBrand({ id: editBrandId, brandname: editBrandName, token }));
      if (resultAction.meta.requestStatus === 'fulfilled') {
        setEditSuccess('Brand updated successfully!');
        setEditBrandId(null);
        setEditBrandName('');
        dispatch(clearSelectedBrand());
      } else {
        setEditError('Failed to update brand.');
      }
    } catch (err) {
      setEditError('Failed to update brand.');
      console.error('Error:', err);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        const resultAction = await dispatch(deleteBrand({ id, token }));
        if (resultAction.meta.requestStatus === 'fulfilled') {
          alert('Brand deleted successfully!');
        } else {
          alert('Failed to delete brand.');
        }
      } catch (err) {
        alert('Failed to delete brand.');
        console.error('Error:', err);
      }
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-12">
      <h2 className="text-2xl font-bold mb-6">View Brands</h2>
      {loading && (
        <p className="text-gray-600 text-center">Loading brands...</p>
      )}
      {error && (
        <p className="text-red-600 text-center">{error}</p>
      )}
      {!loading && !error && brands.length === 0 && (
        <p className="text-gray-600 text-center">No brands found.</p>
      )}
      {!loading && !error && brands.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand Name
                </th>
                {token === 'admin' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brands.map((brand) => (
                <tr key={brand._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editBrandId === brand._id ? (
                      <form onSubmit={handleUpdateSubmit} className="space-y-2">
                        <input
                          type="text"
                          value={editBrandName}
                          onChange={(e) => setEditBrandName(e.target.value)}
                          required
                          className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          disabled={loading}
                        />
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            className={`bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors ${
                              loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={loading}
                          >
                            {loading ? 'Updating...' : 'Save'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditBrandId(null);
                              setEditBrandName('');
                              dispatch(clearSelectedBrand());
                            }}
                            className="bg-gray-300 text-gray-800 py-1 px-3 rounded hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                        {editError && <p className="text-red-600 text-sm">{editError}</p>}
                        {editSuccess && <p className="text-green-600 text-sm">{editSuccess}</p>}
                      </form>
                    ) : (
                      brand.brandname
                    )}
                  </td>
                  {token === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {editBrandId !== brand._id && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClick(brand)}
                            className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition-colors"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(brand._id)}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewBrand;