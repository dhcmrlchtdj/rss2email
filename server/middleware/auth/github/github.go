package github

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

type Profile struct {
	ID    int64  `json:"id"`
	Email string `json:"email,omitempty"`
}

type Config struct {
	ClientID     string
	ClientSecret string
}

func New(cfg Config) fiber.Handler {
	conf := &oauth2.Config{
		ClientID:     cfg.ClientID,
		ClientSecret: cfg.ClientSecret,
		Endpoint:     github.Endpoint,
		Scopes:       []string{"user:email"},
	}

	fetchProfile := func(code string) (*Profile, error) {
		authToken, err := conf.Exchange(context.Background(), code)
		if err != nil {
			return nil, errors.Wrap(err, "github login exchange")
		}
		client := conf.Client(context.Background(), authToken)

		profile, err := getProfile(client)
		if err != nil {
			return nil, errors.Wrap(err, "github login profile")
		}
		if profile.Email == "" {
			email, err := getEmail(client)
			if err != nil {
				return nil, errors.Wrap(err, "github login email")
			}
			profile.Email = email
		}

		return profile, nil
	}

	return func(c *fiber.Ctx) error {
		code := c.Query("code")
		if code == "" {
			url := conf.AuthCodeURL("state")
			return c.Redirect(url)
		}
		profile, err := fetchProfile(code)
		if err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, err.Error())
		}
		c.Locals("credential", profile)
		return c.Next()
	}
}
