import { Card, CardContent, Typography, Button } from '@mui/material';
import { Product } from '../types/product';
import { addToCart } from '../services/cart';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { token } = useAuth();

  const handleAddToCart = async () => {
    if (!token) return;
    await addToCart(product.id, 1, token);
    if (onAddToCart) onAddToCart();
  };

  return (
    <Card sx={{ margin: 1, width: 200 }}>
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography>Giá: {product.price}VND</Typography>
        <Typography>Thể loại: {product.category}</Typography>
        <Typography>NXB: {product.publisher}</Typography>
        {onAddToCart && (
          <Button variant="contained" onClick={handleAddToCart} sx={{ mt: 1 }}>
            Thêm vào giỏ
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;