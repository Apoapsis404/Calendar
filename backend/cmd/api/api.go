package api

import (
	"log"
	"net/http"
	"time"

	"github.com/Apoapsis404/Calendar/cmd/internal/database"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Application struct {
	Cfg Config
}

type Config struct {
	ADDR   string
	DB     *database.Queries
	Secret string
}

func (app *Application) Mount() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.Logger)

	r.Route("/v1", func(r chi.Router) {
		r.Get("/health", app.healthCheckHandler)

		r.Post("/users", app.createUserHandler)
		r.Delete("/users/{id}", app.deleteUserHandler)

		r.Post("/days/{user_id}", app.createDayHandler)
		r.Delete("/days/{day_id}", app.deleteDayHandler)
		r.Get("/days/{user_id}", app.getDaysHandler)

		r.Post("/events", app.createEventHandler)
		r.Delete("/events/{event_id}", app.deleteEventHandler)
		r.Get("/events/{day_id}", app.getEventsHandler)
		r.Patch("/events/{event_id}", app.updateEventHandler)

	})

	return r
}

func (app *Application) Run(mux http.Handler) error {
	srv := &http.Server{
		Addr:         app.Cfg.ADDR,
		Handler:      mux,
		WriteTimeout: time.Second * 30,
		ReadTimeout:  time.Second * 10,
		IdleTimeout:  time.Minute,
	}

	log.Printf("Server has started at %s\n", app.Cfg.ADDR)

	return srv.ListenAndServe()
}
