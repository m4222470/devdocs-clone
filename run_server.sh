#!/bin/bash
cd /workspaces/devdocs-clone/sentrixa-template.webflow.io
echo "🚀 Starting local server..."
echo "📍 Server will run at: http://localhost:8000"
echo "🌐 Open your browser and visit: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "════════════════════════════════════════"
python3 -m http.server 8000
