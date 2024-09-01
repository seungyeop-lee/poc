FROM golang:1.23-alpine AS build

WORKDIR /app

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o echo .

FROM alpine:edge

WORKDIR /app

EXPOSE 80

COPY --from=build /app/echo .
