FROM golang:1-alpine AS app-builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -gcflags "all=-N -l" -o /app/build/main


FROM alpine:3

WORKDIR /app

COPY --from=app-builder /app/build/main ./

ENTRYPOINT ["./main"]
