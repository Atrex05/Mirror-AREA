curl -X POST -H "Content-Type: application/json" -d '{"username": "user", "password": "password"}' http://127.0.0.1:8080/login
echo ""
curl -X POST -H "Content-Type: application/json" -d '{"username": "wronguser", "password": "password"}' http://127.0.0.1:8080/login
echo ""