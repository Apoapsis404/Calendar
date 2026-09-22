package api

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/Apoapsis404/Calendar/cmd/internal/database"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func (app *Application) createDayHandler(w http.ResponseWriter, r *http.Request) {
	userIDStr := chi.URLParam(r, "user_id")
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

	day, err := app.Cfg.DB.CreateDay(r.Context(), database.CreateDayParams{
		UserID:        userID,
		DayID:         uuid.New(),
		CreatedAt:     time.Now().UTC(),
		UpdatedAt:     time.Now().UTC(),
		ReferenceDate: referenceDate,
	})

	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		log.Println(err)
		return
	}

	respondWithJSON(w, http.StatusCreated, day)

}

func (app *Application) deleteDayHandler(w http.ResponseWriter, r *http.Request) {
	dayIDStr := chi.URLParam(r, "day_id")
	dayID, err := uuid.Parse(dayIDStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request URL")
		log.Println(err)
		return
	}

	err = app.Cfg.DB.DeleteDay(r.Context(), dayID)

	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		log.Println(err)
		return
	}

	respondWithJSON(w, http.StatusOK, struct{}{})

}

func (app *Application) getDaysHandler(w http.ResponseWriter, r *http.Request) {
	userIDStr := chi.URLParam(r, "user_id")
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request URL")
		return
	}

	days, err := app.Cfg.DB.GetDays(r.Context(), userID)
	if err != nil {
		log.Println(err)
		if err == sql.ErrNoRows {
			respondWithJSON(w, http.StatusNoContent, struct{}{})
			return
		}
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if len(days) < 1 {
		respondWithError(w, http.StatusNoContent, "No days found for this user")
		return
	}

	respondWithJSON(w, http.StatusOK, days)
}
