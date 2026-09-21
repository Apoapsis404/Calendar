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

func (app *application) createEventHandler(w http.ResponseWriter, r *http.Request) {
type parameters struct {
	DayID     string `json:"day_id"`
	EventName string    `json:"event_name"`
	StartTime string    `json:"start_time"`
	EndTime   string    `json:"end_time"`
}

params := parameters{}
decoder := json.NewDecoder(r.Body)
err := decoder.Decode(&params)
if err != nil {
	log.Println(r.Body)
	log.Println(err)
	respondWithError(w, http.StatusBadRequest, "Invalid request body")
	return
}

dayID, err := uuid.Parse(params.DayID)
if err != nil {
	log.Println(err)
	respondWithError(w, http.StatusBadRequest, "Invalid request body")
	return
}

startTime, err := time.Parse("15:04", params.StartTime)
if err != nil {
	log.Println(err)
	respondWithError(w, http.StatusBadRequest, "Invalid request body")
	return
}
endTime, err := time.Parse("15:04", params.StartTime)
if err != nil {
	log.Println(err)
	respondWithError(w, http.StatusBadRequest, "Invalid request body")
	return
}

event, err := app.config.DB.CreateEvent(r.Context(), database.CreateEventParams{
	EventID: uuid.New(),
	CreatedAt: time.Now().UTC(),
	UpdatedAt: time.Now().UTC(),
	EventName: params.EventName,
	StartTime: startTime,
	EndTime: endTime,
	DayID: dayID,
})

if err != nil {
	log.Println(err)
	respondWithError(w, http.StatusBadRequest, "Invalid request body")
	return 
}

respondWithJSON(w, http.StatusCreated, event)
}


func (app *application) deleteEventHandler(w http.ResponseWriter, r *http.Request) {
	eventIDStr := chi.URLParam(r, "event_id")
	eventID, err := uuid.Parse(eventIDStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request URL")
		return
	}

	err = app.config.DB.DeleteEvent(r.Context(), eventID)
	if err != nil  {
		log.Println(err)
		respondWithError(w, http.StatusBadRequest, "Invalid reqiest body")
		return
	}

	respondWithJSON(w, http.StatusOK, struct{}{})
}


func (app *application) getEventsHandler(w http.ResponseWriter, r *http.Request) {
	dayIDStr := chi.URLParam(r, "day_id")
	dayID, err := uuid.Parse(dayIDStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request URL")
		return
	}

	events, err := app.config.DB.GetEvents(r.Context(), dayID)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if len(events) < 1 {
		respondWithError(w, http.StatusNoContent, "Found no events for this day")
		return
	}

	respondWithJSON(w, http.StatusOK, events)
}