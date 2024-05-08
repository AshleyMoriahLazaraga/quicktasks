import { Button, Grid, InputAdornment, Link, TextField, Typography } from '@mui/material';
import React, { FormEvent, useState } from 'react';
import { MdOutlineLock, MdOutlineMailOutline } from "react-icons/md";
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // For navigation after login
import { useUser } from '../contexts/UserContext'; // Adjust the import path as necessary
import logoDark from '../images/logo_dark.png';
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

  const handleRegister = () => {
    navigate('/register');
  }

  return (
    <Grid container direction="column" style={{ height: '200vh', width: '100vw' }}>
    {/* Left Part */}
    <Grid item xs={9} style={{ backgroundColor: '#202124'}}>
      <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <Grid item>
          <img src={logoDark} alt="Logo" style={{ width: 100, height: 'auto', marginTop:120 }} />
        </Grid>
        <Grid item>
          <Typography variant="h4" component="h2" gutterBottom style={{ fontWeight: 'bold', color: '#fff', fontFamily: 'Tahoma'}}>
            Sign in to QuickTasks
          </Typography>
        </Grid>
        <form onSubmit={handleSubmit} style={{marginTop: 50}}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <TextField
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdOutlineMailOutline  style={{color: '#B8DBD9'}}/>
                    </InputAdornment>
                  ),
                  placeholder: 'Email',
                  style: { borderRadius: 10, color: '#B8DBD9', backgroundColor: '#2F4550', fontFamily: 'Tahoma'}
                }}
                style={{width:'35vw', borderRadius: 10, color: '#B8DBD9', fontFamily: 'Tahoma'}}
              />
            </Grid>
            <Grid item>
              <TextField
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdOutlineLock style={{color: '#B8DBD9'}}/>
                    </InputAdornment>
                  ),
                  placeholder: 'Password',
                  style: { borderRadius: 10, color: '#B8DBD9', backgroundColor: '#2F4550', fontFamily: 'Tahoma' }
                }}
                style={{width:'35vw', borderRadius: 10, color: '#B8DBD9', fontFamily: 'Tahoma'}}
              />
            </Grid>
          </Grid>
          <Grid item style={{marginTop: 20}}>
              <Link component={RouterLink} to="/register" variant="body2" style={{fontFamily:'Tahoma', color: '#B8DBD9'}}>
                Forgot your password
                {/*supposed to be reset password */}
              </Link>
            </Grid>
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: 50, width: '15vw', height: '6vh',  backgroundColor: '#2F4550', color: '#B8DBD9', borderRadius: 30, fontWeight: 'bold', fontSize: '15px', fontFamily: 'Tahoma' }}>
            SIGN IN
          </Button>
        </form>
      </Grid>
    </Grid>
    {/* Right Part */}
    <Grid item xs={6} alignItems="center" justifyContent="center" display={'flex'} style={{ backgroundColor: '#B8DBD9', padding: 20 }}>
      <Grid item justifyItems={'center'}>
        <Typography variant="h4" component="h2" gutterBottom style={{ fontWeight: 'bold', color: '#31363F', fontFamily: 'Tahoma'}}>
              Hello, Friend!
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom style={{color: '#31363F', fontFamily: 'Tahoma'}}>
        Create an account and get started!
        </Typography>
        <Button variant="contained" color="primary" style={{ marginTop: 20, width: '15vw', backgroundColor: '#B8DBD9', color: '#31363F', borderRadius: 30, border: '2px solid #31363F', fontWeight: 'bold', fontFamily: 'Tahoma'}} onClick={handleRegister}>
            SIGN UP
        </Button>
      </Grid>
    </Grid>
  </Grid>
  );
};

export default Login;