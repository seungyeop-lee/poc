package main

import (
	"log"
	"net"

	"github.com/seungyeop-lee/poc/tunnel/simple/tunnel/internal/util"
)

func main() {
	log.Println("서버 시작...")

	// 1. 클라이언트 연결을 기다릴 리스너 (9000번 포트)
	toListener, err := net.Listen("tcp", ":9000")
	if err != nil {
		log.Fatalf("터널 리스너 생성 실패: %v", err)
	}
	defer toListener.Close()

	// 2. 외부 사용자 연결을 기다릴 리스너 (8080번 포트)
	fromListener, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Fatalf("공개 리스너 생성 실패: %v", err)
	}
	defer fromListener.Close()

	log.Println("클라이언트(9000)와 사용자(8080)의 연결을 기다립니다.")

	// 무한 루프를 돌며 연결을 계속 처리
	for {
		// 3. 클라이언트가 연결될 때까지 대기
		toConn, err := toListener.Accept()
		if err != nil {
			log.Printf("터널 연결 수락 실패: %v", err)
			continue
		}
		log.Println("✅ 터널 클라이언트 연결됨. 이제 사용자를 기다립니다.")

		// 4. 사용자가 연결될 때까지 대기
		fromConn, err := fromListener.Accept()
		if err != nil {
			log.Printf("공개 연결 수락 실패: %v", err)
			toConn.Close() // 클라이언트 연결도 닫아줌
			continue
		}
		log.Println("✅ 사용자 연결됨. 두 연결을 이어줍니다.")

		// 5. 두 연결을 파이핑하는 고루틴 시작
		go util.PipeConnections(fromConn, toConn)
	}
}
