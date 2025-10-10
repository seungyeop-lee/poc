package controller

import (
	"time"

	"github.com/seungyeop-lee/poc/automation/mouse-random-move/internal/domain"
)

// MouseController 마우스 이동을 제어합니다
type MouseController interface {
	// CurrentPosition 현재 마우스 위치를 반환합니다
	CurrentPosition() domain.Position
	// Move 지정된 속도로 마우스를 대상 위치로 이동합니다
	Move(target domain.Position, speed time.Duration)
}
