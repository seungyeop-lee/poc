package controller

import (
	"time"

	"github.com/seungyeop-lee/poc/automation/mouse-random-move/internal/domain"

	"github.com/go-vgo/robotgo"
)

// RobotgoMouse robotgo 라이브러리를 사용하는 MouseController 구현체입니다
type RobotgoMouse struct{}

// NewRobotgoMouse 새로운 RobotgoMouse를 생성합니다
func NewRobotgoMouse() *RobotgoMouse {
	return &RobotgoMouse{}
}

// CurrentPosition 현재 마우스 위치를 반환합니다
func (m *RobotgoMouse) CurrentPosition() domain.Position {
	x, y := robotgo.Location()
	return domain.NewPosition(x, y)
}

// Move 지정된 속도로 마우스를 대상 위치로 이동합니다
func (m *RobotgoMouse) Move(target domain.Position, speed time.Duration) {
	robotgo.MouseSleep = int(speed.Milliseconds())
	robotgo.MoveSmooth(target.X, target.Y)
}
