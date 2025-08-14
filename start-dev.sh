#!/bin/bash

echo "🚀 Starting Starithm Frontend Development Environment..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Check ports
echo "🔍 Checking ports..."
check_port 3000 || exit 1
check_port 5173 || exit 1
check_port 5175 || exit 1

echo "✅ All ports are available"

# Start all services
echo "📦 Starting all microfrontends..."
npm run dev:all
