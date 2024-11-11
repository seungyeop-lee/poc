package main

import (
	"fmt"
	"github.com/seungyeop-lee/poc/communication/grpc-simple/client/go-client/internal"
)

const ServerUrl = "localhost:50051"

func main() {
	fmt.Println("client to java server")
	internal.Request(ServerUrl)
}
