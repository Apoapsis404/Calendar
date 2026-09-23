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
