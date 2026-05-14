import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

// Setup axios interceptor for JWT token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function AppContent() {
  const { user, loading, logout } = useContext(AuthContext);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <header style={{ backgroundColor: '#1976d2', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>BuzzCircle</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {user ? (
              <>
                <span style={{ alignSelf: 'center' }}>Welcome, {user.username}!</span>
                <button 
                  onClick={logout} 
                  style={{ backgroundColor: 'white', color: '#1976d2', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <button style={{ backgroundColor: 'white', color: '#1976d2', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Login
                  </button>
                </Link>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  <button style={{ backgroundColor: 'white', color: '#1976d2', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </header>

        <main style={{ padding: '1.5rem' }}>
          <Routes>
            <Route 
              path="/login" 
              element={<Login onLoginSuccess={() => {}} />} 
            />
            <Route 
              path="/signup" 
              element={<Signup />} 
            />
            <Route 
              path="/" 
              element={user ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
