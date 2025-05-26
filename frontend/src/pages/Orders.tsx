import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getOrders, getOrderDetails } from '../services/order';
import { Order, OrderItem } from '../types/order';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetails, setOrderDetails] = useState<{ order: Order; items: OrderItem[] } | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      const data = await getOrders(token);
      setOrders(data);
    };
    fetchOrders();
  }, [token]);

  const handleViewDetails = async (orderId: number) => {
    if (!token) return;
    const data = await getOrderDetails(orderId, token);
    setOrderDetails(data);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>${order.total_amount}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
              <TableCell>
                <Button variant="contained" onClick={() => handleViewDetails(order.id)}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {orderDetails && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5">Order Details</Typography>
          <Typography>ID: {orderDetails.order.id}</Typography>
          <Typography>Total: ${orderDetails.order.total_amount}</Typography>
          <Typography>Status: {orderDetails.order.status}</Typography>
          <Typography>Items:</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product ID</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetails.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product_id}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default Orders;