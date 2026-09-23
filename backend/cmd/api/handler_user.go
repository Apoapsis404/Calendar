package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"github.com/Apoapsis404/Calendar/cmd/internal/auth"
	"github.com/Apoapsis404/Calendar/cmd/internal/database"
	"github.com/Apoapsis404/Calendar/cmd/models"
)

func (app *Application) createUserHandler(w http.ResponseWriter, r *http.Request) {
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

	hashedPassword, err := auth.HashPassword(params.Password)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	user, err := app.Cfg.DB.CreateUser(r.Context(), database.CreateUserParams{
		UserID:    uuid.New(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Username:  params.Username,
		Password:  hashedPassword,
		Email:     params.Email,
	})

	if err != nil {
		respondWithJSON(w, 400, ErrorResponse{Error: fmt.Sprintf("Could not create user: %v", err)})
		return
	}

	respondWithJSON(w, http.StatusCreated, models.DatabaseUserToUser(user))
}

func (app *Application) deleteUserHandler(w http.ResponseWriter, r *http.Request) {
	userIDStr := chi.URLParam(r, "id")
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request URL")
		return
	}

	err = app.Cfg.DB.DeleteUser(r.Context(), userID)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		log.Println(err)
		return
	}

	respondWithJSON(w, http.StatusOK, struct{}{})

}
