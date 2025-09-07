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

export default function Router() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/builder/:botId" element={isAuthenticated ? <BotBuilder /> : <Navigate to="/" />} />
        <Route path="/commands/:botId" element={isAuthenticated ? <CommandBuilder /> : <Navigate to="/" />} />
        <Route path="/events/:botId" element={isAuthenticated ? <EventBuilder /> : <Navigate to="/" />} />
        <Route path="/settings/:botId" element={isAuthenticated ? <BotSettings /> : <Navigate to="/" />} />
        <Route path="/marketplace" element={isAuthenticated ? <Marketplace /> : <Navigate to="/" />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
