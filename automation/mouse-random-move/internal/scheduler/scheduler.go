package scheduler

import (
	"context"
	"fmt"
	"math/rand"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// Scheduler 마우스 이동의 타이밍을 관리합니다
type Scheduler struct {
	rand *rand.Rand
}

// NewScheduler 새로운 Scheduler를 생성합니다
func NewScheduler() *Scheduler {
	return &Scheduler{
		rand: rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

// NextDelay 3~10초 사이의 랜덤 지연 시간을 반환합니다
func (s *Scheduler) NextDelay() time.Duration {
	seconds := s.rand.Intn(8) + 3
	return time.Duration(seconds) * time.Second
}

// Run 랜덤 지연 시간으로 action 함수를 반복적으로 실행합니다
// 인터럽트 시그널(Ctrl+C)을 받으면 중지됩니다
func (s *Scheduler) Run(action func()) error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// 시그널 처리 설정
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGINT)

	// 인터럽트 시그널 처리를 위한 고루틴
	go func() {
		<-sigChan
		fmt.Println("\n=== 프로그램 종료 ===")
		cancel()
	}()

	// 메인 루프
	for {
		delay := s.NextDelay()
		fmt.Printf("[대기] 다음 마우스 이동까지 %v 대기 중...\n", delay)

		select {
		case <-ctx.Done():
			return nil
		case <-time.After(delay):
			action()
		}
	}
}
