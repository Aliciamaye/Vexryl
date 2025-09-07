import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./AuthPage";
import Dashboard from "./Dashboard";
import BotBuilder from "./components/BotBuilder";
import CommandBuilder from "./CommandBuilder";
import EventBuilder from "./EventBuilder";
import Marketplace from "./Marketplace";
import DocsPage from "./DocsPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  if (!isAuthenticated) {
    return <AuthPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder/:botId" element={<BotBuilder />} />
        <Route path="/commands/:botId" element={<CommandBuilder />} />
        <Route path="/events/:botId" element={<EventBuilder />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/docs" element={<DocsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
