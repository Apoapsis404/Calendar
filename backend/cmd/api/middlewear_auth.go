package api

import (
	"log"
	"net/http"

	"github.com/Apoapsis404/Calendar/cmd/internal/auth"
)

type AuthHandler func(http.ResponseWriter, *http.Request)

func (app *Application) middlewareAuth(handler AuthHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		token, err := auth.GetBearerToken(r.Header)
		if err != nil {
			log.Println(err, r.Header)
			respondWithError(w, http.StatusBadRequest, "Invalid request header")
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
