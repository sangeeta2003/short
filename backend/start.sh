#!/bin/bash
echo "Starting backend server..."
cd "$(dirname "$0")"
npm install
node server.js 