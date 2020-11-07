package handler

import (
	"github.com/gofiber/fiber/v2"
)

func StaticWithoutCache(filename string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Request().Header.Del("If-Modified-Since")
		if err := c.SendFile(filename); err != nil {
			return err
		}
		c.Set("cache-control", "no-cache, must-revalidate")
		return nil
	}
}

func StaticWithCache(dirname string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		filename := c.Params("filename")
		c.Request().Header.Del("If-Modified-Since")
		if err := c.SendFile(dirname + filename); err != nil {
			return err
		}
		c.Set("cache-control", "max-age=31536000, must-revalidate") // 60*60*24*365 = 365day
		return nil
	}
}

func StaticRobots(c *fiber.Ctx) error {
	c.Set("cache-control", "max-age=604800, must-revalidate") // 60*60*24*7 = 7day
	return c.SendString("User-agent: *")
}

var icon = []byte(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
<path fill="#f3f3f3" d="M-150-82h500v500h-500V-82z"/>
<path fill="#303841" d="M100 12l75 43.75v87.5L100 187l-75-43.75v-87.5L100 12z"/>
<path fill="#f3f3f3" fill-rule="evenodd" d="M177.15 249.7l.76.93-1.83 1.54-.76-.93-46.58-56.79 1.23-2.26 47.18 57.51zM-34.24-4.24l-.76-.93 1.83-1.54.76.93 94.22 114.86-1.13 2.41L-34.24-4.24zm162.58 194.43l-1.24 2.27-41.3-50.35 1.24-2.27 41.3 50.35zm-65.98-76.66l1.13-2.4 21.91 26.72-1.23 2.27-21.81-26.59zm67.61 78.66l-1.63-2 32.2-59.13 1.52 2.21-32.09 58.92zM232.34-.78l.58-1.05L235-.67l-.57 1.06-71.09 130.53-1.52-2.21L232.34-.78zM127.1 192.46l1.64 1.99-28.86 52.99-.57 1.05-2.09-1.16.58-1.06 29.3-53.81zm-142.68 87.45l-.51 1.09-2.15-1.03.51-1.09 78.41-167.39 1.68 2.04-77.94 166.38zm79.07-168.78l-1.68-2.05 33.95-72.47 1.57 2.28-33.84 72.24zM113.24-.71l.51-1.09 2.15 1.03-.51 1.09L98.5 36.38l-1.56-2.28 16.3-34.81zm-26.2 140.55l-1.64-1.99L120.72 73l1.52 2.21-35.2 64.63zM160.9-.78l.57-1.05 2.09 1.16-.57 1.06-39.47 72.47-1.52-2.21L160.9-.78zm-76.73 140.9l1.63 1.99-57.36 105.33-.57 1.05-2.09-1.16.58-1.06 57.81-106.15zm135.9 73.51l-56.73-82.71-1.28 2.35 56.06 81.74.68.99 1.95-1.38-.68-.99zM20.04-78.01l-.68-.99-1.95 1.37.68.99L95.76 36.61l1.18-2.51-76.9-112.11zm140.5 209.07l1.28-2.35-38.3-55.85-1.28 2.35 38.3 55.85zM98.5 36.38l-1.17 2.51L120.72 73l1.28-2.35-23.5-34.27z"/>
</svg>
`)

func StaticFavicon(c *fiber.Ctx) error {
	c.Set("content-type", "image/svg+xml")
	c.Set("cache-control", "max-age=604800, must-revalidate") // 60*60*24*7 = 7day
	return c.Send(icon)
}
