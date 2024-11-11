import aio_pika


class RabbitMQ:
    def __init__(self):
        self.connection = None
        self.channel = None

    async def connect(self):
        self.connection = await aio_pika.connect_robust(
            "amqp://admin:password@localhost:5672/"
        )
        self.channel = await self.connection.channel()

    async def close(self):
        if self.channel:
            await self.channel.close()
        if self.connection:
            await self.connection.close()