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

var facebookOauthConfig struct {
	ClientID     string
	ClientSecret string
	RedirectURL  string
}

func main() {
	err := loadFacebookCredentials("credentials.json")
	if err != nil {
		log.Fatalf("Unable to load credentials: %v", err)
	}

	r := gin.Default()

	r.Use(cors.Default())

	r.GET("/", handleMain)
	r.GET("/login", handleLogin)
	r.GET("/callback", handleFacebookCallback)

	fmt.Println("Server is running at http://localhost:8080")
	if err := r.Run(":8083"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

func loadFacebookCredentials(filename string) error {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return fmt.Errorf("unable to read credentials file: %w", err)
	}

	var creds Credentials
	if err := json.Unmarshal(data, &creds); err != nil {
		return fmt.Errorf("unable to parse credentials file: %w", err)
	}

	facebookOauthConfig.ClientID = creds.Web.ClientID
	facebookOauthConfig.ClientSecret = creds.Web.ClientSecret
	facebookOauthConfig.RedirectURL = "http://localhost:8080/callback"

	return nil
}

func handleMain(c *gin.Context) {
	c.String(http.StatusOK, "Welcome to the Facebook OAuth2 login example!")
}

func handleLogin(c *gin.Context) {
	url := fmt.Sprintf("https://www.facebook.com/v11.0/dialog/oauth?client_id=%s&redirect_uri=%s&state=%s&response_type=code&scope=email",
		facebookOauthConfig.ClientID, facebookOauthConfig.RedirectURL, oauthStateString)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func handleFacebookCallback(c *gin.Context) {
	if c.Query("state") != oauthStateString {
		fmt.Println("Invalid OAuth2 state")
		c.Redirect(http.StatusTemporaryRedirect, "/")
		return
	}

	code := c.Query("code")
	tokenURL := "https://graph.facebook.com/v11.0/oauth/access_token"
	payload := fmt.Sprintf("client_id=%s&redirect_uri=%s&client_secret=%s&code=%s",
		facebookOauthConfig.ClientID, facebookOauthConfig.RedirectURL, facebookOauthConfig.ClientSecret, code)

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
	userInfoURL := "https://graph.facebook.com/me?fields=id,name,email"

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
