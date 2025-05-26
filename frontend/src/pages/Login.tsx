import { useState } from 'react';
import { Box, Typography, TextField, Button, Tabs, Tab } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState(0);
  const { loginUser, registerUser } = useAuth();

  const handleSubmit = async () => {
    try {
      if (tab === 0) {
        await loginUser(email, password);
      } else {
        await registerUser(email, password);
      }
    } catch (error) {
      alert('Error: ' + (error as any).response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {tab === 0 ? 'Login' : 'Register'}
      </Typography>
      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleSubmit} fullWidth sx={{ mt: 2 }}>
        {tab === 0 ? 'Login' : 'Register'}
      </Button>
    </Box>
  );
};

export default Login;