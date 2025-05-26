import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/product';
import { Product } from '../types/product';

const AdminProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', publisher: '', price: 0 });
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const { token } = useAuth();

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async () => {
    if (!token) return;
    await createProduct(newProduct, token);
    setNewProduct({ name: '', category: '', publisher: '', price: 0 });
    fetchProducts();
  };

  const handleUpdate = async () => {
    if (!token || !editProduct) return;
    await updateProduct(editProduct.id, editProduct, token);
    setEditProduct(null);
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    await deleteProduct(id, token);
    fetchProducts();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Products
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Add Product</Typography>
        <TextField
          label="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Category"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Publisher"
          value={newProduct.publisher}
          onChange={(e) => setNewProduct({ ...newProduct, publisher: e.target.value })}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Price"
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleCreate}>
          Add
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Publisher</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.publisher}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>
                <Button variant="contained" onClick={() => setEditProduct(product)} sx={{ mr: 1 }}>
                  Edit
                </Button>
                <Button variant="contained" color="error" onClick={() => handleDelete(product.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editProduct && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Edit Product</Typography>
          <TextField
            label="Name"
            value={editProduct.name}
            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Category"
            value={editProduct.category}
            onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Publisher"
            value={editProduct.publisher}
            onChange={(e) => setEditProduct({ ...editProduct, publisher: e.target.value })}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Price"
            type="number"
            value={editProduct.price}
            onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="outlined" onClick={() => setEditProduct(null)} sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AdminProduct;