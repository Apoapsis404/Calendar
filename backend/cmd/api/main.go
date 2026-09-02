package main

import (
	"database/sql"
	"log"
	"os"

	"github.com/Apoapsis404/Calendar/internal/database"
	"github.com/joho/godotenv"

	_ "github.com/lib/pq"
)

func main() {

	godotenv.Load()

	portString := os.Getenv("PORT")
	if portString == "" {
		log.Fatal("PORT is not found in the environment")
	}

	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatal("DB_URL is not found in the environment")
	}

	conn, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("cannot connect to database", err)
	}

	cfg := config{
		addr: ":8080",
		DB:   database.New(conn),
	}

	app := &application{
		cfg,
	}

	mux := app.mount()
	log.Fatal(app.run(mux))
}
