import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CartItem from '../components/CartItem';
import { useAuth } from '../context/AuthContext';
import { getCart, clearCart } from '../services/cart';
import { createOrder } from '../services/order';
import { CartItem as CartItemType } from '../types/cart';

const Cart = () => {
  const [items, setItems] = useState<CartItemType[]>([]);
  const { token } = useAuth();

  const fetchCart = async () => {
    if (!token) return;
    const data = await getCart(token);
    setItems(data);
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const handleCheckout = async () => {
    if (!token) return;
    const orderItems = items.map((item) => ({
      productId: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));
    await createOrder(orderItems, token);
    await clearCart(token);
    fetchCart();
    alert('Order created successfully');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cart
      </Typography>
      {items.length === 0 ? (
        <Typography>Your cart is empty</Typography>
      ) : (
        <>
          {items.map((item) => (
            <CartItem key={item.id} item={item} token={token!} onUpdate={fetchCart} />
          ))}
          <Button variant="contained" onClick={handleCheckout} sx={{ mt: 2 }}>
            Checkout
          </Button>
        </>
      )}
    </Box>
  );
};

export default Cart;