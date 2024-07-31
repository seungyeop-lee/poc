from fastapi import FastAPI
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

from ai_service.otel import init_otel
from ai_service.routers import router

init_otel()

app = FastAPI()
app.include_router(router)

FastAPIInstrumentor.instrument_app(app)
