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

// import { useLocation, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { API_BASE_URL } from '../../../store/api';

// const OrderConfirmation = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, profile } = useSelector((state) => state.auth);
//   const order = location.state?.order || {};

//   // Redirect to home if no order data
//   if (!order || !order.id) {
//     navigate('/');
//     return null;
//   }

//   // Format date
//   const formatDate = (dateString) => {
//     try {
//       return new Date(dateString).toLocaleString('en-US', {
//         dateStyle: 'medium',
//         timeStyle: 'short',
//       });
//     } catch {
//       return 'Invalid Date';
//     }
//   };

//   // Get status color
//   const getStatusColor = (status) => {
//     switch (status?.toUpperCase()) {
//       case 'PENDING':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'PROCESSING':
//         return 'bg-blue-100 text-blue-800';
//       case 'SHIPPED':
//         return 'bg-purple-100 text-purple-800';
//       case 'DELIVERED':
//         return 'bg-green-100 text-green-800';
//       case 'CANCELLED':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="p-4 sm:p-8 max-w-5xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6 text-green-600">Order Confirmed!</h2>
//       <p className="text-lg mb-4">Thank you for your order! We've received your request and will process it soon.</p>
//       <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
//         <h3 className="text-lg font-semibold mb-4">Order Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Order Information */}
//           <div>
//             <h4 className="text-base font-semibold mb-2">Order Summary</h4>
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">Order ID:</span> {order.id || 'N/A'}
//             </p>
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">Order Date:</span> {formatDate(order.requestdate)}
//             </p>
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">Status:</span>{' '}
//               <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
//                 {order.status || 'PENDING'}
//               </span>
//             </p>
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">Total:</span> Tk {order.price?.toFixed(2) || '0.00'}
//             </p>
//           </div>

//           {/* Customer Information */}
//           <div>
//             <h4 className="text-base font-semibold mb-2">Customer Information</h4>
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">Name:</span>{' '}
//               {order.user?.name || order.name || profile?.name || 'Guest'}
//             </p>
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">Email:</span>{' '}
//               {order.user?.email || order.email || profile?.email || 'N/A'}
//             </p>
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">Phone:</span>{' '}
//               {order.user?.phoneNo || order.phoneNo || profile?.phoneNo || 'Not provided'}
//             </p>
//           </div>

//           {/* Shipping Information */}
//           <div>
//             <h4 className="text-base font-semibold mb-2">Shipping Information</h4>
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">District:</span> {order.districts || 'N/A'}
//             </p>
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">Upazila:</span> {order.upazila || 'N/A'}
//             </p>
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">Address:</span> {order.address || 'N/A'}
//             </p>
//           </div>
//         </div>

//         {/* Order Items */}
//         <div className="mt-6">
//           <h4 className="text-base font-semibold mb-2">Order Items</h4>
//           {order.items && order.items.length > 0 ? (
//             <div className="space-y-4">
//               {order.items.map((item) => (
//                 <div key={`${item.type}-${item.productid}`} className="flex gap-4 border-b pb-4">
//                   <img
//                     src={
//                       item.productDetails?.imagea
//                         ? `${API_BASE_URL}/images/${item.productDetails.imagea}`
//                         : '/images/fallback-image.jpg'
//                     }
//                     alt={item.productname}
//                     className="w-20 h-20 object-cover rounded border"
//                     onError={(e) => (e.target.src = '/images/fallback-image.jpg')}
//                   />
//                   <div className="flex-1">
//                     <h5 className="font-medium text-sm sm:text-base">{item.productname}</h5>
//                     <p className="text-sm text-gray-600">Type: {item.type || 'ProductDetails'}</p>
//                     <p className="text-sm text-gray-600">Product ID: {item.productid}</p>
//                     <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                     <p className="text-sm text-gray-600">
//                       Price: Tk {(item.productDetails?.specialprice || item.productDetails?.regularprice || 0).toFixed(2)}
//                     </p>
//                     <p className="text-sm font-semibold">
//                       Subtotal: Tk {((item.productDetails?.specialprice || item.productDetails?.regularprice || 0) * item.quantity).toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-sm text-gray-600">No item details available.</p>
//           )}
//         </div>
//       </div>

//       <div className="mt-6 flex justify-end gap-4">
//         <button
//           className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 text-sm font-medium"
//           onClick={() => navigate('/')}
//           aria-label="Back to Home"
//         >
//           Back to Home
//         </button>
//         <button
//           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
//           onClick={() => navigate('/view-orders')}
//           aria-label="View Orders"
//         >
//           View Orders
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderConfirmation;