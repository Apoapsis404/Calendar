package api

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/Apoapsis404/Calendar/cmd/internal/database"
	"github.com/Apoapsis404/Calendar/cmd/models"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func (app *Application) createEventHandler(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		DayID           string `json:"user_id"`
		EventName       string `json:"event_name"`
		Description     string `json:"description"`
		Recurring       string `json:"recurring,omitempty"`
		CustomRecurring int32  `json:"custom_recurring,omitempty"`
		StartTime       string `json:"start_time"`
		EndTime         string `json:"end_time"`
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

	userID, err := uuid.Parse(params.DayID)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	startTime, err := time.Parse("2006-01-02T15:04:00", params.StartTime)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	endTime, err := time.Parse("2006-01-02T15:04:00", params.EndTime)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	recurring := database.NullRecurringType{}
	if params.Recurring == "" {
		recurring.Valid = false
	} else {
		recurring.Valid = true
		recurring.RecurringType = database.RecurringType(params.Recurring)
	}

	event, err := app.Cfg.DB.CreateEvent(r.Context(), database.CreateEventParams{
		EventID:     uuid.New(),
		CreatedAt:   time.Now().UTC(),
		UpdatedAt:   time.Now().UTC(),
		EventName:   params.EventName,
		Description: params.Description,
		Recurring:   recurring,
		CustomRecurring: sql.NullInt32{
			Int32: params.CustomRecurring,
			Valid: params.CustomRecurring != 0,
		},
		StartTime: startTime,
		EndTime:   endTime,
		UserID:    userID,
	})

	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	respondWithJSON(w, http.StatusCreated, models.DatabaseEventToEvent(event))
}

func (app *Application) deleteEventHandler(w http.ResponseWriter, r *http.Request) {
	eventIDStr := chi.URLParam(r, "event_id")
	eventID, err := uuid.Parse(eventIDStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request URL")
		return
	}

	err = app.Cfg.DB.DeleteEvent(r.Context(), eventID)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusBadRequest, "Invalid reqiest body")
		return
	}

	respondWithJSON(w, http.StatusOK, struct{}{})
}

func (app *Application) getEventsHandler(w http.ResponseWriter, r *http.Request) {
	userIDStr := chi.URLParam(r, "user_id")
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request URL")
		return
	}

	events, err := app.Cfg.DB.GetEvents(r.Context(), userID)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if len(events) < 1 {
		respondWithError(w, http.StatusNoContent, "Found no events for this day")
		return
	}

	respondWithJSON(w, http.StatusOK, models.DatabaseEventsToEvents(events))
}

func (app *Application) updateEventHandler(w http.ResponseWriter, r *http.Request) {
	eventIDStr := chi.URLParam(r, "event_id")
	eventID, err := uuid.Parse(eventIDStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request URL")
		return
	}

	type parameters struct {
		EventName       string `json:"event_name"`
		Description     string `json:"description"`
		Recurring       string `json:"recurring"`
		CustomRecurring int32  `json:"custom_recurring"`
		StartTime       string `json:"start_time"`
		EndTime         string `json:"end_time"`
	}

	params := parameters{}
	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&params)

	if err != nil {
		log.Println(r.Body)
		log.Println(err)
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	startTime, err := time.Parse("2006-01-02T15:04:00", params.StartTime)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	endTime, err := time.Parse("2006-01-02T15:04:00", params.EndTime)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	recurring := database.NullRecurringType{}
	if params.Recurring == "" {
		recurring.Valid = false
	} else {
		recurring.Valid = true
		recurring.RecurringType = database.RecurringType(params.Recurring)
	}

	err = app.Cfg.DB.UpdateEvent(r.Context(), database.UpdateEventParams{
		EventID:     eventID,
		UpdatedAt:   time.Now().UTC(),
		EventName:   params.EventName,
		Description: params.Description,
		Recurring:   recurring,
		StartTime:   startTime,
		EndTime:     endTime,
		CustomRecurring: sql.NullInt32{
			Int32: params.CustomRecurring,
			Valid: params.CustomRecurring != 0,
		},
	})

	respondWithJSON(w, http.StatusOK, struct{}{})
}
