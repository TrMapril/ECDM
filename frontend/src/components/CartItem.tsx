import { Box, Typography, Button, TextField } from '@mui/material';
import { CartItem as CartItemType } from '../types/cart';
import { updateCartItem, deleteCartItem } from '../services/cart';

interface CartItemProps {
  item: CartItemType;
  token: string;
  onUpdate: () => void;
}

const CartItem = ({ item, token, onUpdate }: CartItemProps) => {
  const handleUpdateQuantity = async (quantity: number) => {
    if (quantity < 1) return;
    await updateCartItem(item.product_id, quantity, token);
    onUpdate();
  };

  const handleDelete = async () => {
    await deleteCartItem(item.product_id, token);
    onUpdate();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Typography sx={{ flexGrow: 1 }}>
        Product ID: {item.product_id} | Quantity: {item.quantity} | Price: ${item.quantity * item.price}
      </Typography>
      <TextField
        type="number"
        value={item.quantity}
        onChange={(e) => handleUpdateQuantity(Number(e.target.value))}
        size="small"
        sx={{ width: 60, mr: 2 }}
      />
      <Button variant="contained" color="error" onClick={handleDelete}>
        Delete
      </Button>
    </Box>
  );
};

export default CartItem;