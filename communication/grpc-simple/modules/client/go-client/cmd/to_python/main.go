package main

import (
	"fmt"
	"github.com/seungyeop-lee/poc/communication/grpc-simple/client/go-client/internal"
)

const ServerUrl = "localhost:50053"

func main() {
	fmt.Println("client to python server")
	internal.Request(ServerUrl)
}
