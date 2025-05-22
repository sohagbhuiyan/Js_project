import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addBrand, fetchBrands } from "../../../store/brandSlice";

const AddBrand = () => {
  const [brandname, setBrandName] = useState('');
  const [brandSuccess, setBrandSuccess] = useState('');
  const [brandError, setBrandError] = useState('');

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');
  const userRole = useSelector((state) => state.auth.role) || localStorage.getItem('authRole');
  const {loading } = useSelector((state) => state.brands);

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    setBrandSuccess('');
    setBrandError('');

    try {
      const resultAction = await dispatch(addBrand({ brandname: brandname, token }));
      if (resultAction.meta.requestStatus === 'fulfilled') {
        setBrandSuccess('Brand added successfully!');
        setBrandName('');
        dispatch(fetchBrands());
      } else {
        setBrandError('Failed to add brand.');
      }
    } catch (err) {
      setBrandError('Failed to add brand.');
      console.error('Error:', err);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-12">
      {userRole === 'admin' ? (
        <div>
          <h2 className="text-2xl font-bold mb-6">Add New Brand</h2>
          <form onSubmit={handleBrandSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter Brand Name"
              value={brandname}
              onChange={(e) => setBrandName(e.target.value)}
              required
              className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={loading}
            />
            <button
              type="submit"
              className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Brand'}
            </button>
          </form>
          {brandSuccess && <p className="text-green-600 mt-4">{brandSuccess}</p>}
          {brandError && <p className="text-red-600 mt-4">{brandError}</p>}
        </div>
      ) : (
        <p className="text-red-600 text-center text-xl font-semibold">
          You do not have permission to access this page.
        </p>
      )}
    </div>
  );
};

export default AddBrand;
