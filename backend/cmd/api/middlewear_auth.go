package api

import (
	"log"
	"net/http"

	"github.com/Apoapsis404/Calendar/cmd/internal/auth"
)

type AuthHandler func(http.ResponseWriter, *http.Request)

func (app *Application) middlewareAuth(handler AuthHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		token, err := auth.GetAccessToken(r)
		if err != nil {
			log.Println(err, r.Header)
			if err == http.ErrNoCookie {
				respondWithError(w, http.StatusUnauthorized, "Cookie not found")
				return
			}
			respondWithError(w, http.StatusInternalServerError, "Internal server error")
			return
		}

		_, err = auth.ValidateJWT(token, app.Cfg.Secret)
		if err != nil {
			log.Println(err)
			respondWithError(w, http.StatusUnauthorized, "Invalid token")
			return
		}

		handler(w, r)
	}
}
