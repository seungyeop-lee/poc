FROM python:3.12-slim

RUN pip install poetry==1.8.3

WORKDIR /code

COPY poetry.lock pyproject.toml ./

RUN poetry install --no-root

COPY . .

CMD ["poetry", "run", "uvicorn", "ai_service.main:app", "--host", "0.0.0.0", "--port", "8081"]
