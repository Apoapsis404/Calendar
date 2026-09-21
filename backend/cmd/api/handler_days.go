package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/Apoapsis404/Calendar/internal/database"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func (app *application) createDayHandler(w http.ResponseWriter, r *http.Request) {
	userIDStr := chi.URLParam(r, "id")
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request URL")
		return
	}

	type parameters struct {
		ReferenceDate string `json:"reference_date"`
	}


	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err = decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		log.Println(err)
		return
	}

	referenceDate, err := time.Parse("2006-01-02", params.ReferenceDate)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		log.Println(err)
		return
	}

	day, err := app.config.DB.CreateDay(r.Context(), database.CreateDayParams{
		UserID: userID,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		ReferenceDate: referenceDate,
	})

	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		log.Println(err)
		return
	}

	respondWithJSON(w, http.StatusOK, day)
	
}