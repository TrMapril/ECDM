import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          CHÀO MỪNG ĐẾN VỚI CỬA HÀNG SÁCH TRỰC TUYẾN
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/cart">
              Giỏ hàng
            </Button>
            <Button color="inherit" component={Link} to="/orders">
              Đơn hàng
            </Button>
            {user.role === 'admin' && (
              <Button color="inherit" component={Link} to="/admin/products">
                Quản lí
              </Button>
            )}
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;