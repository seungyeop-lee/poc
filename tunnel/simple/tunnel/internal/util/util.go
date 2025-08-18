package util

import (
	"io"
	"net"
	"sync"
)

// PipeConnections 두 연결 사이에서 데이터를 양방향으로 복사하는 함수
func PipeConnections(conn1 net.Conn, conn2 net.Conn) {
	var wg sync.WaitGroup
	wg.Add(2)

	// conn1 -> conn2 복사
	go func() {
		defer wg.Done()
		defer conn2.Close()
		io.Copy(conn2, conn1)
	}()

	// conn2 -> conn1 복사
	go func() {
		defer wg.Done()
		defer conn1.Close()
		io.Copy(conn1, conn2)
	}()

	wg.Wait()
}
