import { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { CartItem as CartItemType } from '../types/cart';
import { updateCartItem, deleteCartItem } from '../services/cart';

interface CartItemProps {
  item: CartItemType;
  token: string;
  onUpdate: () => void;
}

const CartItem = ({ item, token, onUpdate }: CartItemProps) => {
  const [updating, setUpdating] = useState(false);

  // Defensive check - return null if item is invalid
  if (!item || !item.product_id) {
    console.warn('Invalid cart item:', item);
    return null;
  }

  const handleUpdateQuantity = async (quantity: number) => {
    if (quantity < 1 || updating) return;
    
    try {
      setUpdating(true);
      await updateCartItem(item.product_id, quantity, token);
      onUpdate();
    } catch (error) {
      console.error('Error updating cart item:', error);
      alert('Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (updating) return;
    
    try {
      setUpdating(true);
      await deleteCartItem(item.product_id, token);
      onUpdate();
    } catch (error) {
      console.error('Error deleting cart item:', error);
      alert('Failed to delete item');
    } finally {
      setUpdating(false);
    }
  };

  // Safe calculation with fallback values
  const safeQuantity = item.quantity || 0;
  const safePrice = item.price || 0;
  const totalPrice = safeQuantity * safePrice;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, opacity: updating ? 0.6 : 1 }}>
      <Typography sx={{ flexGrow: 1 }}>
        Product ID: {item.product_id} | 
        Quantity: {safeQuantity} | 
        Price: ${totalPrice.toFixed(2)}
      </Typography>
      <TextField
        type="number"
        value={safeQuantity}
        onChange={(e) => {
          const newQuantity = Number(e.target.value);
          if (newQuantity > 0) {
            handleUpdateQuantity(newQuantity);
          }
        }}
        size="small"
        sx={{ width: 80, mr: 2 }}
        disabled={updating}
        inputProps={{ min: 1 }}
      />
      <Button 
        variant="contained" 
        color="error" 
        onClick={handleDelete}
        disabled={updating}
      >
        {updating ? 'Deleting...' : 'Delete'}
      </Button>
    </Box>
  );
};

export default CartItem;