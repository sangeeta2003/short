#!/bin/bash

# Start backend server
echo "Starting backend server..."
cd backend
npm install
node server.js &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Start frontend server
echo "Starting frontend server..."
cd ../frontend
npm install
npm start

# If frontend exits, kill backend
kill $BACKEND_PID 