#!/bin/bash

echo "Stopping any running backend server..."
pkill -f "node server.js"

echo "Starting backend server..."
cd backend
node server.js 