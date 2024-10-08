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

func connectToDatabase() (*gorm.DB, error) {
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
	return db, err
}

func main() {
	router := gin.Default()

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	router.GET("/about", getAboutJSON)
	router.POST("/get_user_area", getUserAREA)
	router.POST("/create_user_area", createUserAREA)
	router.POST("/delete_user_area", deleteUserAREA)
	router.POST("/modify_user_area", modifyUserAREA)

	router.Run(":8081")
}
