package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"

	"github.com/Apoapsis404/Calendar/internal/database"
)

func (app *application) createUserHandler(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Email    string `json:"email"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithJSON(w, 400, ErrorResponse{Error: fmt.Sprintf("Error parsing json: %v", err)})
		return
	}

	user, err := app.config.DB.CreateUser(r.Context(), database.CreateUserParams{
		UserID:    uuid.New(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Username:  params.Username,
		Password:  params.Password,
		Email:     params.Email,
	})

	if err != nil {
		respondWithJSON(w, 400, ErrorResponse{Error: fmt.Sprintf("Could not create user: %v", err)})
		return
	}

	respondWithJSON(w, 200, user)
}
