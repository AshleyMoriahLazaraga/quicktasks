// App.tsx
import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Home from './pages/Home';
import { UserProvider } from './contexts/UserContext'; // Adjust the import path as necessary

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
            <Route path="/" element={<Register />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
