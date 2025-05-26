import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Card, 
  CardContent, 
  Paper, 
  Divider,
  Grid,
  Container,
  Alert,
  Chip
} from '@mui/material';
import { 
  ShoppingCart as CartIcon, 
  Receipt as CheckoutIcon,
  Refresh as RefreshIcon 
} from '@mui/icons-material';
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

  // Calculate total price
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress size={48} />
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <CartIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Giỏ hàng
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />}
            onClick={fetchCart}
            size="large"
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CartIcon sx={{ fontSize: 36, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Giỏ hàng
          </Typography>
          {totalItems > 0 && (
            <Chip 
              label={`${totalItems} items`} 
              color="primary" 
              sx={{ ml: 2 }}
            />
          )}
        </Box>
        <Typography variant="body1" color="text.secondary">
          Review your items and proceed to checkout
        </Typography>
      </Box>

      {!items || items.length === 0 ? (
        // Empty Cart State
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
          <CartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
            Giỏ hàng trống
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Thêm sản phẩm để bắt đầu
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            href="/"
          >
            Tiếp tục mua hàng
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {/* Cart Items Section */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ overflow: 'hidden' }}>
              <Box sx={{ p: 3, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Sản phẩm ({totalItems})
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                {items.map((item, index) => (
                  <Box key={`${item.id}-${item.product_id}`}>
                    <CartItem
                      item={item}
                      token={token!}
                      onUpdate={fetchCart}
                    />
                    {index < items.length - 1 && (
                      <Divider sx={{ my: 2 }} />
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Order Summary Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ position: 'sticky', top: 24 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Tổng giỏ hàng
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tổng ({totalItems})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {totalPrice.toFixed(2)}VND
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Shipping
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Free
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Total
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      ${totalPrice.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<CheckoutIcon />}
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                  sx={{ 
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  Checkout
                </Button>

                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                    🔒 Secure checkout • Free shipping
                  </Typography>
                </Box>
              </CardContent>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;