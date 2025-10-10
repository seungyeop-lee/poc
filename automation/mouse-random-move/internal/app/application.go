package app

import (
	"fmt"

	"github.com/seungyeop-lee/poc/automation/mouse-random-move/internal/controller"
	"github.com/seungyeop-lee/poc/automation/mouse-random-move/internal/scheduler"
	"github.com/seungyeop-lee/poc/automation/mouse-random-move/internal/screen"
	"github.com/seungyeop-lee/poc/automation/mouse-random-move/internal/strategy"
)

// Application 모든 컴포넌트를 조정하여 프로그램을 실행합니다
type Application struct {
	screen   screen.Screen
	mouse    controller.MouseController
	strategy strategy.MovementStrategy
	sched    *scheduler.Scheduler
}

// NewApplication 모든 의존성을 가진 새로운 Application을 생성합니다
func NewApplication(
	scr screen.Screen,
	mouse controller.MouseController,
	strat strategy.MovementStrategy,
	sched *scheduler.Scheduler,
) *Application {
	return &Application{
		screen:   scr,
		mouse:    mouse,
		strategy: strat,
		sched:    sched,
	}
}

// Run 애플리케이션을 시작합니다
func (a *Application) Run() error {
	a.printWelcomeMessage()

	// 스케줄에 따라 마우스 이동 실행
	return a.sched.Run(func() {
		a.executeMouseMovement()
	})
}

// printWelcomeMessage 환영 메시지를 출력합니다
func (a *Application) printWelcomeMessage() {
	fmt.Println("=== Mouse Random Move 프로그램 시작 ===")
	fmt.Println("마우스가 3~10초 간격으로 100~500px 거리만큼 랜덤하게 이동합니다.")
	fmt.Println("종료하려면 Ctrl+C를 누르세요.\n")
}

// executeMouseMovement 단일 마우스 이동을 실행합니다
func (a *Application) executeMouseMovement() {
	current := a.mouse.CurrentPosition()
	movement := a.strategy.CalculateNextMove(current, a.screen)

	fmt.Printf("[마우스 이동] 현재 위치: (%d, %d) | 영역: %s | 각도: %d° | 거리: %dpx | 속도: %dms | 새 위치: (%d, %d)\n",
		movement.From.X, movement.From.Y,
		movement.Region.String(),
		movement.Angle,
		movement.Distance,
		movement.Speed.Milliseconds(),
		movement.To.X, movement.To.Y,
	)

	a.mouse.Move(movement.To, movement.Speed)
}
