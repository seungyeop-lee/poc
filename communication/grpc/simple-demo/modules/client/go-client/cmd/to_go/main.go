package main

import (
	"fmt"
	"github.com/seungyeop-lee/poc/communication/grpc-simple/client/go-client/internal"
)

const ServerUrl = "localhost:50052"

func main() {
	fmt.Println("client to go server")
	internal.Request(ServerUrl)
}
