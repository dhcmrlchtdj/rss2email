package email

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/pkg/errors"

	"github.com/dhcmrlchtdj/feedbox/internal/multipart"
)

var C *Client = nil

type Client struct {
	urlPrefix string
	from      string
	apiKey    string
	client    *http.Client
}

func New(domain string, apiKey string, from string) *Client {
	return &Client{
		urlPrefix: "https://api.mailgun.net/v3/" + domain,
		from:      from,
		apiKey:    apiKey,
		client:    &http.Client{},
	}
}

func (c *Client) Send(addr string, subject string, text string) error {
	var payload bytes.Buffer
	m := multipart.New(&payload).
		Str("from", c.from).
		Str("to", addr).
		Str("subject", subject).
		Str("text", text).
		Str("html", text).
		Str("o:dkim", "yes")
	if err := m.Close(); err != nil {
		return err
	}

	req, err := http.NewRequest("POST", c.urlPrefix+"/messages", &payload)
	if err != nil {
		return err
	}
	req.SetBasicAuth("api", c.apiKey)
	req.Header.Set("content-type", m.ContentType)

	resp, err := c.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		e := errors.New(resp.Status)
		var r struct {
			Message string `json:"message,omitempty"`
		}
		if err := json.NewDecoder(resp.Body).Decode(&r); err != nil {
			return errors.Wrap(e, err.Error())
		}
		return errors.Wrap(e, r.Message)
	}

	return nil
}
