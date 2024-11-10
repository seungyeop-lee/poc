package internal

import (
	"context"
	"fmt"
	"time"

	"github.com/seungyeop-lee/poc/communication/grpc-simple/proto/go/grpcsimple"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

const ResponseOutputFormat = `Response:
Message: %s
Data: %s
`

func Request(url string) {
	// gRPC 서버에 연결
	conn, err := grpc.NewClient(url, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	// 클라이언트 생성
	client := grpcsimple.NewSimpleServiceClient(conn)

	// Context 생성 (타임아웃 5초)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	// 요청 데이터 준비
	request := &grpcsimple.DataRequest{
		Name: "from golang",
		Data: []byte("this is data from golang"),
	}

	// 데이터 전송
	response, err := client.SendData(ctx, request)
	if err != nil {
		panic(err)
	}

	// 응답 출력
	fmt.Printf(ResponseOutputFormat, response.ResultMessage, string(response.ResultData))
}
