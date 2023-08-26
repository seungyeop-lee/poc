package fx

import (
	"context"
	"go.uber.org/fx"
	"log"
	"net/http"
	"os"
	"testing"
)

func NewLogger() *log.Logger {
	logger := log.New(os.Stdout, "", 0)
	logger.Print("Executing NewLogger.")
	return logger
}

func NewHandler(logger *log.Logger) (http.Handler, error) {
	logger.Print("Executing NewHandler.")
	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			logger.Print("Got a request.")
		},
	), nil
}

func NewMux(lc fx.Lifecycle, logger *log.Logger) *http.ServeMux {
	logger.Print("Executing NewMux.")
	mux := http.NewServeMux()
	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}
	lc.Append(fx.Hook{
		OnStart: func(context.Context) error {
			logger.Print("Starting HTTP server.")
			go server.ListenAndServe()
			return nil
		},
		OnStop: func(ctx context.Context) error {
			logger.Print("Stopping HTTP server.")
			return server.Shutdown(ctx)
		},
	})

	return mux
}

func Register(mux *http.ServeMux, h http.Handler) {
	mux.Handle("/", h)
}

func TestExample(t *testing.T) {
	app := fx.New(
		fx.Logger(&emptyPrinter{}),	// 자체 logging 무시
		fx.Provide(	// 의존성 관계를 확인 및 주입
			NewLogger,
			NewHandler,
			NewMux,
		),
		fx.Invoke(Register),	// 의존성 설정이 완료된 상태에서의 실행 (entry point)
	)

	app.Start(context.Background())
	//startCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	//defer cancel()
	//if err := app.Start(startCtx); err != nil {
	//	log.Fatal(err)
	//}

	http.Get("http://localhost:8080/")

	app.Stop(context.Background())
	//stopCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	//defer cancel()
	//if err := app.Stop(stopCtx); err != nil {
	//	log.Fatal(err)
	//}

	// Output:
	// Executing NewLogger.
	// Executing NewMux.
	// Executing NewHandler.
	// Starting HTTP server.
	// Got a request.
	// Stopping HTTP server.
}

type emptyPrinter struct {}
func (p *emptyPrinter) Printf(string, ...interface{}) {}