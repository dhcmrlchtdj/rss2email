package handler

import (
	"encoding/base64"
	"sync"

	"github.com/gofiber/fiber/v2"
)

func StaticWithoutCache(filename string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Set("cache-control", "no-cache")
		return c.SendFile(filename)
	}
}

func StaticWithCache(dirname string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Set("cache-control", "max-age=31536000, must-revalidate")
		filename := c.Params("filename")
		return c.SendFile(dirname + filename)
	}
}

func StaticRobots(c *fiber.Ctx) error {
	c.Set("cache-control", "max-age=86400, must-revalidate")
	return c.SendString("User-agent: *")
}

var (
	decodeIconOnce sync.Once
	icon           []byte
)

func StaticFavicon(c *fiber.Ctx) error {
	decodeIconOnce.Do(func() {
		icon, _ = base64.StdEncoding.DecodeString("iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABmklEQVR4AcWWgUeDQRjGD6iogFgCooCiP6ZWf0QIomq7NygmAFWr/pigJSEChNik7q5Ai7bwdK/vSF8tt6/b3cOP+Yz3vXvvnnuEr/BC4zDVFWh5Ak1XFm3pOjR/g6I6DC3DrI+JUIKhWVv0zPJmgR/8XzqF3p4pXri1NgJF+9Dyw4JiUBeGarinYdGPuHNoeWtBIBowm5OexSsL2UwlAtOConmPlYcunmtCU0n8Jp4TNN0MsLiDrvl8ibzcgUMUlNz5edXcaY/E67dRuHuOqBg6+HI4ZzJxoTbYMZ29Ig3VsmBvT9aAkscie1gkEtHgHTAJG1ACSnbSNUDv6RtIPoL0h1BRPd01pCPBGS6hES3yCEYt7RRWzLUFiwNkgu2v55NQN6IFd6BoOp8JahF3YK9HJJONCLO/wN3qUI9QSiVLc4ANPOB5a0r8JY7OnF7DF6cmnipzwkd43JiAludBt91lQG/xnDi9/scjsoeOdt3Mi4k75wDZXyPU5rTjrloQOcesltm/YeiSXzJeIcO/+RuMPISmJedwXvoEIKUq7CctWTEAAAAASUVORK5CYII")
	})
	c.Set("content-type", "image/png")
	c.Set("cache-control", "max-age=86400, must-revalidate")
	return c.Send(icon)
}
