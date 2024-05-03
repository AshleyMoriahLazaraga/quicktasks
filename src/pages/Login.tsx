import { Button, Container, Grid, Link, Paper, TextField, Typography } from '@mui/material';
import React, { FormEvent, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // For navigation after login
import { useUser } from '../contexts/UserContext'; // Adjust the import path as necessary
import supabase from '../supabaseClient'; // Make sure this points to your Supabase client initialization

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const { data: userData, error } = await supabase
      .from('user')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error) {
      alert('Login failed: ' + error.message);
      return;
    }

    if (userData) {
      setUser(userData); // Set global user state
      navigate('/home'); // Navigate to the main page
    } else {
      alert('User not found or incorrect password.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={0} style={{ padding: 20, marginTop: 50 }}>
        <Typography variant="h5" component="h2" gutterBottom style={{ fontWeight: 'bold' }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 20 }}>
            Login
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2" style={{ marginTop: 20 }}>
                Don't have an account? Sign up!
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;