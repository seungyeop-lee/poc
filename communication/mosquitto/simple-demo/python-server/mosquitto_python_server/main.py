import logging
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI

from mosquitto_python_server.config.mqtt import MQTT
from mosquitto_python_server.consumer.listener import Listener
from mosquitto_python_server.publisher.handler import Handler

# Configure logging
logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup MQTT
    mqtt_client = MQTT()

    # Setup consumer
    listener = Listener(mqtt_client)
    listener.start_consuming()

    # Setup HTTP routes
    handler = Handler(mqtt_client)
    handler.setup_routes()
    app.include_router(handler.router)

    yield

    # Cleanup
    mqtt_client.close()


app = FastAPI(lifespan=lifespan)

if __name__ == "__main__":
    uvicorn.run("mosquitto_python_server.main:app", host="0.0.0.0", port=8082, reload=True)
