import base64
import json
import logging

from mosquitto_python_server.common.types import PayloadMessage
from mosquitto_python_server.common.values import TOPIC_PREFIX, QOS
from mosquitto_python_server.config.mqtt import MQTT

from paho.mqtt.client import MQTTMessage, Client


class Listener:
    def __init__(self, mqtt: MQTT):
        self.mqtt = mqtt

    def start_consuming(self):
        def on_message(_: Client, userdata, msg: MQTTMessage):
            payload = json.loads(msg.payload.decode())
            message = PayloadMessage(**payload)
            logging.info(f"Received Message: {message}")
            logging.info(f"Received Message Data: {base64.b64decode(message.data).decode('utf-8')}")
            logging.info(f"Received Topic: {msg.topic}")

        self.mqtt.client.on_message = on_message
        self.mqtt.client.subscribe(TOPIC_PREFIX + "#", QOS)
