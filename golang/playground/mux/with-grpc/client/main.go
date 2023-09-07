package main

import (
	"context"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/seungyeop-lee/go-playground/mux/with-grpc/listpb"
	"google.golang.org/grpc"
	"log"
	"net/http"
)

const (
	ListModuleAddr = ":8081"
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
		req := listpb.ListRequest{}
		res, err := c.List(context.Background(), &req)
		if err != nil {
			log.Fatalf("failed to execute List(): %v", err)
		}

		w.WriteHeader(200)
		fmt.Fprintf(w, "%v", res.List)
	}
}

func getClient() listpb.ListServiceClient {
	cc, err := grpc.Dial(ListModuleAddr, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("failed to create ClientConn: %v", err)
	}
	c := listpb.NewListServiceClient(cc)
	return c
}
