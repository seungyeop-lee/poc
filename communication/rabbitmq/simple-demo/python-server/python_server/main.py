import logging
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI

from python_server.config.rabbitmq import RabbitMQ
from python_server.consumer.listener import Listener
from python_server.publisher.handler import Handler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logging.basicConfig(level=logging.INFO)
    
    rabbit = RabbitMQ()
    await rabbit.connect()
    app.state.rabbit = rabbit

    listener = Listener(rabbit)
    await listener.start_consuming()

    handler = Handler(rabbit)
    handler.setup_routes()
    app.include_router(handler.router)
    
    yield
    
    # Shutdown
    await app.state.rabbit.close()

app = FastAPI(lifespan=lifespan)

if __name__ == "__main__":
    uvicorn.run("python_server.main:app", host="0.0.0.0", port=8082, reload=True)
