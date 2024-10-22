package main

import (
	"github.com/labstack/echo/v4"
	"io"
	"net/http"
)

func main() {
	e := echo.New()
	e.GET("/hello", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World! from Go Server")
	})
	e.GET("/spring-hello", func(c echo.Context) error {
		resp, err := http.Get("http://localhost:8080/hello")
		defer resp.Body.Close()

		if err != nil {
			return c.String(http.StatusInternalServerError, "Error while calling Spring Boot Server")
		} else {
			body, _ := io.ReadAll(resp.Body)
			return c.String(http.StatusOK, string(body))
		}
	})
	e.Logger.Fatal(e.Start(":8081"))
}
