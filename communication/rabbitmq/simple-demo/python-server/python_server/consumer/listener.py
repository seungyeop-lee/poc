import base64
import json
import logging

import aio_pika

from python_server.common.constants import EXCHANGE_NAME, QUEUE_NAME
from python_server.common.types import PayloadMessage
from python_server.config.rabbitmq import RabbitMQ


class Listener:
    def __init__(self, rabbit: RabbitMQ):
        self.rabbit = rabbit

    async def start_consuming(self):
        queue = await self.setup_exchange_and_queue()
        await queue.consume(handle_message)

    async def setup_exchange_and_queue(self):
        exchange = await self.rabbit.channel.declare_exchange(
            name=EXCHANGE_NAME,
            type=aio_pika.ExchangeType.TOPIC,
            durable=True,
        )

        queue = await self.rabbit.channel.declare_queue(
            QUEUE_NAME,
            durable=True,
        )

        await queue.bind(
            exchange=exchange,
            routing_key="poc.communication.rabbitmq.#",
        )
        return queue


async def handle_message(message: aio_pika.IncomingMessage):
    async with message.process():
        logging.info(f"Received ContentType: {message.content_type}")
        body = json.loads(message.body.decode())
        payload = PayloadMessage(**body)
        logging.info(f"Received Message: {payload}")
        logging.info(f"Received Message Data: {base64.b64decode(payload.data).decode('utf-8')}")
        logging.info(f"Received RoutingKey: {message.routing_key}")
