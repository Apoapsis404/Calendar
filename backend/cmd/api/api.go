package api

import (
	"log"
	"net/http"
	"time"

	"github.com/Apoapsis404/Calendar/cmd/internal/database"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
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
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Route("/v1", func(r chi.Router) {
		r.Get("/health", app.healthCheckHandler)

		r.Post("/users", app.createUserHandler)
		r.Get("/users", app.loginUserHandler)
		r.Delete("/users/{id}", app.middlewareAuth(app.deleteUserHandler))

		r.Post("/days/{user_id}", app.middlewareAuth(app.createDayHandler))
		r.Delete("/days/{day_id}", app.middlewareAuth(app.deleteDayHandler))
		r.Get("/days/{user_id}", app.middlewareAuth(app.getDaysHandler))

		r.Post("/events", app.middlewareAuth(app.createEventHandler))
		r.Delete("/events/{event_id}", app.middlewareAuth(app.deleteEventHandler))
		r.Get("/events/{day_id}", app.middlewareAuth(app.getEventsHandler))
		r.Patch("/events/{event_id}", app.middlewareAuth(app.updateEventHandler))

		r.Post("/refresh", app.CreateAccessTokenHandler)
		r.Delete("/refresh", app.DeleteRefreshTokenHandler)
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
