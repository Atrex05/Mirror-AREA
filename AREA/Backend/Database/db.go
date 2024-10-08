package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type OAuth2 struct {
	ID       uint   `gorm:"primaryKey"`
	Name     string `gorm:"size:255"`
	LogoLink string `gorm:"type:text"`
	Color    string `gorm:"size:7"` // Hexadecimal code
}

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

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Name     string `gorm:"size:255"`
	Surname  string `gorm:"size:255"`
	Email    string `gorm:"unique;size:255"`
	Password string `gorm:"size:255"`
}

type AREA struct {
	ID           uint     `gorm:"primaryKey"`
	Name         string   `gorm:"size:255"`
	Description  string   `gorm:"type:text"`
	UserID       uint     `gorm:"not null"`
	User         User     `gorm:"foreignKey:UserID"`
	ActionID     uint     `gorm:"not null"`
	Action       Action   `gorm:"foreignKey:ActionID"`
	ActionDesc   string   `gorm:"type:json"`
	ReactionID   uint     `gorm:"not null"`
	Reaction     Reaction `gorm:"foreignKey:ReactionID"`
	ReactionDesc string   `gorm:"type:json"`
}

type UserOAuth2 struct {
	ID           uint   `gorm:"primaryKey"`
	UserID       uint   `gorm:"not null"`
	User         User   `gorm:"foreignKey:UserID"`
	OAuth2ID     uint   `gorm:"not null"`
	OAuth2       OAuth2 `gorm:"foreignKey:OAuth2ID"`
	AccessToken  string `gorm:"size:255"`
	RefreshToken string `gorm:"size:255"`
}

type AuditLog struct {
	ID              uint   `gorm:"primaryKey"`
	UserID          uint   `gorm:"not null"`
	User            User   `gorm:"foreignKey:UserID"`
	ActionTimeStamp string `gorm:"type:timestamp"`
	ActionDetails   string `gorm:"size:255"`
}

func create_database(db *gorm.DB) int {
	err := db.AutoMigrate(&OAuth2{}, &Service{}, &Action{}, &Reaction{}, &User{}, &AREA{}, &UserOAuth2{}, &AuditLog{})
	if err != nil {
		fmt.Printf("Error migrating database: %v\n", err)
		return -1
	}
	return 0
}

func drop_database(db *gorm.DB) int {
	err := db.Migrator().DropTable(&OAuth2{}, &Service{}, &Action{}, &Reaction{}, &User{}, &AREA{}, &UserOAuth2{}, &AuditLog{})
	if err != nil {
		fmt.Printf("Error dropping database: %v\n", err)
		return -1
	}
	return 0
}

func fill_service_table(db *gorm.DB) int {
	services := []Service{
		{Name: "Spotify", LogoLink: "logo_link", Color: "#1DB954"},
		{Name: "Gmail", LogoLink: "logo_link", Color: "#D14836"},
		{Name: "Discord", LogoLink: "logo_link", Color: "#5865F2"},
		{Name: "Trello", LogoLink: "logo_link", Color: "#0079BF"},
		{Name: "Slack", LogoLink: "logo_link", Color: "#4A154B"},
		{Name: "Google Calendar", LogoLink: "logo_link", Color: "#4285F4"},
		{Name: "X/Twitter", LogoLink: "logo_link", Color: "#1DA1F2"},
		{Name: "Twitch", LogoLink: "logo_link", Color: "#9146FF"},
		{Name: "Sonos", LogoLink: "logo_link", Color: "#000000"},
		{Name: "Riot Games", LogoLink: "logo_link", Color: "#000000"},
		{Name: "Date & Time", LogoLink: "logo_link", Color: "#000000"},
		{Name: "Facebook", LogoLink: "logo_link", Color: "#4267B2"},
		{Name: "LinkedIn", LogoLink: "logo_link", Color: "#0077B5"},
	}

	for _, service := range services {
		var existingService Service
		if err := db.Where("name = ?", service.Name).First(&existingService).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := db.Create(&service).Error; err != nil {
					fmt.Printf("Error creating service: %v\n", err)
					return -1
				}
			} else {
				fmt.Printf("Error querying service: %v\n", err)
				return -1
			}
		}
	}
	return 0
}

func fill_oauth_table(db *gorm.DB) int {
	oauths := []OAuth2{
		{Name: "Google", LogoLink: "logo_link", Color: "#D14836"},
		{Name: "Facebook", LogoLink: "logo_link", Color: "#4267B2"},
		{Name: "X", LogoLink: "logo_link", Color: "#000000"},
	}

	for _, oauth := range oauths {
		var existingOAuth OAuth2
		if err := db.Where("name = ?", oauth.Name).First(&existingOAuth).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := db.Create(&oauth).Error; err != nil {
					fmt.Printf("Error creating OAuth2: %v\n", err)
					return -1
				}
			} else {
				fmt.Printf("Error querying OAuth2: %v\n", err)
				return -1
			}
		}
	}
	return 0
}

