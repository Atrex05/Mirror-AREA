#!/bin/bash

echo "Testing /login route with correct credentials..."
response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"username":"user", "password":"password"}' http://localhost:8080/login)
if [ "$response" == "Login successful" ]; then
  echo "/login test passed with correct credentials."
else
  echo "/login test failed with correct credentials. Response: $response"
fi

echo "Testing /login route with incorrect credentials..."
response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"username":"user", "password":"wrongpassword"}' http://localhost:8080/login)
if [ "$response" == "Invalid credentials" ]; then
  echo "/login test passed with incorrect credentials."
else
  echo "/login test failed with incorrect credentials. Response: $response"
fi

echo "Testing /hello route..."
response=$(curl -s -X GET http://localhost:8080/hello)
if [ "$response" == "Hello, World!" ]; then
  echo "/hello test passed."
else
  echo "/hello test failed. Response: $response"
fi
