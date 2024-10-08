package main

import (
    "fmt"
    "net/http"
    _ "database/sql"
    _ "github.com/lib/pq"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()
	router.SetTrustedProxies(nil)

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 3600,
	}))

	router.POST("/login", loginHandler)

	router.GET("/hello", helloHandler)

	fmt.Println("Server running on port 8080")
	router.Run(":8080")
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func loginHandler(c *gin.Context) {
	var loginReq LoginRequest

	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if loginReq.Username == "user" && loginReq.Password == "password" {
		c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
	}
}

func helloHandler(c *gin.Context) {
	c.String(http.StatusOK, "Hello, World!")
}
