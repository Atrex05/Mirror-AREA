package main

import (
	"net/http/httputil"
	"net/url"

	"github.com/gin-gonic/gin"
)

func proxyRequest(target string, route string, c *gin.Context) {
	url, _ := url.Parse(target)
	proxy := httputil.NewSingleHostReverseProxy(url)
	c.Request.URL.Path = route
	proxy.ServeHTTP(c.Writer, c.Request)
}

func main() {
	router := gin.Default()

	router.GET("/about.json", func(c *gin.Context) {
		proxyRequest("http://localhost:8081", "/about", c)
	})
	router.POST("/area/get", func(c *gin.Context) {
		proxyRequest("http://localhost:8081", "/get_user_area", c)
	})
	router.POST("/area/create", func(c *gin.Context) {
		proxyRequest("http://localhost:8081", "/create_user_area", c)
	})
	router.POST("/area/delete", func(c *gin.Context) {
		proxyRequest("http://localhost:8081", "/delete_user_area", c)
	})
	router.POST("/area/modify", func(c *gin.Context) {
		proxyRequest("http://localhost:8081", "/modify_user_area", c)
	})
	router.GET("/reset_database", func(c *gin.Context) {
		proxyRequest("http://localhost:8082", "/reset", c)
	})		

	router.Run(":8080")
}
