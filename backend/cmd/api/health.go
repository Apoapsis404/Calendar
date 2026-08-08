package main

import "net/http"

func (app *application) healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	respondWithJSON(w, 200, struct {
		Health string `json:"health"`
	}{Health: "OK"})
}
