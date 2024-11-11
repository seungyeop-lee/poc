import base64
import json
import time

import aio_pika
from fastapi import APIRouter

from python_server.common.constants import EXCHANGE_NAME
from python_server.common.types import PayloadMessage
from python_server.config.rabbitmq import RabbitMQ

router = APIRouter()


class Handler:
    def __init__(self, rabbit: RabbitMQ):
        self.rabbit = rabbit
        self.router = router

    def setup_routes(self):
        self.router.add_api_route("/publish", self.publish_message, methods=["POST"])

    async def publish_message(self):
        payload = PayloadMessage(
            name="from python server",
            current_time=int(time.time() * 1000),
            enable=True,
            data=base64.b64encode(b"Hello from Python RabbitMQ!").decode('utf-8'),
        )

        exchange = await self.rabbit.channel.declare_exchange(
            EXCHANGE_NAME,
            aio_pika.ExchangeType.TOPIC,
            durable=True,
        )

        message = aio_pika.Message(
            body=json.dumps(payload.model_dump(by_alias=True)).encode(),
            content_type="application/json",
        )

        await exchange.publish(
            message,
            routing_key="poc.communication.rabbitmq.python",
        )

        return {"status": "ok"}