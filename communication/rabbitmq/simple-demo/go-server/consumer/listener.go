package consumer

import (
	"encoding/json"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"

	"github.com/seungyeop-lee/poc/communication/rabbitmq/simple-demo/go-server/common"
	"github.com/seungyeop-lee/poc/communication/rabbitmq/simple-demo/go-server/config"
)

type Listener struct {
	rabbit *config.RabbitMQ
}

func NewListener(rabbit *config.RabbitMQ) *Listener {
	return &Listener{rabbit: rabbit}
}

func (l *Listener) StartConsuming() error {
	err := l.setupExchangeAndQueue()
	if err != nil {
		return err
	}

	msgs, err := l.rabbit.Channel.Consume(
		common.QueueName,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	go l.handleMessages(msgs)
	return nil
}

func (l *Listener) setupExchangeAndQueue() error {
	err := l.rabbit.Channel.ExchangeDeclare(
		common.ExchangeName,
		"topic",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	q, err := l.rabbit.Channel.QueueDeclare(
		common.QueueName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	return l.rabbit.Channel.QueueBind(
		q.Name,
		"poc.communication.rabbitmq.#",
		common.ExchangeName,
		false,
		nil,
	)
}

func (l *Listener) handleMessages(msgs <-chan amqp.Delivery) {
	for msg := range msgs {
		log.Printf("Received ContentType: %s", msg.ContentType)

		var payload common.PayloadMessage
		_ = json.Unmarshal(msg.Body, &payload)
		log.Printf("Received Message: %+v\n", payload)
		log.Printf("Received Message Data: %s\n", string(payload.Data))
		log.Printf("Received RoutingKey: %s\n", msg.RoutingKey)
	}
}
