package main

import (
	"embed"
	"errors"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"log"
	"net/http"
)

//go:embed frontend/dist/*
var distDir embed.FS

func main() {
	e := echo.New()
	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		HTML5:      true,
		Root:       "frontend/dist",
		Filesystem: http.FS(distDir),
	}))

	if err := e.Start(":8080"); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}
