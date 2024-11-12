package main

import (
	"errors"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/seungyeop-lee/poc/communication/mosquitto/simple-demo/go-server/config"
	"github.com/seungyeop-lee/poc/communication/mosquitto/simple-demo/go-server/consumer"
	"github.com/seungyeop-lee/poc/communication/mosquitto/simple-demo/go-server/publisher"
)

func main() {
	mqtt := config.NewMQTT()
	defer mqtt.Close()

	// Setup consumer
	listener := consumer.NewListener(mqtt)
	err := listener.StartConsuming()
	if err != nil {
		log.Fatal(err)
	}

	// Setup HTTP server
	e := echo.New()
	handler := publisher.NewHandler(mqtt)
	handler.Apply(e)

	if err := e.Start(":8081"); !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}
