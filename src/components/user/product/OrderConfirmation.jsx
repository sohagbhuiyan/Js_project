import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../store/api";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};
  const { user, profile } = useSelector((state) => state.auth);

  if (!order) {
    navigate("/");
    return null;
  }

  // Format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
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

  // Determine items list (productDetailsList, pcForPartAddList, or ccBuilderItemDitelsList)
  const itemsList =
    order.productDetailsList ||
    order.pcForPartAddList ||
    order.ccBuilderItemDitelsList ||
    [];

  // Calculate total price
  const totalPrice = itemsList.reduce((sum, item) => {
    return sum + (item.specialprice || item.regularprice || 0) * (item.quantity || 1);
  }, 0) || 0;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Order Confirmation</h2>
      <p className="text-lg mb-4">Thank you for your order!</p>
      <div className="border p-4 rounded-md bg-gray-50">
        {/* Order Summary */}
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        {order.orderId && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Order ID:</span> {order.orderId}
          </p>
        )}
        <p className="text-sm text-gray-600">
          <span className="font-medium">Order Date:</span> {formatDate(order.requestdate || new Date())}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Status:</span>{' '}
          <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
            {order.status || "PENDING"}
          </span>
        </p>

        {/* Shipping Information */}
        <div className="mt-4">
          <h4 className="text-base font-semibold mb-2">Shipping Information</h4>
          <p className="text-sm text-gray-600">
            <span className="font-medium">District:</span> {order.districts || 'N/A'}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Upazila:</span> {order.upazila || 'N/A'}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Address:</span> {order.address || 'N/A'}
          </p>
        </div>

        {/* Order Items */}
        <div className="mt-6">
          <h4 className="text-base font-semibold mb-2">Order Items</h4>
          {itemsList.length > 0 ? (
            <div className="space-y-4">
              {itemsList.map((item, index) => (
                <div key={index} className="flex gap-4 border-b pb-4">
                  <img
                    src={item.imagea ? `${API_BASE_URL}/images/${item.imagea}` : '/images/fallback-image.jpg'}
                    alt={item.name || "Item"}
                    className="w-20 h-20 object-cover rounded border"
                    onError={(e) => (e.target.src = '/images/fallback-image.jpg')}
                  />
                  <div className="flex-1">
                    <h5 className="font-medium text-sm sm:text-base">{item.name || item.ccBuilder?.name || item.item?.name || 'N/A'}</h5>
                    <p className="text-sm text-gray-600">ID: {item.productid || item.id || 'N/A'}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity || 1}</p>
                    <p className="text-sm text-gray-600">
                      Price: Tk {(item.specialprice || item.regularprice || 0).toFixed(2)}
                    </p>
                    <p className="text-sm font-semibold">
                      Subtotal: Tk {((item.specialprice || item.regularprice || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                    {(item.catagory || item.pcbuilder || item.ccBuilder) && (
                      <p className="text-sm text-gray-600">
                        Category: {(item.catagory || item.pcbuilder || item.ccBuilder)?.name || 'N/A'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No item details available.</p>
          )}
          <p className="text-base font-semibold mt-4">
            Total: Tk {totalPrice.toFixed(2)}
          </p>
        </div>

        {/* User Information */}
        <div className="mt-4">
          <h4 className="text-base font-semibold mb-2">User Information</h4>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Name:</span>{' '}
            {profile?.name || user?.name || 'Guest'}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Email:</span>{' '}
            {profile?.email || user?.email || 'N/A'}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Phone:</span>{' '}
            {profile?.phoneNo || user?.phoneNo || 'Not provided'}
          </p>
        </div>
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