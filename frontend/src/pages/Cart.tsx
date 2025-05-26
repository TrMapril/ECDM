import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import CartItem from '../components/CartItem';
import { useAuth } from '../context/AuthContext';
import { getCart, clearCart } from '../services/cart';
import { createOrder } from '../services/order';
import { CartItem as CartItemType } from '../types/cart';

const Cart = () => {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchCart = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      setError(null);
      const data = await getCart(token);
      console.log('Fetched cart data:', data); // Debug log
      
      // Đảm bảo data là array
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        console.warn('Cart data is not an array:', data);
        setItems([]);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart');
      setItems([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const handleCheckout = async () => {
    if (!token || items.length === 0) return;
    
    try {
      const orderItems = items.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }));
      
      await createOrder(orderItems, token);
      await clearCart(token);
      await fetchCart(); // Refresh cart after checkout
      alert('Order created successfully');
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to create order');
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Cart
        </Typography>
        <Typography color="error">{error}</Typography>
        <Button onClick={fetchCart} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cart
      </Typography>
      
      {!items || items.length === 0 ? (
        <Typography>Your cart is empty</Typography>
      ) : (
        <>
          {items.map((item) => (
            <CartItem 
              key={`${item.id}-${item.product_id}`} // Better key in case of duplicates
              item={item} 
              token={token!} 
              onUpdate={fetchCart} 
            />
          ))}
          <Button 
            variant="contained" 
            onClick={handleCheckout} 
            sx={{ mt: 2 }}
            disabled={items.length === 0}
          >
            Checkout ({items.length} items)
          </Button>
        </>
      )}
    </Box>
  );
};

export default Cart;