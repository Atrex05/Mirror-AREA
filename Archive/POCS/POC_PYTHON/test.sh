#!/bin/bash

response1=$(curl -s -X POST http://127.0.0.1:8000/accounts/login/ -H "Content-Type: application/json" -d '{"username": "testuser", "password": "testtesttest"}')
expected_output1='{"message": "Login successful"}'

if [ "$response1" == "$expected_output1" ]; then
    echo "First test passed"
else
    echo "First test failed: $response1"
fi

response2=$(curl -s -X POST http://127.0.0.1:8000/accounts/login/ -H "Content-Type: application/json" -d '{"username": "luan", "password": "passwword"}')
expected_output2='{"message": "Invalid credentials"}'

if [ "$response2" == "$expected_output2" ]; then
    echo "Second test passed"
else
    echo "Second test failed: $response2"
fi
