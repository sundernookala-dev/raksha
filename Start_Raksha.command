#!/bin/bash
# Double-click this file to start Raksha

# Kill anything already on these ports
lsof -ti:3002 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

cd ~/raksha

# Start proxy in background
node proxy.cjs &
echo "✅ Proxy started on port 3002"

sleep 2

# Serve frontend
echo "✅ Opening Raksha..."
npx serve . -p 3001 &

sleep 3
open "http://localhost:3001"

echo ""
echo "🛡️  Raksha is running at http://localhost:3001"
echo "   Press Ctrl+C to stop"
wait
