package main

import (
	"log"

	"github.com/seungyeop-lee/poc/automation/mouse-random-move/internal/app"
	"github.com/seungyeop-lee/poc/automation/mouse-random-move/internal/controller"
	"github.com/seungyeop-lee/poc/automation/mouse-random-move/internal/scheduler"
	"github.com/seungyeop-lee/poc/automation/mouse-random-move/internal/screen"
	"github.com/seungyeop-lee/poc/automation/mouse-random-move/internal/strategy"
)

func main() {
	// 의존성 초기화
	scr := screen.NewDefaultScreen()
	mouse := controller.NewRobotgoMouse()
	strat := strategy.NewAdaptiveMovement()
	sched := scheduler.NewScheduler()

	// 애플리케이션 생성 및 실행
	application := app.NewApplication(scr, mouse, strat, sched)

	if err := application.Run(); err != nil {
		log.Fatalf("Application error: %v", err)
	}
}
