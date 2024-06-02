import { Button, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import React, { FormEvent, useState } from 'react';
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineLock, MdOutlineMailOutline } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import logoLight from '../images/logo_light.png';
import supabase from '../supabaseClient';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const {data, error} = await supabase
      .from('user')
      .insert([
        {
          username: username,
          email: email,
          password: password,
          created_at: new Date(),
        },
      ]);

      if (error) {
        console.error('Error inserting new user:', error);
      } else {
        console.log('User created:', data);
        // Reset form fields after successful submission
        alert('Account created successfully!');
        setUsername('');
        setEmail('');
        setPassword('');
      }
  };

  const handleLogin = () => {
    navigate('/login');
  }

  return (
    <Grid container direction='column'
      style={{
        height: '200vh', width: '100vw'
      }}>
      <Grid item xs={6} style={{ backgroundColor: '#B8DBD9'}}>
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
          <Grid item>
            <img src={logoLight} alt="Logo"
              style={{ width: 100, height: 'auto', marginTop:120 }} />
          </Grid>

          <Typography variant="h4" component="h2" gutterBottom style={{ fontWeight: 'bold', color: '#31363F', fontFamily:   'Tahoma', marginTop: 40}}>
              Welcome Back!
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom style={{color: '#31363F', fontFamily: 'Tahoma', marginTop: 60}}>
            Stay in touch! Sign in with your info.
          </Typography>

          <Button variant="contained" color="primary" style={{ marginTop: 50, width: '15vw', backgroundColor: '#B8DBD9', color: '#31363F', borderRadius: 30, border: '2px solid #31363F', fontWeight: 'bold', fontFamily: 'Tahoma'}} onClick={handleLogin}>
            SIGN IN
          </Button>
        </Grid>
      </Grid>
      
      <Grid item xs={9} style={{backgroundColor: '#202124', padding: 20,}} >
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h4" component="h2" gutterBottom style={{ fontWeight: 'bold', color: '#B8DBD9', fontFamily: 'Tahoma', marginTop: 150}}>
              Create an Account
            </Typography>
          </Grid>

          <form onSubmit={handleSubmit} style={{marginTop: 50}}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  id="username"
                  type="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IoPersonOutline style={{color: '#B8DBD9'}}/>                    
                      </InputAdornment>
                    ),
                    placeholder: 'Username',
                    style: { borderRadius: 10, color: '#B8DBD9', backgroundColor: '#2F4550', fontFamily: 'Tahoma' }
                  }}
                  style={{width:'35vw', borderRadius: 10, color: '#B8DBD9', fontFamily: 'Tahoma'}}
                />
              </Grid>
              
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
                    style: { borderRadius: 10, color: '#B8DBD9', backgroundColor: '#2F4550',fontFamily: 'Tahoma' }
                  }}
                  style={{width:'35vw', borderRadius: 10, color: '#B8DBD9', fontFamily: 'Tahoma'}}
                />
              </Grid>
            </Grid>
            
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: 50, width: '15vw', height: '6vh',  backgroundColor: '#2F4550', color: '#B8DBD9', borderRadius: 30, fontWeight: 'bold', fontFamily: 'Tahoma'}}>
              SIGN UP
            </Button>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Register;