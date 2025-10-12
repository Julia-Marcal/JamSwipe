import { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import SwipeCard from './components/SwipeCard.jsx';
import History from './components/History.jsx';
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [view, setView] = useState('login'); // 'login', 'register', 'swipe', 'history'

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setView('swipe');
    }
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setView('swipe');
  };

  const handleRegister = (newToken) => {
    setToken(newToken);
    setView('swipe');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setView('login');
  };

  const handleViewHistory = () => {
    setView('history');
  };

  const handleBackToSwipe = () => {
    setView('swipe');
  };

  const handleSwitchToRegister = () => {
    setView('register');
  };

  const handleSwitchToLogin = () => {
    setView('login');
  };

  if (view === 'login') {
    return <Login onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />;
  }

  if (view === 'register') {
    return <Register onRegister={handleRegister} onSwitchToLogin={handleSwitchToLogin} />;
  }

  if (view === 'history') {
    return <History token={token} onBack={handleBackToSwipe} />;
  }

  return <SwipeCard token={token} onLogout={handleLogout} onViewHistory={handleViewHistory} />;
}

export default App;

