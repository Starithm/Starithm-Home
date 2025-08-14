#!/bin/bash

echo "🔍 Checking Starithm Frontend Services Status..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "✅ Port $1 is running"
        return 0
    else
        echo "❌ Port $1 is not running"
        return 1
    fi
}

echo ""
echo "📊 Service Status:"
echo "=================="

# Check each service
check_port 3000 && echo "   Shell Application: http://localhost:3000"
check_port 3001 && echo "   Shell Application (alt): http://localhost:3001"
check_port 5173 && echo "   Home Microfrontend: http://localhost:5173"
check_port 5174 && echo "   Home Microfrontend (alt): http://localhost:5174"
check_port 5175 && echo "   NovaTrace Microfrontend: http://localhost:5175"

echo ""
echo "🎯 Access Points:"
echo "=================="
echo "• Main Application: http://localhost:3000"
echo "• Home Page: http://localhost:3000/"
echo "• NovaTrace: http://localhost:3000/novatrace"
echo "• Direct Home: http://localhost:5173 (or 5174)"
echo "• Direct NovaTrace: http://localhost:5175"
