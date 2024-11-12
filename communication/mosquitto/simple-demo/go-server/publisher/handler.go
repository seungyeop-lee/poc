package publisher

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"

	"github.com/seungyeop-lee/poc/communication/mosquitto/simple-demo/go-server/common"
	"github.com/seungyeop-lee/poc/communication/mosquitto/simple-demo/go-server/config"
)

type Handler struct {
	mqtt *config.MQTT
}

func NewHandler(mqtt *config.MQTT) *Handler {
	return &Handler{mqtt: mqtt}
}

func (h *Handler) Apply(e *echo.Echo) {
	e.POST("/publish", h.PublishMessage)
}

func (h *Handler) PublishMessage(c echo.Context) error {
	payload := common.PayloadMessage{
		Name:        "from go server",
		CurrentTime: time.Now().UnixMilli(),
		Enable:      true,
		Data:        []byte("Hello from Go MQTT!"),
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	topic := common.TopicPrefix + "go"
	token := h.mqtt.Client.Publish(topic, common.QoS, false, body)
	if token.Wait() && token.Error() != nil {
		return token.Error()
	}

	return c.NoContent(http.StatusOK)
}
