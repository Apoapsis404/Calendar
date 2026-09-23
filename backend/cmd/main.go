package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/Apoapsis404/Calendar/cmd/api"
	"github.com/Apoapsis404/Calendar/cmd/internal/database"
	"github.com/joho/godotenv"

	_ "github.com/lib/pq"
)

func main() {

	godotenv.Load()

	log.SetFlags(log.LstdFlags | log.Lshortfile)

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	if dbUser == "" || dbPassword == "" || dbHost == "" || dbPort == "" || dbName == "" {
		log.Fatal("Missing required database environment variables")
	}
	// Construct DSN (Data Source Name)
	dsn := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=disable",
		dbUser,
		dbPassword,
		dbHost,
		dbPort,
		dbName,
	)

	secretKey := os.Getenv("SECRET")
	if secretKey == "" {
		log.Fatal("Missing authentication secret in enviornment veriables")
	}

	conn, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("cannot connect to database", err)
	}
	defer conn.Close()

	log.Println("Connected to database")

	cfg := api.Config{
		ADDR:   ":8080",
		DB:     database.New(conn),
		Secret: secretKey,
	}

	app := &api.Application{
		Cfg: cfg,
	}

	mux := app.Mount()
	log.Fatal(app.Run(mux))
}
