package main

import (
	"context"
	"fmt"
	"github.com/seungyeop-lee/go-playground/mux/with-grpc/listpb"
	"google.golang.org/grpc"
	"log"
	"net"
)

type server struct {
}

func (s server) List(ctx context.Context, req *listpb.ListRequest) (*listpb.ListResponse, error) {
	fmt.Println("execute /list/List")
	return &listpb.ListResponse{
		List: []string{"l", "i", "s", "t", "!!!"},
	}, nil
}

func main() {
	fmt.Println("start to init server")

	lis, err := net.Listen("tcp", "0.0.0.0:8081")
	if err != nil {
		log.Fatalf("failed to create Listener: %v", err)
	}

	s := grpc.NewServer()

	listpb.RegisterListServiceServer(s, server{})

	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve gRPC server: %v", err)
	}
}
