import { useRef, useEffect, useCallback, useMemo } from 'react';
import { Trash } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCartAsync, updateCartQuantityAsync, clearError } from '../../../store/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { API_BASE_URL } from '../../../store/api';
import debounce from 'lodash.debounce';

export const CartDropdown = ({ isOpen, onClose, position = 'desktop', cartIconRef }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, count, error } = useSelector((state) => state.cart, (prev, next) => {
    // Custom equality check to prevent re-renders
    return prev.items === next.items && prev.count === next.count && prev.error === next.error;
  });
  const { profile, token } = useSelector((state) => state.auth, (prev, next) => {
    return prev.profile?.id === next.profile?.id && prev.token === next.token;
  });

  const containerClasses = position === 'desktop'
    ? 'absolute md:-left-15 right-0 top-8 w-60 md:w-80 bg-white shadow-lg rounded-lg p-2 z-50 text-black'
    : 'fixed bottom-14 left-8 right-8 bg-gray-100 shadow-lg rounded-lg p-2 z-50 text-black max-h-100 overflow-y-auto';

  const imageSize = position === 'desktop' ? 'w-16 h-16' : 'w-12 h-12';
  const fallbackImage = '/images/fallback-image.jpg';

  // Memoize displayed items
  const displayedItems = useMemo(() => items.slice(0, 5), [items]);
  const hasMoreItems = items.length > 5;

  // Debounced quantity update
  const debouncedQuantityChange = useCallback(
    debounce((cartId, productId, quantity) => {
      if (quantity >= 1) {
        if (profile?.id && token && cartId) {
          dispatch(updateCartQuantityAsync({ cartId, quantity }));
        } else {
          dispatch(updateQuantity({ productId, quantity }));
        }
      }
    }, 500),
    [dispatch, profile, token]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        cartIconRef.current &&
        !cartIconRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, cartIconRef]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleRemove = useCallback(
    (cartId, productId, productName, event) => {
      event.stopPropagation();
      if (profile?.id && token && cartId) {
        dispatch(removeFromCartAsync({ cartId, productId, productName }));
      } else {
        dispatch(removeFromCart(productId));
        toast.success(`${productName} removed from cart!`, {
          duration: 2000,
          style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
        });
      }
    },
    [dispatch, profile, token]
  );

  const handleQuantityChange = useCallback(
    (cartId, productId, newQuantity, event) => {
      event.stopPropagation();
      const quantity = parseInt(newQuantity, 10);
      debouncedQuantityChange(cartId, productId, quantity);
    },
    [debouncedQuantityChange]
  );

  const handleItemClick = useCallback(
    (event) => {
      event.stopPropagation();
      onClose();
    },
    [onClose]
  );

  const handleViewCartClick = useCallback(() => {
    onClose();
    navigate('/cart');
  }, [onClose, navigate]);

  if (!isOpen) return null;

  return (
    <div className={containerClasses} ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
      <div className='flex justify-between items-center border-b border-gray-400'>
        <h3 className='text-lg font-semibold'>Cart ({count})</h3>
        <button onClick={onClose} className='p-1 hover:bg-gray-200 rounded-full'>
          <FaTimes className='text-lg cursor-pointer text-gray-600' />
        </button>
      </div>

      {error && <p className='text-red-500 text-center text-sm mt-2'>{error}</p>}

      <div className={`mt-2 ${position === 'desktop' ? 'max-h-90' : ''} overflow-y-auto`}>
        {items.length === 0 ? (
          <p className='text-center text-gray-500'>Your cart is empty</p>
        ) : (
          displayedItems.map((item) => (
            <div
              key={item.productId}
              className='group relative flex items-center justify-between p-2 border-b border-gray-200'
            >
              <Link
                to={`/product/${item.productId}`}
                className='absolute inset-0 z-10'
                onClick={handleItemClick}
              />
              <div className='flex items-center w-full'>
                <img
                  src={item.imagea ? `${API_BASE_URL}/images/${item.imagea}` : fallbackImage}
                  alt={item.name}
                  className={`${imageSize} object-cover rounded`}
                  onError={(e) => (e.target.src = fallbackImage)}
                />
                <div className='flex-1 px-2'>
                  <p className='text-sm font-semibold group-hover:text-blue-600 transition-colors'>
                    {item.name}
                  </p>
                  <div className='flex items-center space-x-2 text-xs text-gray-500'>
                    <span>Tk {item.price}</span>
                    <span>x</span>
                    <input
                      type='number'
                      min='1'
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.cartId, item.productId, e.target.value, e)}
                      className='w-12 border border-gray-300 rounded-sm text-center z-20 relative'
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={(event) => handleRemove(item.cartId, item.productId, item.name, event)}
                className='text-red-500 hover:text-red-700 z-20 relative'
              >
                <Trash className='w-5 cursor-pointer h-5 ml-3' />
              </button>
            </div>
          ))
        )}
        {hasMoreItems && (
          <div className='text-center mt-2'>
            <button
              onClick={handleViewCartClick}
              className='text-blue-600 hover:underline text-sm'
            >
              View all {items.length} items
            </button>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className='p-2'>
          <button
            onClick={handleViewCartClick}
            className='block w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded text-center'
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;