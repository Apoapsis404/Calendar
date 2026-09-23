package auth

import (
	"testing"
	"time"

	"github.com/Apoapsis404/Calendar/cmd/internal/auth"
	"github.com/google/uuid"
)

func TestMakeJWT(t *testing.T) {
	tests := []struct {
		name       string
		userID     string
		secretKey  string
		expiration time.Duration
		expected   string
	}{
		{
			name:       "Test Make JWT",
			userID:     "69b2fb9d-cd21-4722-a789-1010f074ea6b",
			secretKey:  "Hello",
			expiration: time.Minute,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			userID, err := uuid.Parse(tc.userID)
			if err != nil {
				t.Errorf("could not parse userId: %v\n", err)
			}
			_, err = auth.MakeJWT(userID, tc.secretKey, tc.expiration)
			if err != nil {
				t.Errorf("could not make jwt: %v\n", err)
			}
		})
	}
}

func TestValidate(t *testing.T) {

	userID, err := uuid.Parse("69b2fb9d-cd21-4722-a789-1010f074ea6b")
	if err != nil {
		t.Errorf("could not parse userId: %v\n", err)
	}
	validateJWTSuccess, err := auth.MakeJWT(userID, "Hello", time.Minute)
	if err != nil {
		t.Fatal(err)
	}

	tests := []struct {
		name        string
		tokenString string
		tokenSecret string
		expected    string
	}{
		{
			name:        "Test Validate JWT SUCCESS",
			tokenString: validateJWTSuccess,
			tokenSecret: "Hello",
			expected:    "69b2fb9d-cd21-4722-a789-1010f074ea6b",
		},
	}

	for i, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			actual, err := auth.ValidateJWT(tc.tokenString, tc.tokenSecret)
			if err != nil {
				t.Errorf("could not validate jwt: %v\n", err)
			}

			if actual.String() != tc.expected {
				t.Errorf("Test %v - %s FAIL: expected: %v, actual %v\n", i, tc.name, tc.expected, actual)
			}
		})
	}
}

func TestValidateExpired(t *testing.T) {

	userID, err := uuid.Parse("69b2fb9d-cd21-4722-a789-1010f074ea6b")
	if err != nil {
		t.Errorf("could not parse userId: %v\n", err)
	}
	validateJWTExpired, err := auth.MakeJWT(userID, "Hello", time.Microsecond)
	if err != nil {
		t.Fatal(err)
	}

	tests := []struct {
		name        string
		tokenString string
		tokenSecret string
		expected    string
	}{
		{
			name:        "Test Validate JWT EXPIRED",
			tokenString: validateJWTExpired,
			tokenSecret: "Hello",
			expected:    uuid.Nil.String(),
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			_, err := auth.ValidateJWT(tc.tokenString, tc.tokenSecret)
			if err == nil {
				t.Error("JWT should be expired")
			}
		})
	}
}
