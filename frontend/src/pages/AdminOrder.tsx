import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllOrders } from '../services/order';
import { Order } from '../types/order';

const AdminOrder: React.FC = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || user.role !== 'admin') {
        setError('Admin access required');
        setLoading(false);
        return;
      }
      if (!token) {
        setError('Please log in as admin');
        setLoading(false);
        return;
      }
      try {
        const data = await getAllOrders(token);
        setOrders(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, token]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Customer Orders</h1>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Order ID</th>
            <th className="border border-gray-300 p-2 text-left">User ID</th>
            <th className="border border-gray-300 p-2 text-left">Total Amount</th>
            <th className="border border-gray-300 p-2 text-left">Status</th>
            <th className="border border-gray-300 p-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{order.id}</td>
              <td className="border border-gray-300 p-2">{order.user_id}</td>
              <td className="border border-gray-300 p-2">${order.total_amount.toFixed(2)}</td>
              <td className="border border-gray-300 p-2">{order.status}</td>
              <td className="border border-gray-300 p-2">{new Date(order.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrder;