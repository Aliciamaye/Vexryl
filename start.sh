#!/bin/bash

echo "🚀 Starting Vexryl Platform..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd apps/web && npm install --legacy-peer-deps
cd ../api && npm install
cd ../..

echo ""
echo "✅ Dependencies installed!"
echo ""

# Start both services
echo "🌐 Starting API server on http://localhost:3001..."
echo "🎨 Starting web app on http://localhost:3000..."
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Run both in parallel
npm run dev
