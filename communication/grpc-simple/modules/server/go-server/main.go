package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
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
	noticeStopWebServer := make(chan bool)
	noticeStopGrpcServer := make(chan bool)

	go runWebServer(noticeStopWebServer)
	go runGrpcServer(noticeStopGrpcServer)

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

	stopDone := make(chan bool)
	go func() {
		// 종료 시그널 발생 대기
		<-sigs

		// runner 정지
		noticeStopWebServer <- true
		noticeStopGrpcServer <- true

		// runner 정지 완료 신호 발생
		stopDone <- true
	}()
	// runner 정지 완료 신호 대기
	<-stopDone
}

func runWebServer(stopSignal chan bool) {
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/hello", func(c echo.Context) error {
		return c.String(200, "Hello, Go Server!")
	})

	go func() {
		if err := e.Start(":1323"); err != nil && !errors.Is(err, http.ErrServerClosed) {
			e.Logger.Fatal("shutting down the server")
		}
	}()

	<-stopSignal

	// graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := e.Shutdown(ctx); err != nil {
		e.Logger.Fatal(err)
	}
}

func runGrpcServer(stopSignal chan bool) {
	lis, err := net.Listen("tcp", ":50052")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterSimpleServiceServer(s, &server{})

	fmt.Println("Server started on port 50052")
	go func() {
		if err := s.Serve(lis); err != nil {
			log.Fatalf("failed to serve: %v", err)
		}
	}()

	<-stopSignal

	s.GracefulStop()
}
