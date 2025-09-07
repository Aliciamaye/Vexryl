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
      set: function(url) {
        if (url.startsWith('/')) {
          window.history.pushState({}, '', url);
          setCurrentPage(url);
        } else {
          originalHref?.set?.call(this, url);
        }
      },
      get: originalHref?.get?.bind(window.location)
    });

    return () => {
      window.location.assign = originalAssign;
      if (originalHref) {
        Object.defineProperty(window.location, 'href', originalHref);
      }
    };
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPage(path);
  };

  // Check if user is logged in (simple demo)
  const isLoggedIn = user || localStorage.getItem('vexryl-token');

  const renderPage = () => {
    switch (currentPage) {
      case '/':
        return <App onNavigate={navigate} />;
      case '/auth':
        return <AuthPage onNavigate={navigate} onLogin={setUser} />;
      case '/dashboard':
        return isLoggedIn ? <Dashboard onNavigate={navigate} /> : <AuthPage onNavigate={navigate} onLogin={setUser} />;
      case '/builder':
        return isLoggedIn ? <BotBuilder onNavigate={navigate} /> : <AuthPage onNavigate={navigate} onLogin={setUser} />;
      case '/command-builder':
        return isLoggedIn ? <CommandBuilder onNavigate={navigate} /> : <AuthPage onNavigate={navigate} onLogin={setUser} />;
      case '/event-builder':
        return isLoggedIn ? <EventBuilder onNavigate={navigate} /> : <AuthPage onNavigate={navigate} onLogin={setUser} />;
      case '/settings':
        return isLoggedIn ? <BotSettings onNavigate={navigate} /> : <AuthPage onNavigate={navigate} onLogin={setUser} />;
      case '/marketplace':
        return <Marketplace onNavigate={navigate} />;
      default:
        return <App onNavigate={navigate} />;
    }
  };

  return <div className="app">{renderPage()}</div>;
}
