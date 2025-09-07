import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx";
import AuthPage from "./AuthPage.jsx";
import Dashboard from "./Dashboard.jsx";
import CommandBuilder from "./CommandBuilder.jsx";
import EventBuilder from "./EventBuilder.jsx";
import BotSettings from "./BotSettings.jsx";
import Marketplace from "./Marketplace.jsx";
import BotBuilder from "./components/BotBuilder.jsx";
import DocsPage from "./DocsPage.jsx";
import { useAuth } from "./hooks/useAuth.js";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return user ? children : <Navigate to="/auth" />;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
};

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicRoute><App /></PublicRoute>} />
        <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
        <Route path="/docs" element={<DocsPage />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/builder/:botId" element={<ProtectedRoute><BotBuilder /></ProtectedRoute>} />
        <Route path="/commands/:botId" element={<ProtectedRoute><CommandBuilder /></ProtectedRoute>} />
        <Route path="/events/:botId" element={<ProtectedRoute><EventBuilder /></ProtectedRoute>} />
        <Route path="/settings/:botId" element={<ProtectedRoute><BotSettings /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
