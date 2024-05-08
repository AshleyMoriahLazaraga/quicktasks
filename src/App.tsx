// App.tsx
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { UserProvider } from './contexts/UserContext'; // Adjust the import path as necessary
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <UserProvider> {/* Wrap routes with UserProvider */}
          <Routes>
            {/* <Route path="/" element={<Login/>} />
            <Route path="/login" element={<Login/>} /> */}
            {/* <Route path="/" element={<Register/>} />
            <Route path="/register" element={<Register/>} /> */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
