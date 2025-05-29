import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { cartOrderPlace, clearOrderError } from "../../../store/orderSlice";
import { API_BASE_URL } from "../../../store/api";

const CartCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, profile, token } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.order);
  const { cartItems, cartTotal } = location.state || { cartItems: [], cartTotal: 0 };
  const [orderForm, setOrderForm] = useState({
    districts: "",
    upazila: "",
    address: "",
  });
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingUpazilas, setLoadingUpazilas] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user?.id || !profile?.email || !token) {
      toast.error("Please log in to place an order.", { duration: 2000 });
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [user, profile, token, navigate, location.pathname]);

  // Validate cart items
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("No items in cart for checkout.", { duration: 2000 });
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  // Clear order error on mount/unmount
  useEffect(() => {
    dispatch(clearOrderError());
    return () => dispatch(clearOrderError());
  }, [dispatch]);

  // Fetch districts on mount
  useEffect(() => {
    const fetchDistricts = async () => {
      setLoadingDistricts(true);
      try {
        const cachedDistricts = JSON.parse(localStorage.getItem("districts") || "[]");
        if (cachedDistricts.length > 0) {
          setDistricts(cachedDistricts);
          return;
        }

        const response = await fetch("https://sohojapi.vercel.app/api/districts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch districts");
        const data = await response.json();
        const districtsData = (Array.isArray(data) ? data : data.data || []).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setDistricts(districtsData);
        localStorage.setItem("districts", JSON.stringify(districtsData));
        if (districtsData.length === 0) {
          toast.warn("No districts available.", { duration: 2000 });
        }
      } catch (error) {
        const cachedDistricts = JSON.parse(localStorage.getItem("districts") || "[]");
        if (cachedDistricts.length > 0) {
          setDistricts(cachedDistricts);
          toast.warn("Using cached districts.", { duration: 2000 });
        } else {
          toast.error("Failed to load districts.", { duration: 2000 });
        }
      } finally {
        setLoadingDistricts(false);
      }
    };
    fetchDistricts();
  }, [token]);

  // Fetch upazilas when district changes
  useEffect(() => {
    if (orderForm.districts) {
      const fetchUpazilas = async () => {
        setLoadingUpazilas(true);
        try {
          const cachedUpazilas = JSON.parse(
            localStorage.getItem(`upazilas_${orderForm.districts}`) || "[]"
          );
          if (cachedUpazilas.length > 0) {
            setUpazilas(cachedUpazilas);
            return;
          }

          const response = await fetch(
            `https://sohojapi.vercel.app/api/upzilas/${orderForm.districts}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!response.ok) throw new Error("Failed to fetch upazilas");
          const data = await response.json();
          const upazilasData = (Array.isArray(data) ? data : data.data || []).sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setUpazilas(upazilasData);
          localStorage.setItem(`upazilas_${orderForm.districts}`, JSON.stringify(upazilasData));
          if (upazilasData.length === 0) {
            toast.warn("No upazilas available for selected district.", { duration: 2000 });
          }
        } catch (error) {
          const cachedUpazilas = JSON.parse(
            localStorage.getItem(`upazilas_${orderForm.districts}`) || "[]"
          );
          if (cachedUpazilas.length > 0) {
            setUpazilas(cachedUpazilas);
            toast.warn("Using cached upazilas.", { duration: 2000 });
          } else {
            toast.error("Failed to load upazilas.", { duration: 2000 });
          }
        } finally {
          setLoadingUpazilas(false);
        }
      };
      fetchUpazilas();
    } else {
      setUpazilas([]);
      setOrderForm((prev) => ({ ...prev, upazila: "" }));
    }
  }, [orderForm.districts, token]);

  // Handle order error toast
  useEffect(() => {
    if (error) {
      toast.error(`Order failed: ${error}`, { duration: 3000 });
      dispatch(clearOrderError());
    }
  }, [error, dispatch]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return (
      cartTotal ||
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!orderForm.districts || !orderForm.upazila || !orderForm.address) {
      toast.error("Please fill in all required fields.", { duration: 2000 });
      return;
    }

    const orderPayload = {
      districts: districts.find((d) => d.id === orderForm.districts)?.name || orderForm.districts,
      upazila: upazilas.find((u) => u.id === orderForm.upazila)?.name || orderForm.upazila,
      address: orderForm.address,
      items: cartItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: parseFloat(item.price),
        specialprice: parseFloat(item.specialprice) || parseFloat(item.price),
        quantity: parseInt(item.quantity),
        imagea: item.imagea,
        ccBuilder: item.ccBuilder || { id: 1, name: "CCBuildersa" },
        item: item.item || {
          id: item.productId,
          name: item.name,
          ccBuilder: { id: 1, name: "CCBuildersa" },
        },
      })),
      price: calculateTotal(),
      requestDate: new Date().toISOString(),
      status: "PENDING",
    };

    try {
      const result = await dispatch(cartOrderPlace(orderPayload)).unwrap();
      toast.success("Order placed successfully!", {
        duration: 3000,
        style: { background: "#10B981", color: "#FFFFFF", fontWeight: "bold" },
      });

      // Construct order object for confirmation page
      const orderForConfirmation = {
        id: result.id || "N/A",
        name: profile.name || "Guest",
        email: profile.email,
        phoneNo: profile.phoneNo || "Not provided",
        districts: orderPayload.districts,
        upazila: orderPayload.upazila,
        address: orderPayload.address,
        requestdate: result.requestdate || orderPayload.requestDate,
        status: result.status || "PENDING",
        price: parseFloat(orderPayload.price),
        user: {
          id: user.id,
          name: profile.name || "Guest",
          email: profile.email,
          phoneNo: profile.phoneNo || "Not provided",
        },
        ccBuilderItemDitelsList: orderPayload.items.map((item) => ({
          id: item.productId,
          name: item.name,
          regularprice: item.price,
          specialprice: item.specialprice || item.price,
          quantity: item.quantity,
          imagea: item.imagea,
          ccBuilder: item.ccBuilder,
          item: item.item,
        })),
      };

        navigate("/cart-order-confirmation", {
          state: { order: orderForConfirmation },
        });
    } catch (error) {
      // Error is handled by the useEffect above
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Order Summary */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          {cartItems && cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.type}-${item.productId}`} className="flex gap-4">
                  <img
                    src={item.imagea ? `${API_BASE_URL}/images/${item.imagea}` : "/images/fallback-image.jpg"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded border"
                    onError={(e) => (e.target.src = "/images/fallback-image.jpg")}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm sm:text-base">{item.name}</h4>
                    <p className="text-sm text-gray-600">Product ID: {item.productId}</p>
                    <p className="text-sm">Quantity: {item.quantity}</p>
                    <p className="text-sm font-semibold">Price: Tk {item.price.toFixed(2)}</p>
                    <p className="text-sm font-semibold">Subtotal: Tk {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <p className="text-base font-semibold mt-4">Total: Tk {calculateTotal()}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">No items in cart.</p>
          )}
        </div>

        {/* Shipping Address Form */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="districts" className="block text-sm font-medium text-gray-700">
                District
              </label>
              <select
                id="districts"
                name="districts"
                value={orderForm.districts}
                onChange={handleFormChange}
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-green-200 text-gray-900 bg-white"
                required
                disabled={loadingDistricts || districts.length === 0}
                aria-label="Select District"
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
              {loadingDistricts && <p className="text-sm text-gray-500 mt-1">Loading districts...</p>}
              {!loadingDistricts && districts.length === 0 && (
                <p className="text-sm text-red-500 mt-1">No districts available</p>
              )}
            </div>
            <div>
              <label htmlFor="upazila" className="block text-sm font-medium text-gray-700">
                Upazila
              </label>
              <select
                id="upazila"
                name="upazila"
                value={orderForm.upazila}
                onChange={handleFormChange}
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-green-200 text-gray-900 bg-white"
                required
                disabled={loadingUpazilas || !orderForm.districts || upazilas.length === 0}
                aria-label="Select Upazila"
              >
                <option value="">Select Upazila</option>
                {upazilas.map((upazila) => (
                  <option key={upazila.id} value={upazila.id}>
                    {upazila.name}
                  </option>
                ))}
              </select>
              {loadingUpazilas && <p className="text-sm text-gray-500 mt-1">Loading upazilas...</p>}
              {!loadingUpazilas && orderForm.districts && upazilas.length === 0 && (
                <p className="text-sm text-red-500 mt-1">No upazilas available</p>
              )}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={orderForm.address}
                onChange={handleFormChange}
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-green-200 text-gray-900 bg-white"
                required
                rows="4"
                aria-label="Shipping Address"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 text-sm font-medium"
                onClick={() => navigate(-1)}
                aria-label="Cancel checkout"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium disabled:bg-green-400"
                disabled={loading || loadingDistricts || loadingUpazilas}
                aria-label="Confirm order"
              >
                {loading ? "Placing Order..." : "Confirm Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster position="top-right" toastOptions={{ className: "text-sm" }} />
    </div>
  );
};

export default CartCheckoutPage;