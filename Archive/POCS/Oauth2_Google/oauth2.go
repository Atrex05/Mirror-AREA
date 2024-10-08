package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var (
	oauthStateString = "randomstatestring"
)

type Credentials struct {
	Web struct {
		ClientID     string `json:"client_id"`
		ClientSecret string `json:"client_secret"`
	} `json:"web"`
}

var googleOauthConfig struct {
	ClientID     string
	ClientSecret string
	RedirectURL  string
}

func main() {
	err := loadGoogleCredentials("credentials.json")
	if err != nil {
		log.Fatalf("Unable to load credentials: %v", err)
	}

	r := gin.Default()

	r.Use(cors.Default())

	r.GET("/", handleMain)
	r.GET("/login", handleLogin)
	r.GET("/callback", handleGoogleCallback)

	fmt.Println("Server is running at http://localhost:8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

func loadGoogleCredentials(filename string) error {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return fmt.Errorf("unable to read credentials file: %w", err)
	}

	var creds Credentials
	if err := json.Unmarshal(data, &creds); err != nil {
		return fmt.Errorf("unable to parse credentials file: %w", err)
	}

	googleOauthConfig.ClientID = creds.Web.ClientID
	googleOauthConfig.ClientSecret = creds.Web.ClientSecret
	googleOauthConfig.RedirectURL = "http://localhost:8080/callback"

	return nil
}

func handleMain(c *gin.Context) {
	c.String(http.StatusOK, "Welcome to the OAuth2 login example!")
}

func handleLogin(c *gin.Context) {
	url := fmt.Sprintf("https://accounts.google.com/o/oauth2/auth?client_id=%s&redirect_uri=%s&response_type=code&scope=email&state=%s",
		googleOauthConfig.ClientID, googleOauthConfig.RedirectURL, oauthStateString)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func handleGoogleCallback(c *gin.Context) {
	if c.Query("state") != oauthStateString {
		fmt.Println("Invalid OAuth2 state")
		c.Redirect(http.StatusTemporaryRedirect, "/")
		return
	}

	code := c.Query("code")
	tokenURL := "https://oauth2.googleapis.com/token"
	payload := fmt.Sprintf("code=%s&client_id=%s&client_secret=%s&redirect_uri=%s&grant_type=authorization_code",
		code, googleOauthConfig.ClientID, googleOauthConfig.ClientSecret, googleOauthConfig.RedirectURL)

	req, err := http.NewRequest("POST", tokenURL, strings.NewReader(payload))
	if err != nil {
		fmt.Println("Failed to exchange token:", err)
		c.Redirect(http.StatusTemporaryRedirect, "/")
		return
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Failed to get token info:", err)
		c.Redirect(http.StatusTemporaryRedirect, "/")
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Failed to read response body:", err)
		c.Redirect(http.StatusTemporaryRedirect, "/")
		return
	}

	var tokenData map[string]interface{}
	if err := json.Unmarshal(body, &tokenData); err != nil {
		fmt.Println("Failed to parse token info:", err)
		c.Redirect(http.StatusTemporaryRedirect, "/")
		return
	}

	accessToken := tokenData["access_token"].(string)
	handleUserInfo(c, accessToken)
}

func handleUserInfo(c *gin.Context, accessToken string) {
	userInfoURL := "https://www.googleapis.com/oauth2/v2/userinfo"

	req, err := http.NewRequest("GET", userInfoURL, nil)
	if err != nil {
		fmt.Println("Failed to create request:", err)
		c.Redirect(http.StatusTemporaryRedirect, "/")
		return
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Failed to get user info:", err)
		c.Redirect(http.StatusTemporaryRedirect, "/")
		return
	}
	defer resp.Body.Close()

	userInfo, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Failed to read user info:", err)
		c.Redirect(http.StatusTemporaryRedirect, "/")
		return
	}

	c.String(http.StatusOK, "User Info: %s", userInfo)
}
