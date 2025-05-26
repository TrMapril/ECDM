import { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/product';
import { Product } from '../types/product';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data || []); // Nếu data là undefined, gán mảng rỗng
        setLoading(false);
      } catch (error) {
        console.error('Failed to load products:', error);
        setError('Failed to load products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>;
  if (error) return <Box sx={{ p: 3 }}><Typography color="error">{error}</Typography></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Grid container spacing={2}>
        {products.length > 0 ? (
          products.map((product) => (
            <Grid item key={product.id}>
              <ProductCard product={product} onAddToCart={() => {}} />
            </Grid>
          ))
        ) : (
          <Typography>No products available</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Home;