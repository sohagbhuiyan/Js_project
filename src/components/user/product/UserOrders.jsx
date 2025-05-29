import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { fetchUserOrdersById, clearOrderError } from "../../../store/orderSlice";
import toast, { Toaster } from "react-hot-toast";
import { FiEye } from "react-icons/fi";

const Breadcrumb = () => {
  const navigate = useNavigate();
  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Profile", path: "/profile" },
    { label: "Orders", path: "/view-orders" },
  ];

  return (
    <div className="bg-white mb-6">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-xs sm:text-base">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center">
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-800 font-semibold">{crumb.label}</span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-gray-600 hover:text-blue-500 transition duration-150"
                  onClick={() => navigate(crumb.path)}
                >
                  {crumb.label}
                </Link>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="mx-2 text-gray-400">-&gt;</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

const UserOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { userOrders = [], loading = false, error = null } = useSelector((state) => state.order);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Redirect to login if not authenticated
  if (!user?.id || !token) {
    toast.error("Please log in to view your orders.", {
      duration: 3000,
      style: { background: "#EF4444", color: "#FFFFFF", fontWeight: "bold" },
    });
    navigate("/login", { state: { from: "/view-orders" } });
    return null;
  }

  useEffect(() => {
    dispatch(fetchUserOrdersById(user.id))
      .unwrap()
      .catch((error) => {
        toast.error(`Failed to load orders: ${error.message || error}`, {
          duration: 4000,
          style: { background: "#EF4444", color: "#FFFFFF", fontWeight: "bold" },
        });
      });

    return () => {
      dispatch(clearOrderError());
    };
  }, [dispatch, user.id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-1 sm:p-6">
      <Breadcrumb />
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Your Orders</h1>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-solid"></div>
          <span className="ml-2 text-gray-600">Loading your orders...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {userOrders.length === 0 ? (
            <p className="p-6 text-gray-600 text-lg">You have no orders.</p>
          ) : (
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Shipping Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userOrders.map((order) => {
                  const product = order.ccBuilderItemDitelsList?.[0] || {};
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition duration-100">
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          #{order.id}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {product.name || order.productname || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {order.quantity || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        ৳{(order.quantity * (product.specialprice || product.regularprice || order.price))?.toLocaleString() || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="text-gray-900">{order.address || "N/A"}</div>
                        <div className="text-xs text-gray-500">
                          {order.upazila}, {order.districts}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {formatDate(order.requestdate)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status || "PENDING"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-800 p-1 transition duration-150"
                          title="View Details"
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      <button
        onClick={() => navigate("/")}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 mt-4 rounded-lg font-medium transition duration-150"
      >
        Back to Home
      </button>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Order Details - #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl transition duration-150"
              >
                ×
              </button>
            </div>

            <div className="p-6 grid gap-6 md:grid-cols-2">
              {/* Product Information */}
              <div className="space-y-3 text-sm">
                <h4 className="font-semibold text-lg text-gray-800">
                  Product Information
                </h4>
                <p>
                  <span className="font-medium">Product ID:</span>{" "}
                  {selectedOrder.productid || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {selectedOrder.ccBuilderItemDitelsList?.[0]?.name || selectedOrder.productname || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Category:</span>{" "}
                  {selectedOrder.ccBuilderItemDitelsList?.[0]?.ccBuilder?.name || "N/A"}
                </p>
              </div>

              {/* Shipping Information */}
              <div className="space-y-3 text-sm">
                <h4 className="font-semibold text-lg text-gray-800">
                  Shipping Information
                </h4>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {selectedOrder.address || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Upazila:</span>{" "}
                  {selectedOrder.upazila || "N/A"}
                </p>
                <p>
                  <span className="font-medium">District:</span>{" "}
                  {selectedOrder.districts || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Order Date:</span>{" "}
                  {formatDate(selectedOrder.requestdate)}
                </p>
              </div>

              {/* Pricing Details */}
              <div className="space-y-3 text-sm">
                <h4 className="font-semibold text-lg text-gray-800">
                  Pricing Details
                </h4>
                <p>
                  <span className="font-medium">Unit Price:</span>{" "}
                  ৳{(selectedOrder.ccBuilderItemDitelsList?.[0]?.specialprice || selectedOrder.ccBuilderItemDitelsList?.[0]?.regularprice || selectedOrder.price)?.toLocaleString() || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Quantity:</span>{" "}
                  {selectedOrder.quantity || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Total Price:</span>{" "}
                  ৳{(selectedOrder.quantity * (selectedOrder.ccBuilderItemDitelsList?.[0]?.specialprice || selectedOrder.ccBuilderItemDitelsList?.[0]?.regularprice || selectedOrder.price))?.toLocaleString() || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status || "PENDING"}
                  </span>
                </p>
              </div>

              {/* Product Specifications */}
              <div className="md:col-span-2 space-y-3 text-sm">
                <h4 className="font-semibold text-lg text-gray-800">
                  Product Specifications
                </h4>
                <p className="text-gray-600">
                  {selectedOrder.ccBuilderItemDitelsList?.[0]?.description || "No description available"}
                </p>
                <p className="text-gray-600">
                  {selectedOrder.ccBuilderItemDitelsList?.[0]?.performance ||
                    selectedOrder.ccBuilderItemDitelsList?.[0]?.ability ||
                    selectedOrder.ccBuilderItemDitelsList?.[0]?.benefits ||
                    selectedOrder.ccBuilderItemDitelsList?.[0]?.moralqualities ||
                    selectedOrder.ccBuilderItemDitelsList?.[0]?.opportunity ||
                    "No specifications available"}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-150"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default UserOrders;