package strategy

import (
	"github.com/seungyeop-lee/poc/automation/mouse-random-move/internal/domain"
	"github.com/seungyeop-lee/poc/automation/mouse-random-move/internal/screen"
)

// MovementStrategy 다음 마우스 이동을 어떻게 계산할지 정의합니다
type MovementStrategy interface {
	// CalculateNextMove 현재 위치와 화면 정보를 기반으로 다음 이동을 계산합니다
	CalculateNextMove(current domain.Position, scr screen.Screen) domain.Movement
}
