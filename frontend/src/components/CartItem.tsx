import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Alert,
  Snackbar,
  Skeleton
} from '@mui/material';
import { 
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ProductIcon
} from '@mui/icons-material';
import { CartItem as CartItemType } from '../types/cart';
import { updateCartItem, deleteCartItem } from '../services/cart';
import { getProductById, getProductByIdCached } from '../services/product'; // You'll need to create this

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
}

interface CartItemProps {
  item: CartItemType;
  token: string;
  onUpdate: () => void;
}

const CartItem = ({ item, token, onUpdate }: CartItemProps) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  // Defensive check - return null if item is invalid
  if (!item || typeof item.product_id !== 'number') {
    console.error('Invalid or missing product_id in cart item:', item);
    return null;
  }

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoadingProduct(true);
    const productData = await getProductByIdCached(item.product_id, token);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product details:', error);
        // Use fallback data
        setProduct({
          id: item.product_id,
          name: `Product #${item.product_id}`,
          description: 'Product details unavailable',
          price: item.price || 0
        });
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProductDetails();
  }, [item.product_id, token]);

  const handleUpdateQuantity = async (quantity: number) => {
    if (quantity < 1 || updating) return;
    
    try {
      setUpdating(true);
      setError(null);
      await updateCartItem(item.product_id, quantity, token);
      onUpdate();
    } catch (error) {
      console.error('Error updating cart item:', error);
      setError('Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (updating) return;
    
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to remove this item from your cart?')) {
      return;
    }
    
    try {
      setUpdating(true);
      setError(null);
      await deleteCartItem(item.product_id, token);
      onUpdate();
    } catch (error) {
      console.error('Error deleting cart item:', error);
      setError('Failed to delete item');
    } finally {
      setUpdating(false);
    }
  };

  const handleIncrement = () => {
    handleUpdateQuantity(safeQuantity + 1);
  };

  const handleDecrement = () => {
    if (safeQuantity > 1) {
      handleUpdateQuantity(safeQuantity - 1);
    }
  };

  // Safe calculation with fallback values
  const safeQuantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
  // Use product price if available, fallback to cart item price
  const safePrice = product?.price || item.price || 0;
  const totalPrice = safeQuantity * safePrice;

  return (
    <>
      <Card 
        elevation={0} 
        sx={{ 
          border: '1px solid',
          borderColor: 'divider',
          opacity: updating ? 0.6 : 1,
          transition: 'opacity 0.2s ease',
          '&:hover': {
            boxShadow: 1
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            {/* Product Image */}
            <Grid item xs={12} sm={3} md={2}>
              <Box
                sx={{
                  width: { xs: '100%', sm: 80 },
                  height: 80,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: { xs: 'auto', sm: 0 },
                  overflow: 'hidden'
                }}
              >
                {product?.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                ) : (
                  <ProductIcon sx={{ fontSize: 32, color: 'grey.400' }} />
                )}
              </Box>
            </Grid>

            {/* Product Info */}
            <Grid item xs={12} sm={5} md={6}>
              <Box>
                {loadingProduct ? (
                  <>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="rectangular" width={100} height={24} sx={{ mt: 1 }} />
                  </>
                ) : (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {product?.name || `Product #${item.product_id}`}
                    </Typography>
                    {product?.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {product.description}
                      </Typography>
                    )}
                    {product?.category && (
                      <Chip 
                        label={product.category} 
                        size="small" 
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    )}
                    <Chip 
                      label={`$${Number(safePrice).toFixed(2)} VND`} 
                      size="small" 
                      variant="outlined"
                      color="primary"
                    />
                  </>
                )}
              </Box>
            </Grid>

            {/* Quantity Controls */}
            <Grid item xs={12} sm={2} md={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' } , mt: 2}}>
                <IconButton 
                  size="small" 
                  onClick={handleDecrement}
                  disabled={updating || safeQuantity <= 1 || loadingProduct}
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mx: 2, 
                    minWidth: 30, 
                    textAlign: 'center',
                    fontWeight: 600
                  }}
                >
                  {safeQuantity}
                </Typography>
                
                <IconButton 
                  size="small" 
                  onClick={handleIncrement}
                  disabled={updating || loadingProduct}
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>

            {/* Price and Actions */}
            <Grid item xs={12} sm={2} md={2}>
              <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
                {loadingProduct ? (
                  <Skeleton variant="text" width={80} height={32} sx={{ mx: 'auto' }} />
                ) : (
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 1, textAlign: 'right', overflowWrap: 'break-word' }}>
                    {Number(totalPrice).toFixed(2)}
                  </Typography>
                )}
                <IconButton
                  color="error"
                  onClick={handleDelete}
                  disabled={updating || loadingProduct}
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'error.main',
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'error.50'
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          </Grid>

          {/* Loading indicator */}
          {updating && (
            <Box sx={{ mt: 2 }}>
              <Divider />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                Updating...
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error" 
          variant="filled"
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CartItem;