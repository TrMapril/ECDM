import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Container, Paper, Skeleton } from '@mui/material';
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

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Skeleton variant="text" width={200} height={60} sx={{ mx: 'auto' }} />
      </Box>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <Grid container spacing={3}>
          {[...Array(10)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
              <Box sx={{ width: '100%', maxWidth: 280, mx: 'auto' }}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 1 }} />
                <Skeleton variant="text" height={30} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" height={25} width="60%" sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );

  if (loading) return <LoadingSkeleton />;
  
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper 
          elevation={2} 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)'
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            ⚠️ Lỗi tải dữ liệu
          </Typography>
          <Typography color="text.secondary">
            {error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          SẢN PHẨM
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Khám phá bộ sưu tập sản phẩm chất lượng cao
        </Typography>
      </Box>

      {/* Products Container */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {products.length > 0 ? (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  lg={2.4} // 5 items per row on large screens (12/5 = 2.4)
                  key={product.id}
                >
                  <Box 
                    sx={{ 
                      height: '100%',
                      minHeight: 400,
                      maxWidth: 280,
                      mx: 'auto',
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))'
                      }
                    }}
                  >
                    <ProductCard 
                      product={product} 
                      onAddToCart={() => {}} 
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper 
              elevation={1}
              sx={{ 
                p: 6, 
                textAlign: 'center',
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              <Typography variant="h5" color="text.secondary" gutterBottom>
                📦 Không có sản phẩm
              </Typography>
              <Typography color="text.secondary">
                Hiện tại chưa có sản phẩm nào được hiển thị
              </Typography>
            </Paper>
          )}
        </Box>
      </Paper>

      {/* Stats Section */}
      {products.length > 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Paper 
            elevation={1}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>
              📊 Thống kê
            </Typography>
            <Typography variant="body1">
              Hiển thị <strong>{products.length}</strong> sản phẩm
              {products.length > 5 && (
                <> • <strong>{Math.ceil(products.length / 5)}</strong> hàng</>
              )}
            </Typography>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default Home;