func fill_action_table(db *gorm.DB) int {
	actions := []Action{
		{Name: "Song added to Playlist", Description: "Trigger when a song is added to a specific playlist", ServiceID: 1},
		{Name: "Email received", Description: "Trigger when an email is received", ServiceID: 2},
		{Name: "Event created", Description: "Trigger when an event is created in a specific calendar", ServiceID: 6},
		{Name: "Event updated", Description: "Trigger when an event is updated in a specific calendar", ServiceID: 6},
		{Name: "New Tweet by you", Description: "Trigger when you tweet something", ServiceID: 7},
		{Name: "New mention of you", Description: "Trigger when you are mentioned in a tweet", ServiceID: 7},
		{Name: "New Follow", Description: "Trigger when someone follows you", ServiceID: 7},
		{Name: "New Game", Description: "Trigger when a new champion rotation is available", ServiceID: 10},
		{Name: "Specific Date & Time", Description: "Trigger at a specific date and time", ServiceID: 11},
		{Name: "New Follower", Description: "Trigger when a new user follows you", ServiceID: 8},
		{Name: "New stream by you", Description: "Trigger when you start a stream", ServiceID: 8},
		{Name: "Message received", Description: "Trigger when a message is received in a specific channel", ServiceID: 3},
		{Name: "Card created", Description: "Trigger when a card is created in a specific board", ServiceID: 4},
		{Name: "Card assigned to you", Description: "Trigger when a card is assigned to you", ServiceID: 4},
		{Name: "Message received", Description: "Trigger when a message is received in a specific channel", ServiceID: 5},
		{Name: "New post by you", Description: "Trigger when you post something", ServiceID: 12},
		{Name: "New post by you", Description: "Trigger when you post something", ServiceID: 13},
	}

	for _, action := range actions {
		var existingAction Action
		if err := db.Where("name = ? AND service_id = ?", action.Name, action.ServiceID).First(&existingAction).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := db.Create(&action).Error; err != nil {
					fmt.Printf("Error creating action: %v\n", err)
					return -1
				}
			} else {
				fmt.Printf("Error querying action: %v\n", err)
				return -1
			}
		}
	}
	return 0
}

func fill_reaction_table(db *gorm.DB) int {
	reactions := []Reaction{
		{Name: "Start a song", Description: "Start playing a song", ServiceID: 1},
		{Name: "Send Email", Description: "Send an email to a specific address", ServiceID: 2},
		{Name: "Create Event", Description: "Create an event in a specific calendar", ServiceID: 6},
		{Name: "Update Event", Description: "Update an event in a specific calendar", ServiceID: 6},
		{Name: "Tweet", Description: "Tweet a message", ServiceID: 7},
		{Name: "Send DM", Description: "Send a direct message to a specific user", ServiceID: 7},
		{Name: "Send Message", Description: "Send a message to a specific channel", ServiceID: 3},
		{Name: "Send DM", Description: "Send a direct message to a specific user", ServiceID: 3},
		{Name: "Create Card", Description: "Create a card in a specific board", ServiceID: 4},
		{Name: "Update Card", Description: "Update a card in a specific board", ServiceID: 4},
		{Name: "Send Message", Description: "Send a message to your chat", ServiceID: 8},
		{Name: "Send Message", Description: "Send a message to a specific channel", ServiceID: 5},
		{Name: "Send DM", Description: "Send a direct message to a specific user", ServiceID: 5},
		{Name: "Play Song", Description: "Play a specific song", ServiceID: 9},
		{Name: "Pause Song", Description: "Pause the current song", ServiceID: 9},
	}

	for _, reaction := range reactions {
		var existingReaction Reaction
		if err := db.Where("name = ? AND service_id = ?", reaction.Name, reaction.ServiceID).First(&existingReaction).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := db.Create(&reaction).Error; err != nil {
					fmt.Printf("Error creating reaction: %v\n", err)
					return -1
				}
			} else {
				fmt.Printf("Error querying reaction: %v\n", err)
				return -1
			}
		}
	}
	return 0
}

func setup_database() int {
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
		fmt.Printf("Error connecting to database: %v\n", err)
		return -1
	}

	if create_database(db) == -1 ||
		fill_service_table(db) == -1 ||
		fill_oauth_table(db) == -1 ||
		fill_action_table(db) == -1 ||
		fill_reaction_table(db) == -1 {
		return -1
	}
	return 0
}

func setupDatabase(c *gin.Context) {
	if setup_database() == -1 {
		c.JSON(500, gin.H{"error": "failed to setup database"})
		return
	}
	c.JSON(200, gin.H{"message": "database setup complete"})
}

func dropDatabase(c *gin.Context) {
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

	if drop_database(db) == -1 {
		c.JSON(500, gin.H{"error": "failed to drop database"})
		return
	}
	c.JSON(200, gin.H{"message": "database dropped"})
}

func resetDatabase(c *gin.Context) {
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

	if drop_database(db) == -1 {
		c.JSON(500, gin.H{"error": "failed to reset (delete) database"})
		return
	}
	if setup_database() == -1 {
		c.JSON(500, gin.H{"error": "failed to reset (setup) database"})
		return
	}
	c.JSON(200, gin.H{"message": "database reset complete"})
}

func main() {
	router := gin.Default()

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	router.GET("/setup", setupDatabase)
	router.GET("/drop", dropDatabase)
	router.GET("/reset", resetDatabase)

	router.Run(":8082")
}
