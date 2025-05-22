import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  if (!order) {
    navigate("/");
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
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

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Order Confirmation</h2>
      <p className="text-lg mb-4">Thank you for your order!</p>
      <div className="border p-4 rounded-md bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Order Details</h3>
        {order.orderId && <p><strong>Order ID:</strong> {order.orderId}</p>}
        <p><strong>Product:</strong> {order.productname}</p>
        <p><strong>Quantity:</strong> {order.quantity}</p>
        <p><strong>Unit Price:</strong> Tk {order.productDetails.specialprice || order.productDetails.regularprice}</p>
        <p><strong>Total Price:</strong> Tk {(order.productDetails.specialprice || order.productDetails.regularprice) * order.quantity}</p>
        <p><strong>Shipping Address:</strong> {order.address}, {order.upazila}, {order.districts}</p>
        <p><strong>Order Date:</strong> {new Date(order.requestDate).toLocaleString()}</p>
        <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>{order.status || "Pending"}</span></p>
        {order.user && (
          <div className="mt-4">
            <h4 className="text-md font-semibold">User Information</h4>
            <p><strong>Name:</strong> {order.user.name}</p>
            <p><strong>Email:</strong> {order.user.email}</p>
            <p><strong>Phone:</strong> {order.user.phoneNo}</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={() => navigate("/view-orders")}
        >
          View Orders
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
