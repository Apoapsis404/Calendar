package models

import "github.com/Apoapsis404/Calendar/cmd/internal/database"

type User struct {
	UserID    string `json:"user_id"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
	Username  string `json:"username"`
	Email     string `json:"email"`
}

func DatabaseUserToUser(dbUser database.User) User {
	return User{
		UserID:    dbUser.UserID.String(),
		CreatedAt: dbUser.CreatedAt.String(),
		UpdatedAt: dbUser.UpdatedAt.String(),
		Username:  dbUser.Username,
		Email:     dbUser.Email,
	}
}

type LoginUser struct {
	UserID       string `json:"user_id"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	RefreshToken string `json:"refresh_token"`
}

func DatabaseUserToLoginUser(dbUser database.User, refreshToken string) LoginUser {
	return LoginUser{
		UserID:       dbUser.UserID.String(),
		Username:     dbUser.Username,
		Email:        dbUser.Email,
		RefreshToken: refreshToken,
	}
}

type Event struct {
	EventID         string `json:"event_id"`
	CreatedAt       string `json:"created_at"`
	UpdatedAt       string `json:"updated_at"`
	EventName       string `json:"event_name"`
	Description     string `json:"description"`
	Recurring       string `json:"recurring"`
	CustomRecurring int32  `json:"custom_recurring"`
	StartTime       string `json:"start_time"`
	EndTime         string `json:"end_time"`
}

func DatabaseEventToEvent(dbEvent database.Event) Event {
	var recurring string
	if dbEvent.Recurring.Valid {
		recurring = string(dbEvent.Recurring.RecurringType)
	}

	return Event{
		EventID:         dbEvent.EventID.String(),
		CreatedAt:       dbEvent.CreatedAt.String(),
		UpdatedAt:       dbEvent.UpdatedAt.String(),
		EventName:       dbEvent.EventName,
		Description:     dbEvent.Description,
		Recurring:       recurring,
		CustomRecurring: dbEvent.CustomRecurring.Int32,
		StartTime:       dbEvent.StartTime.String(),
		EndTime:         dbEvent.EndTime.String(),
	}
}

func DatabaseEventsToEvents(dbEvents []database.Event) []Event {
	events := make([]Event, len(dbEvents))
	for i, dbEvent := range dbEvents {
		events[i] = DatabaseEventToEvent(dbEvent)
	}
	return events
}
