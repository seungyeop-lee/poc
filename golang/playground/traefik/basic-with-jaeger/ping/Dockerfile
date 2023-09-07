FROM golang:alpine

WORKDIR /app

COPY . .

RUN go mod download \
  && go build main.go

ENTRYPOINT ./main