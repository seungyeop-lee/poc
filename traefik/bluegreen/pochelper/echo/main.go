package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	name := os.Args[1]

	srv := &http.Server{Addr: ":80"}

	http.HandleFunc("/", requestHandler(name))

	fmt.Println("Listening on :80...")
	go func() {
		if err := srv.ListenAndServe(); err != nil {
			fmt.Printf("Server failed: %s\n", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	fmt.Println("서버가 종료되고 있습니다...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		fmt.Printf("서버 셧다운 에러: %s\n", err)
	}
	fmt.Println("서버가 안전하게 종료되었습니다.")

	// 서버가 완전히 종료될 때까지 대기
	<-ctx.Done()
	fmt.Println("서버 종료 완료")
}

type RequestInfo struct {
	FullURL string              `json:"fullURL"`
	Path    string              `json:"path"`
	Method  string              `json:"method"`
	Query   map[string][]string `json:"query"`
	Headers map[string][]string `json:"headers"`
	Body    string              `json:"body"`
}

func requestHandler(name string) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, err := w.Write([]byte(fmt.Sprintf("Hello, %s!\n", name)))
		if err != nil {
			fmt.Printf("응답 쓰기 에러: %s\n", err)
		}
	}
}
