import { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import {
  fetchCartItemsAsync,
  removeFromCartAsync,
  updateCartQuantityAsync,
  initializeCart,
  selectCartItems,
  selectCartCount,
  selectCartStatus,
  selectCartError,
} from '../../../store/cartSlice';
import { API_BASE_URL } from '../../../store/api';

const CartPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const status = useSelector(selectCartStatus);
  const error = useSelector(selectCartError);
  const { profile, token } = useSelector(
    (state) => state.auth,
    (prev, next) => prev.profile?.id === next.profile?.id && prev.token === next.token
  );

  useEffect(() => {
    if (profile?.id && profile?.email && token) {
      dispatch(fetchCartItemsAsync());
    } else {
      dispatch(initializeCart({ auth: { profile } }));
    }
  }, [dispatch, profile, token]);

  const handleRemove = useCallback(
    (cartId, productId, productName) => {
      if (profile?.id && token && cartId) {
        dispatch(removeFromCartAsync({ id: cartId, productId, productName }));
      } else {
        dispatch({ type: 'cart/removeFromCart', payload: productId });
        toast.success(`${productName} removed from cart!`, {
          duration: 2000,
          style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
        });
      }
    },
    [dispatch, profile, token]
  );

  const handleQuantityChange = useCallback(
    (cartId, productId, newQuantity) => {
      const quantity = parseInt(newQuantity, 10);
      if (isNaN(quantity) || quantity < 1) return;

      if (profile?.id && token && cartId) {
        dispatch(updateCartQuantityAsync({ id: cartId, quantity }));
      } else {
        dispatch({ type: 'cart/updateQuantity', payload: { productId, quantity } });
        toast.success('Quantity updated!', {
          duration: 2000,
          style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
        });
      }
    },
    [dispatch, profile, token]
  );

  const calculateTotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2),
    [items]
  );

  const handleProceedToCheckout = useCallback(() => {
    if (!profile?.id || !profile?.email || !token) {
      toast.error('Please log in to proceed to checkout.', {
        duration: 2000,
        style: { background: '#EF4444', color: '#FFFFFF', fontWeight: 'bold' },
      });
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty.', {
        duration: 2000,
        style: { background: '#EF4444', color: '#FFFFFF', fontWeight: 'bold' },
      });
      return;
    }

    navigate('/cart-checkout', { state: { cartItems: items, cartTotal: calculateTotal } });
  }, [profile, token, items, calculateTotal, navigate]);



  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Your Cart ({count} items)</h1>

      {status === 'loading' && (
        <p className="text-center text-gray-500 text-sm">Loading cart...</p>
      )}
      {error && <p className="text-red-500 text-center text-sm">{error}</p>}

      {items.length === 0 && status !== 'loading' ? (
        <div className="text-center text-gray-500">
          <p className="text-lg">Your cart is empty.</p>
          <Link
            to="/"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
            aria-label="Continue shopping"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.cartId}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.imagea ? `${API_BASE_URL}/images/${item.imagea}` : fallbackImage}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
              
                />
                <div>
                  <Link
                    to={`/product/${item.productId}`}
                    className="text-lg font-semibold hover:text-blue-600"
                    aria-label={`View ${item.name}`}
                  >
                    {item.name}
                  </Link>
                  <p className="text-gray-600 text-sm">Tk {item.price.toFixed(2)}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-sm">Quantity:</span>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.cartId, item.productId, e.target.value)}
                      className="w-16 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-green-200"
                      aria-label={`Quantity for ${item.name}`}
                      disabled={status === 'loading'}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p className="font-semibold text-sm">
                  Tk {(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemove(item.cartId, item.productId, item.name)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label={`Remove ${item.name} from cart`}
                  disabled={status === 'loading'}
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end mt-6">
            <div className="text-right">
              <p className="text-lg font-semibold">Total: Tk {calculateTotal}</p>
              <button
                onClick={handleProceedToCheckout}
                className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded text-sm font-medium transition-colors"
                aria-label="Proceed to order"
                disabled={status === 'loading'}
              >
                Proceed to order
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-right" toastOptions={{ className: 'text-sm' }} />
    </div>
  );
};

export default CartPage;