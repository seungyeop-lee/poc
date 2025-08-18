package main

import (
	"log"
	"net"
	"time"

	"github.com/seungyeop-lee/poc/tunnel/simple/tunnel/internal/util"
)

const (
	tunnelServerAddr = "0.0.0.0:9000" // 실제로는 서버의 공용 IP
	localServiceAddr = "0.0.0.0:8000" // 연결할 실제 로컬 웹서버 주소
)

func main() {
	log.Println("클라이언트 시작...")

	// 서버가 재시작할 수도 있으므로, 연결이 끊어지면 계속 재시도
	for {
		log.Printf("터널 서버(%s)에 연결 시도...", tunnelServerAddr)
		fromConn, err := net.Dial("tcp", tunnelServerAddr)
		if err != nil {
			log.Printf("터널 서버 연결 실패: %v. 5초 후 재시도.", err)
			time.Sleep(5 * time.Second)
			continue
		}
		log.Println("✅ 터널 서버에 연결됨.")

		log.Printf("로컬 서비스(%s)에 연결 시도...", localServiceAddr)
		toConn, err := net.Dial("tcp", localServiceAddr)
		if err != nil {
			log.Printf("로컬 서비스 연결 실패: %v", err)
			fromConn.Close()
			continue // 로컬 서비스가 아직 안 켜졌을 수 있으니 처음부터 재시도
		}
		log.Println("✅ 로컬 서비스에 연결됨. 이제 파이핑을 시작합니다.")

		// 서버의 pipeConnections 함수와 동일
		util.PipeConnections(fromConn, toConn)
		log.Println("연결 종료. 재연결을 시도합니다.")
	}

}
