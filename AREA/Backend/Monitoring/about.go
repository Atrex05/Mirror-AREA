package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Service struct {
	ID        uint       `gorm:"primaryKey"`
	Name      string     `gorm:"size:255"`
	LogoLink  string     `gorm:"type:text"`
	Color     string     `gorm:"size:7"` // Hexadecimal code
	Actions   []Action   `gorm:"foreignKey:ServiceID"`
	Reactions []Reaction `gorm:"foreignKey:ServiceID"`
}

type Action struct {
	ID          uint    `gorm:"primaryKey"`
	Name        string  `gorm:"size:255"`
	Description string  `gorm:"type:text"`
	ServiceID   uint    `gorm:"not null"`
	Service     Service `gorm:"foreignKey:ServiceID"`
}

type Reaction struct {
	ID          uint    `gorm:"primaryKey"`
	Name        string  `gorm:"size:255"`
	Description string  `gorm:"type:text"`
	ServiceID   uint    `gorm:"not null"`
	Service     Service `gorm:"foreignKey:ServiceID"`
}

type AboutResponse struct {
	Client struct {
		Host string `json:"host"`
	} `json:"client"`
	Server struct {
		CurrentTime int64 `json:"current_time"`
		Services    []struct {
			Name    string `json:"name"`
			Actions []struct {
				Name        string `json:"name"`
				Description string `json:"description"`
			} `json:"actions"`
			Reactions []struct {
				Name        string `json:"name"`
				Description string `json:"description"`
			} `json:"reactions"`
		} `json:"services"`
	} `json:"server"`
}

func get_about(db *gorm.DB) []byte {
	clientIP := "127.0.0.1"

	var services []Service
	if err := db.Preload("Actions").Preload("Reactions").Find(&services).Error; err != nil {
		panic("failed to fetch services from database")
	}

	response := AboutResponse{
		Client: struct {
			Host string `json:"host"`
		}{
			Host: clientIP,
		},
		Server: struct {
			CurrentTime int64 `json:"current_time"`
			Services    []struct {
				Name    string `json:"name"`
				Actions []struct {
					Name        string `json:"name"`
					Description string `json:"description"`
				} `json:"actions"`
				Reactions []struct {
					Name        string `json:"name"`
					Description string `json:"description"`
				} `json:"reactions"`
			} `json:"services"`
		}{
			CurrentTime: time.Now().Unix(), // Unix timestamp
			Services: []struct {
				Name    string `json:"name"`
				Actions []struct {
					Name        string `json:"name"`
					Description string `json:"description"`
				} `json:"actions"`
				Reactions []struct {
					Name        string `json:"name"`
					Description string `json:"description"`
				} `json:"reactions"`
			}{},
		},
	}

	for _, service := range services {
		actions := []struct {
			Name        string `json:"name"`
			Description string `json:"description"`
		}{}
		for _, action := range service.Actions {
			actions = append(actions, struct {
				Name        string `json:"name"`
				Description string `json:"description"`
			}{
				Name:        action.Name,
				Description: action.Description,
			})
		}

		reactions := []struct {
			Name        string `json:"name"`
			Description string `json:"description"`
		}{}
		for _, reaction := range service.Reactions {
			reactions = append(reactions, struct {
				Name        string `json:"name"`
				Description string `json:"description"`
			}{
				Name:        reaction.Name,
				Description: reaction.Description,
			})
		}

		response.Server.Services = append(response.Server.Services, struct {
			Name    string `json:"name"`
			Actions []struct {
				Name        string `json:"name"`
				Description string `json:"description"`
			} `json:"actions"`
			Reactions []struct {
				Name        string `json:"name"`
				Description string `json:"description"`
			} `json:"reactions"`
		}{
			Name:      service.Name,
			Actions:   actions,
			Reactions: reactions,
		})
	}

	responseJSON, err := json.MarshalIndent(response, "", "  ")
	if err != nil {
		panic("failed to convert response to JSON")
	}

	return responseJSON
}

func getAboutJSON(c *gin.Context) {
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")
	timezone := os.Getenv("DB_TIMEZONE")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=%s",
		host, user, password, dbname, port, timezone)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to connect to database"})
		return
	}

	response := get_about(db)
	if response == nil {
		c.JSON(500, gin.H{"error": "failed to get about JSON"})
		return
	}
	c.Data(200, "application/json", response)
}
