package main

import (
	"context"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/grpc-ecosystem/grpc-opentracing/go/otgrpc"
	"github.com/opentracing/opentracing-go"
	"github.com/opentracing/opentracing-go/ext"
	"github.com/seungyeop-lee/go-playground/traefik/with-grpc-jaeger/list-web/listpb"
	"github.com/uber/jaeger-client-go/config"
	"google.golang.org/grpc"
	"log"
	"net/http"
)

const (
	ListModuleAddr = "list-grpc:50051"
)

func main() {
	fmt.Println("start to init client")

	r := mux.NewRouter()
	r.HandleFunc("/list", listHandler())
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("failed to execute http.ListenAndServe(): %v", err)
	}
}

func listHandler() func(w http.ResponseWriter, r *http.Request) {
	fmt.Println("start to listen /list")
	c := getClient()
	return func(w http.ResponseWriter, r *http.Request) {
		// spanContext를 헤더로부터 추출한다.
		wireCtx, _ := opentracing.GlobalTracer().Extract(
			opentracing.HTTPHeaders,
			opentracing.HTTPHeadersCarrier(r.Header))

		// 새로운 span을 시작한다.
		span := opentracing.StartSpan(r.URL.Path,
			ext.RPCServerOption(wireCtx))
		defer span.Finish()

		ctx := opentracing.ContextWithSpan(context.Background(), span)

		req := listpb.ListRequest{}
		res, err := c.List(ctx, &req)
		if err != nil {
			log.Fatalf("failed to execute List(): %v", err)
		}

		w.WriteHeader(200)
		fmt.Fprintf(w, "%v", res.List)
	}
}

func getClient() listpb.ListServiceClient {
	tracer := createTracer()

	cc, err := grpc.Dial(ListModuleAddr,
		grpc.WithInsecure(),
		grpc.WithUnaryInterceptor(
			otgrpc.OpenTracingClientInterceptor(tracer, otgrpc.LogPayloads())),
	)
	if err != nil {
		log.Fatalf("failed to create ClientConn: %v", err)
	}

	c := listpb.NewListServiceClient(cc)

	return c
}

func createTracer() opentracing.Tracer {
	// env를 통해 jaeger host를 포함한 config 생성
	cfg, err := config.FromEnv()
	if err != nil {
		log.Printf("Could not parse Jaeger env vars: %s", err.Error())
	}
	cfg.ServiceName = "list-web-service"

	// config를 통해 tracer 생성
	// closer의 close()를 호출 할 경우 tracer는 사용 할 수 없으니 주의!
	tracer, _, err := cfg.NewTracer()
	if err != nil {
		log.Printf("failed to create tracer: %v", err)
	}

	// 생성한 tracer를 GlobalTracer로 등록
	opentracing.SetGlobalTracer(tracer)

	return opentracing.GlobalTracer()
}