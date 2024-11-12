package consumer

import (
	"encoding/json"
	"log"

	mqtt "github.com/eclipse/paho.mqtt.golang"

	"github.com/seungyeop-lee/poc/communication/mosquitto/simple-demo/go-server/common"
	"github.com/seungyeop-lee/poc/communication/mosquitto/simple-demo/go-server/config"
)

type Listener struct {
	mqtt *config.MQTT
}

func NewListener(mqtt *config.MQTT) *Listener {
	return &Listener{mqtt: mqtt}
}

func (l *Listener) StartConsuming() error {
	topic := common.TopicPrefix + "#"
	token := l.mqtt.Client.Subscribe(topic, common.QoS, func(client mqtt.Client, msg mqtt.Message) {
		var payload common.PayloadMessage
		_ = json.Unmarshal(msg.Payload(), &payload)
		log.Printf("Received Message: %+v\n", payload)
		log.Printf("Received Message Data: %s\n", string(payload.Data))
		log.Printf("Received Topic: %s\n", msg.Topic())
	})

	if token.Wait() && token.Error() != nil {
		return token.Error()
	}

	return nil
}
