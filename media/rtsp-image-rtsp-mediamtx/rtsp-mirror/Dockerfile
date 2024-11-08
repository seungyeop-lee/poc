FROM game1987/ffmpeg-gocv:7.1-0.39.0-arm64 AS app-builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=1 GOOS=linux go build -o /app/build/main

FROM app-builder AS app

WORKDIR /app

COPY --from=app-builder /app/build/main ./

ENTRYPOINT ["./main"]
