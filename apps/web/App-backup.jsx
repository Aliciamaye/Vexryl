
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
          <span className={dark ? "text-2xl font-bold text-white tracking-wide" : "text-2xl font-bold text-gray-900 tracking-wide"}>Vexryl</span>
        </div>
        <nav className="flex gap-4 md:gap-8 text-base font-medium">
          <a href="#builder" className="nav-link">Builder</a>
          <a href="#marketplace" className="nav-link">Marketplace</a>
          <a href="#docs" className="nav-link">Docs</a>
          <a href="#login" className="nav-link">Login</a>
        </nav>
        <button
          className="ml-4 p-2 rounded focus:outline-none border border-gray-700 bg-neutral-800 text-white hover:bg-neutral-700 transition md:ml-8"
          aria-label="Toggle dark mode"
          onClick={() => setDark((d) => !d)}
        >
          {dark ? "🌙" : "☀️"}
        </button>
      </header>

      {/* Hero Section */}
      <section className={
        "flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-12 md:py-16 gap-8 md:gap-12" +
        (dark ? "" : " bg-light")
      }>
        <div className="max-w-xl">
          <h1 className={dark ? "text-4xl md:text-5xl font-bold text-white mb-6" : "text-4xl md:text-5xl font-bold text-gray-900 mb-6"}>No-Code Discord Bot Builder</h1>
          <p className={dark ? "text-lg text-gray-300 mb-8" : "text-lg text-gray-700 mb-8"}>
            Build powerful Discord bots visually. Drag, drop, and connect blocks to create advanced flows. Try the live demo below!
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => onNavigate('/builder')}
              className="btn-primary"
            >
              Live Demo
            </button>
            <button 
              onClick={() => onNavigate('/auth')}
              className="btn-secondary"
            >
              Get Started
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img src="/assets/builder-preview.png" alt="Vexryl Builder Preview" className="rounded-xl shadow w-full max-w-lg border border-gray-800" />
        </div>
      </section>

      {/* Builder Demo Section */}
      <section id="builder-demo" className="px-4 md:px-8 py-12 md:py-16">
        <h2 className={dark ? "text-3xl font-bold text-white mb-8" : "text-3xl font-bold text-gray-900 mb-8"}>Builder Demo</h2>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <img src="/assets/builder-demo.png" alt="Builder Demo" className="rounded-xl border border-gray-700 w-full" />
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <p className={dark ? "text-gray-300" : "text-gray-700"}>Drag and drop <span className={dark ? "font-semibold text-white" : "font-semibold text-gray-900"}>Options</span>, <span className={dark ? "font-semibold text-white" : "font-semibold text-gray-900"}>Actions</span>, and <span className={dark ? "font-semibold text-white" : "font-semibold text-gray-900"}>Conditions</span> to build your command flow. Connect blocks to create logic, just like in the demo image.</p>
            <ul className={dark ? "list-disc pl-6 text-gray-300" : "list-disc pl-6 text-gray-700"}>
              <li>Advanced message actions</li>
              <li>Role and permission conditions</li>
              <li>Direct messages, embeds, reactions</li>
              <li>Modular, snapshot-based editing</li>
              <li>Marketplace for flows and blocks</li>
              <li>Full Discord event coverage</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Marketplace Preview */}
      <section id="marketplace" className="px-4 md:px-8 py-12 md:py-16">
        <h2 className={dark ? "text-3xl font-bold text-white mb-8" : "text-3xl font-bold text-gray-900 mb-8"}>Marketplace Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <MarketplaceCard name="Welcome Bot" desc="Automated welcome messages and onboarding." dark={dark} />
          <MarketplaceCard name="Reaction Roles" desc="Assign roles via emoji reactions." dark={dark} />
          <MarketplaceCard name="Economy System" desc="Currency, shop, inventory, leaderboard." dark={dark} />
        </div>
      </section>

      {/* Docs & Guides */}
      <section id="docs" className="px-4 md:px-8 py-12 md:py-16">
        <h2 className={dark ? "text-3xl font-bold text-white mb-8" : "text-3xl font-bold text-gray-900 mb-8"}>Documentation & Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DocCard title="Getting Started" desc="Step-by-step guide to building your first bot." dark={dark} />
          <DocCard title="Block Reference" desc="Detailed docs for every block type and input." dark={dark} />
          <DocCard title="API Reference" desc="Full API documentation for advanced users." dark={dark} />
          <DocCard title="Examples" desc="Prebuilt flows and templates to learn from." dark={dark} />
        </div>
      </section>

      {/* Footer */}
      <footer className={
        (dark ? "bg-neutral-900 border-t border-gray-800" : "bg-white border-t border-gray-200") +
        " shadow flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-6 mt-auto"
      }>
        <span className={dark ? "text-gray-400 font-semibold" : "text-gray-600 font-semibold"}>© 2025 Vexryl. All rights reserved.</span>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="https://github.com/Aliciamaye/Vexryl" target="_blank" rel="noopener" className="nav-link">GitHub</a>
          <a href="#privacy" className="nav-link">Privacy</a>
          <a href="#terms" className="nav-link">Terms</a>
        </div>
      </footer>
    </div>
  );
}

function MarketplaceCard({ name, desc, dark }) {
  return (
    <div className={
      (dark ? "bg-neutral-800 border border-gray-700" : "bg-gray-100 border border-gray-300") +
      " marketplace-card rounded-xl p-6 shadow flex flex-col gap-2"
    }>
      <h4 className={dark ? "text-lg font-bold text-white" : "text-lg font-bold text-gray-900"}>{name}</h4>
      <p className={dark ? "text-gray-300" : "text-gray-700"}>{desc}</p>
      <button className="btn-secondary mt-2">Preview</button>
    </div>
  );
}

function DocCard({ title, desc, dark }) {
  return (
    <div className={
      (dark ? "bg-neutral-800 border border-gray-700" : "bg-gray-100 border border-gray-300") +
      " doc-card rounded-xl p-6 shadow flex flex-col gap-2"
    }>
      <h4 className={dark ? "text-lg font-bold text-white" : "text-lg font-bold text-gray-900"}>{title}</h4>
      <p className={dark ? "text-gray-300" : "text-gray-700"}>{desc}</p>
      <button className="btn-primary mt-2">Read Guide</button>
    </div>
  );
}
