import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiPrinter, FiEye, FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../../../store/orderSlice";
import toast, { Toaster } from "react-hot-toast";
import { FaPhoneAlt } from "react-icons/fa";
import Barcode from 'react-barcode';


const OrderManagement = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const orderState = useSelector((state) => state.order) || {};
  const { orders = [], loading = false, error = null } = orderState;

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (order.id?.toString().toLowerCase().includes(searchLower) ||
        order.productDetails?.name?.toLowerCase().includes(searchLower) ||
        order.productDetails?.productid?.toLowerCase().includes(searchLower) ||
        order.productDetails?.category?.name?.toLowerCase().includes(searchLower) ||
        order.user?.name?.toLowerCase().includes(searchLower) ||
        order.user?.email?.toLowerCase().includes(searchLower)) &&
      (statusFilter === "all" || order.status === statusFilter)
    );
  });

  const handleStatusChange = (orderId, newStatus) => {
    if (window.confirm(`Change order #${orderId} status to ${newStatus}?`)) {
      dispatch(updateOrderStatus({ orderId, status: newStatus }))
        .unwrap()
        .then(() => {
          toast.success(`Order #${orderId} status successfully updated to ${newStatus}`, {
            duration: 3000,
            style: {
              background: "#10B981",
              color: "#FFFFFF",
              fontWeight: "bold",
            },
          });
        })
        .catch((error) => {
          toast.error(`Failed to update status: ${error}`, {
            duration: 4000,
            style: {
              background: "#EF4444",
              color: "#FFFFFF",
              fontWeight: "bold",
            },
          });
          console.error("Status update failed:", error);
        });
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <div className="text-center py-4">Loading orders...</div>;
  if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>;

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>

      {/* Total Orders Card */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6 w-full md:w-1/3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-semibold mt-1">{orders.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <FiShoppingCart className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="w-xl pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Search by Order ID, Category, Customer, or Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-400" />
          <select
            className="border cursor-pointer rounded-md px-3 py-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full divide-y divide-gray-400">
          <thead className="bg-gray-200 text-gray-900">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shipping Address</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Date</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-2 py-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    #{order.id}
                  </button>
                </td>
                <td className="px-2 py-4">
                  <div className="text-sm font-medium text-gray-900">{order.user?.name || "Guest"}</div>
               {order.user?.phoneNo && (
                    <div className="text-xs flex text-gray-500"><FaPhoneAlt className=" h-3 w-3 mt-1 mr-1"/>
                      {order.user.phoneNo}
                    </div>
                  )}
                </td>
                <td className="w-36 px-2 py-4">{order.productDetails?.name}</td>
     
                <td className="px-2 py-4">{order.quantity}</td>
                <td className="px-2 py-4">৳{(order.productDetails?.specialprice || order.productDetails?.regularprice)?.toLocaleString()}</td>
                <td className="px-2 py-4">
                  ৳{(order.quantity * (order.productDetails?.specialprice || order.productDetails?.regularprice))?.toLocaleString()}
                </td>
                <td className="px-2 py-4 w-36">
                  <div className="text-sm">{order.address}</div>
                  <div className="text-xs text-gray-500">{order.upazila}, {order.districts}</div>
                </td>
                <td className="px-2 py-4">{formatDate(order.requestdate)}</td>
                <td className="px-2 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
                    {order.status || "pending"}
                  </span>
                </td>
                <td className="px-2 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    <select
                      value={order.status || "pending"}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="pending" className="cursor-pointer">pending</option>
                      <option value="Processing" className="cursor-pointer">Processing</option>
                      <option value="Shipped" className="cursor-pointer">Shipped</option>
                      <option value="Delivered" className="cursor-pointer">Delivered</option>
                      <option value="Cancelled" className="cursor-pointer">Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
 {selectedOrder && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-auto print:max-h-screen print:overflow-visible print:shadow-none print:rounded-none">
      {/* Header */}
      <div className="px-6 py-4 border-b flex flex-col md:flex-row justify-between">
        {/* Customer Info */}
        <div className="text-sm space-y-1">
          <h3 className="text-xl font-semibold">Customer Information</h3>
          <p><span className="font-medium">Name:</span> {selectedOrder.user?.name || "Guest"}</p>
          <p><span className="font-medium">Email:</span> {selectedOrder.user?.email}</p>
          <p><span className="font-medium">Phone:</span> {selectedOrder.user?.phoneNo || "N/A"}</p>
          <p><span className="font-medium">Address:</span> {selectedOrder.address}, {selectedOrder.upazila}, {selectedOrder.districts}</p>
        </div>

        {/* Shop Info */}
        <div className="text-right text-sm space-y-1">
          <h3 className="text-xl font-semibold">JS Computer</h3>
          <p>Invoice No: <span className="font-medium">{`JC${new Date().getFullYear()}${new Date().getMonth()+1}${new Date().getDate()}${selectedOrder.id}`}</span></p>
   
          <div className="mt-2">
            <Barcode value={`JC-${selectedOrder.id}`} height={30} width={1.5} fontSize={12} />
          </div>
        </div>
      </div>

      {/* Order Body */}
      <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Product Info */}
        <div className="space-y-2 text-sm">
          <h4 className="font-bold text-lg">Product Information</h4>
          <p><span className="font-medium">Product ID:</span> {selectedOrder.productDetails?.productid}</p>
          <p><span className="font-medium">Name:</span> {selectedOrder.productDetails?.name}</p>
          <p><span className="font-medium">Category:</span> {selectedOrder.productDetails?.catagory?.name || "N/A"}</p>
          <p><span className="font-medium">Specification:</span> {selectedOrder.productDetails?.specification}</p>
        </div>

        {/* Pricing Info */}
        <div className="space-y-2 text-sm">
          <h4 className="font-bold text-lg">Pricing Details</h4>
          <p><span className="font-medium">Unit Price:</span> ৳{(selectedOrder.productDetails?.specialprice || selectedOrder.productDetails?.regularprice)?.toLocaleString()}</p>
          <p><span className="font-medium">Quantity:</span> {selectedOrder.quantity}</p>
          <p><span className="font-medium">Total Price:</span> ৳{(selectedOrder.quantity * (selectedOrder.productDetails?.specialprice || selectedOrder.productDetails?.regularprice))?.toLocaleString()}</p>
          <p><span className="font-medium">Status:</span> <span className={`px-2 py-1 rounded text-sm ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status || "Pending"}</span></p>
        </div>

        {/* Product Details */}
        <div className="md:col-span-2 space-y-2 mt-4">
          <h4 className="font-medium text-lg">Product Details</h4>
          <p className="text-gray-700 whitespace-pre-line">{selectedOrder.productDetails?.details}</p>
        </div>

        {/* Price Comparison */}
        <div className="md:col-span-2">
          <div className="border-t pt-4 text-sm">
            <div className="flex justify-between mb-1">
              <span>Regular Price:</span>
              <span>৳{selectedOrder.productDetails?.regularprice?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Special Price:</span>
              <span>৳{(selectedOrder.productDetails?.specialprice || selectedOrder.productDetails?.regularprice)?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Total Paid:</span>
              <span>৳{(selectedOrder.quantity * (selectedOrder.productDetails?.specialprice || selectedOrder.productDetails?.regularprice))?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 border-t flex justify-end gap-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <FiPrinter className="w-5 h-5" />
          Print Invoice
        </button>
        <button
          onClick={() => setSelectedOrder(null)}
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
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

export default OrderManagement;
