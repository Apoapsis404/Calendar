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

	expiredCookie := &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(w, expiredCookie)

	respondWithJSON(w, http.StatusOK, struct{}{})

}

func (app *Application) loginUserHandler(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	params := parameters{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	user, err := app.Cfg.DB.LoginUser(r.Context(), params.Username)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusUnauthorized, "Invalid username or password")
		return
	}

	err = auth.CheckPasswordHash(params.Password, user.Password)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusUnauthorized, "Invalid username or password")
		return
	}

	expirationTime := time.Hour

	accessToken, err := auth.MakeJWT(user.UserID, app.Cfg.Secret, expirationTime)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal server error")
		log.Println(err)
		return
	}

	refreshToken := auth.MakeRefreshToken()
	_, err = app.Cfg.DB.CreateRefreshToken(r.Context(), database.CreateRefreshTokenParams{
		Token:     refreshToken,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		UserID:    user.UserID,
		ExpiresAt: time.Now().UTC().Add(time.Hour * 24 * 7),
	})

	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	cookie := &http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Path:     "/",
		Expires:  time.Now().Add(expirationTime),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(w, cookie)

	respondWithJSON(w, http.StatusOK, models.DatabaseUserToLoginUser(user, refreshToken))
}
