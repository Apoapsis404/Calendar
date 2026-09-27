package api

import (
	"log"
	"net/http"
	"time"

	"github.com/Apoapsis404/Calendar/cmd/internal/auth"
)

func (app *Application) CreateAccessTokenHandler(w http.ResponseWriter, r *http.Request) {
	refreshToken, err := auth.GetBearerToken(r.Header)
	if err != nil {
		log.Printf("Error getting bearer token: %v\n Got %s", err, r.Header.Get("Authorization"))
		respondWithError(w, http.StatusUnauthorized, "Invalid token")
		return
	}

	_, err = app.Cfg.DB.ValidateRefreshToken(r.Context(), refreshToken)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusUnauthorized, "Invalid token")
		return
	}

	user, err := app.Cfg.DB.GetUserFromRefreshToken(r.Context(), refreshToken)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusUnauthorized, "Invalid token")
		return
	}

	accessToken, err := auth.MakeJWT(user.UserID, app.Cfg.Secret, time.Hour)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	respondWithJSON(w, http.StatusOK, struct {
		AccessToken string `json:"access_token"`
	}{AccessToken: accessToken})
}

func (app *Application) DeleteRefreshTokenHandler(w http.ResponseWriter, r *http.Request) {
	refreshToken, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Invalid token")
		return
	}

	err = app.Cfg.DB.RevokeRefreshToken(r.Context(), refreshToken)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	expiredCookie := &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(w, expiredCookie)

	respondWithJSON(w, http.StatusOK, struct{}{})
}
