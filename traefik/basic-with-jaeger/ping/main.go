package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/opentracing/opentracing-go"
	"github.com/opentracing/opentracing-go/ext"
	"github.com/uber/jaeger-client-go/config"
	"log"
	"net/http"
	"time"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/ping", pingHandler())
	http.ListenAndServe(":8080", r)
}

func pingHandler() func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		// env를 통해 jaeger host를 포함한 config 생성
		cfg, err := config.FromEnv()
		if err != nil {
			log.Printf("Could not parse Jaeger env vars: %s", err.Error())
		}
		cfg.ServiceName = "ping-service"

		// config를 통해 tracer 생성
		tracer, closer, _ := cfg.NewTracer()
		defer closer.Close()

		// 생성한 tracer를 GlobalTracer로 등록
		opentracing.SetGlobalTracer(tracer)

		// spanContext를 헤더로부터 추출한다.
		wireCtx, _ := opentracing.GlobalTracer().Extract(
			opentracing.HTTPHeaders,
			opentracing.HTTPHeadersCarrier(r.Header))

		// 새로운 span을 시작한다.
		serverSpan := opentracing.StartSpan(r.URL.Path,
			ext.RPCServerOption(wireCtx))
		defer serverSpan.Finish()

		// span에 대한 정보를 context에 포함하여
		// 다른 곳에서 context를 통해 span에 접근이 가능하도록 한다.
		r = r.WithContext(opentracing.ContextWithSpan(r.Context(), serverSpan))

		// 1초 대기 (확인용)
		time.Sleep(time.Second * 1)

		w.WriteHeader(200)
		fmt.Fprintln(w, "pong")
	}
}
