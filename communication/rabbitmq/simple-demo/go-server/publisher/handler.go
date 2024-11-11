package publisher

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	amqp "github.com/rabbitmq/amqp091-go"

	"github.com/seungyeop-lee/poc/communication/rabbitmq/simple-demo/go-server/common"
	"github.com/seungyeop-lee/poc/communication/rabbitmq/simple-demo/go-server/config"
)

type Handler struct {
	rabbit *config.RabbitMQ
}

func NewHandler(rabbit *config.RabbitMQ) *Handler {
	return &Handler{rabbit: rabbit}
}

func (h *Handler) Apply(e *echo.Echo) {
	e.POST("/publish", h.PublishMessage)
}

func (h *Handler) PublishMessage(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	payload := common.PayloadMessage{
		Name:        "from go server",
		CurrentTime: time.Now().UnixMilli(),
		Enable:      true,
		Data:        []byte("Hello from Go RabbitMQ!"),
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	err = h.rabbit.Channel.PublishWithContext(ctx,
		common.ExchangeName,
		"poc.communication.rabbitmq.go",
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		})
	if err != nil {
		return err
	}

	return c.NoContent(http.StatusOK)
}
