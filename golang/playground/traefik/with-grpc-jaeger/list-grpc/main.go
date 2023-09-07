package main

import (
	"context"
	"fmt"
	"github.com/grpc-ecosystem/grpc-opentracing/go/otgrpc"
	"github.com/opentracing/opentracing-go"
	"github.com/seungyeop-lee/go-playground/traefik/with-grpc-jaeger/list-grpc/listpb"
	"github.com/uber/jaeger-client-go/config"
	"google.golang.org/grpc"
	"log"
	"net"
)

type server struct {
}

func (s server) List(ctx context.Context, req *listpb.ListRequest) (*listpb.ListResponse, error) {
	fmt.Println("execute /list/List")
	parent := opentracing.SpanFromContext(ctx)
	pctx := parent.Context()
	span := opentracing.GlobalTracer().StartSpan("/list/List in gRPC Server", opentracing.ChildOf(pctx))
	defer span.Finish()

	return &listpb.ListResponse{
		List: []string{"l", "i", "s", "t", "!!!"},
	}, nil
}

func main() {
	fmt.Println("start to init server")

	lis, err := net.Listen("tcp", "0.0.0.0:50051")
	if err != nil {
		log.Fatalf("failed to create Listener: %v", err)
	}

	tracer := createTracer()
	opts := []grpc.ServerOption{
		grpc.UnaryInterceptor(
			otgrpc.OpenTracingServerInterceptor(tracer, otgrpc.LogPayloads()),
		),
	}

	s := grpc.NewServer(
		opts...,
	)

	listpb.RegisterListServiceServer(s, server{})

	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve gRPC server: %v", err)
	}
}

func createTracer() opentracing.Tracer {
	// env를 통해 jaeger host를 포함한 config 생성
	cfg, err := config.FromEnv()
	if err != nil {
		log.Printf("Could not parse Jaeger env vars: %s", err.Error())
	}
	cfg.ServiceName = "list-grpc-service"

	// config를 통해 tracer 생성
	tracer, _, _ := cfg.NewTracer()
	//defer closer.Close()

	// 생성한 tracer를 GlobalTracer로 등록
	opentracing.SetGlobalTracer(tracer)

	tracer = opentracing.GlobalTracer()
	return tracer
}
