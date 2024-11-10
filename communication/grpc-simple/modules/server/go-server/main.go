package main

import (
	"context"
	"fmt"
	"log"
	"net"

	"google.golang.org/grpc"

	pb "github.com/seungyeop-lee/poc/communication/grpc-simple/proto/go/grpcsimple"
)

type server struct {
	pb.UnimplementedSimpleServiceServer
}

func (s *server) SendData(ctx context.Context, req *pb.DataRequest) (*pb.DataResponse, error) {
	name := req.GetName()
	data := string(req.GetData())

	fmt.Printf("request data: name => %s, data => %s\n", name, data)

	return &pb.DataResponse{
		ResultMessage: fmt.Sprintf("from go-server: %s", name),
		ResultData:    []byte(fmt.Sprintf("from go-server: %s", data)),
	}, nil
}

func main() {
	lis, err := net.Listen("tcp", ":50052")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterSimpleServiceServer(s, &server{})

	fmt.Println("Server started on port 50052")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
