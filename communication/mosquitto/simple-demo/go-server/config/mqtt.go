package config

import (
	"log"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

type MQTT struct {
	Client mqtt.Client
}

func NewMQTT() *MQTT {
	opts := mqtt.NewClientOptions()
	opts.AddBroker("tcp://localhost:1883")
	opts.SetClientID("go-server")

	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.Fatal(token.Error())
	}

	return &MQTT{
		Client: client,
	}
}

func (m *MQTT) Close() {
	m.Client.Disconnect(250)
}
