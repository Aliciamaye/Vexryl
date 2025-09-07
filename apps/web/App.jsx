import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import AuthPage from "./AuthPage";
import Dashboard from "./Dashboard";
import Marketplace from "./Marketplace";
import DocsPage from "./DocsPage";
import LoadingSpinner from "./components/LoadingSpinner";
import ToastContainer from "./components/ToastContainer";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading Vexryl..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
        />
        <Route 
          path="/dashboard/*" 
          element={user ? <Dashboard /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/marketplace" 
          element={user ? <Marketplace /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/docs" 
          element={<DocsPage />} 
        />
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />} 
        />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
