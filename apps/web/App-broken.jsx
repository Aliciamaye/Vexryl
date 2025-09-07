import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow py-4 px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/vexryl-logo.png" alt="Vexryl Logo" className="h-10" />
            <h1 className="text-xl font-bold">Vexryl</h1>
          </div>
          <nav className="flex gap-6">
            <a href="/dashboard" className="hover:text-purple-600">Dashboard</a>
            <a href="/marketplace" className="hover:text-purple-600">Marketplace</a>
            <a href="/docs" className="hover:text-purple-600">Documentation</a>
          </nav>
        </div>
      </header>
      <main className="py-8 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome to Vexryl</h1>
        <p className="text-lg mb-8">
          The most powerful Discord bot builder platform with visual programming.
        </p>
      </main>
    </div>
  );
}

export default App;
      </Routes>
    </Router>
  );
}

export default App;
