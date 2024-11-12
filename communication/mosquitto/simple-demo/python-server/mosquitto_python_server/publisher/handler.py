import base64
import json
import time

from fastapi import APIRouter

from mosquitto_python_server.common.types import PayloadMessage
from mosquitto_python_server.common.values import TOPIC_PREFIX, QOS
from mosquitto_python_server.config.mqtt import MQTT

router = APIRouter()


class Handler:
    def __init__(self, mqtt: MQTT):
        self.mqtt = mqtt
        self.router = router

    def setup_routes(self):
        self.router.add_api_route("/publish", self.publish_message, methods=["POST"])

    async def publish_message(self):
        payload = PayloadMessage(
            name="from python server",
            currentTime=int(time.time() * 1000),
            enable=True,
            data=base64.b64encode(b"Hello from Python MQTT!").decode('utf-8')
        )

        message = json.dumps(payload.model_dump(by_alias=True))
        topic = TOPIC_PREFIX + "python"
        self.mqtt.client.publish(topic, message, QOS)

        return {"status": "ok"}
