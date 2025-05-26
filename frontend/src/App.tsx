import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminProduct from './pages/AdminProduct';

function App() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
        <Route
          path="/admin/products"
          element={user && user.role === 'admin' ? <AdminProduct /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;