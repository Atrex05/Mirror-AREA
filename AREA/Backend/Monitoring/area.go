package main

import (
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

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

type OAuth2 struct {
	ID       uint   `gorm:"primaryKey"`
	Name     string `gorm:"size:255"`
	LogoLink string `gorm:"type:text"`
	Color    string `gorm:"size:7"` // Hexadecimal code
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

type PostRequest struct {
	ID string `json:"id" binding:"required"`
}

func getAREA(db *gorm.DB, user_id string) []byte {
	var areas []AREA

	db.Preload("User").Preload("Action.Service").Preload("Reaction.Service").Where("user_id = ?", user_id).Find(&areas)

	response, err := json.Marshal(areas)
	if err != nil {
		fmt.Printf("Error: %s", err)
		return nil
	}

	return response
}

func getUserAREA(c *gin.Context) {
	db, err := connectToDatabase()
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to connect to database"})
		return
	}

	var postRequest PostRequest

	if err := c.ShouldBindJSON(&postRequest); err != nil {
		c.JSON(400, gin.H{"error": "invalid request"})
		return
	}
	area := getAREA(db, postRequest.ID)
	c.Data(200, "application/json", area)
}

func createAREA(db *gorm.DB, AREA AREA) error {
	result := db.Create(&AREA)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func createUserAREA(c *gin.Context) {
	db, err := connectToDatabase()
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to connect to database"})
		return
	}

	var AREA AREA

	if err := c.ShouldBindJSON(&AREA); err != nil {
		c.JSON(400, gin.H{"error": "invalid request"})
		return
	}

	if err := createAREA(db, AREA); err != nil {
		fmt.Printf("Error: %s", err)
		c.JSON(500, gin.H{"error": "failed to create AREA"})
		return
	}

	c.JSON(200, gin.H{"message": "AREA created successfully"})
}

func deleteAREA(db *gorm.DB, id string) error {
	result := db.Delete(&AREA{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("no AREA found with ID %s", id)
	}
	return nil
}

func deleteUserAREA(c *gin.Context) {
	db, err := connectToDatabase()
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to connect to database"})
		return
	}

	var postRequest PostRequest

	if err := c.ShouldBindJSON(&postRequest); err != nil {
		c.JSON(400, gin.H{"error": "invalid request"})
		return
	}

	if err := deleteAREA(db, postRequest.ID); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "AREA deleted successfully"})
}

func modifyAREA(db *gorm.DB, AREA AREA) error {
	result := db.Save(&AREA)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("no AREA found with ID %d", AREA.ID)
	}
	return nil
}

func modifyUserAREA(c *gin.Context) {
	db, err := connectToDatabase()
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to connect to database"})
		return
	}

	var AREA AREA

	if err := c.ShouldBindJSON(&AREA); err != nil {
		c.JSON(400, gin.H{"error": "invalid request"})
		return
	}

	if err := modifyAREA(db, AREA); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "AREA modified successfully"})
}
