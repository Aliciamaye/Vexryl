import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Builders from './pages/Builders';
import Marketplace from './pages/Marketplace';
import Tutorial from './pages/Tutorial';
import './styles/main.css';
import './styles/login.css';
import './styles/dashboard.css';
import './styles/builders.css';

const App = () => (
  <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder" element={<Builders />} />
  <Route path="/marketplace" element={<Marketplace />} />
  <Route path="/tutorial" element={<Tutorial />} />
      </Routes>
  </Router>
);

export default App;
