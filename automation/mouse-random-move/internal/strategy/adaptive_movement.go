package strategy

import (
	"math/rand"
	"time"

	"github.com/seungyeop-lee/poc/automation/mouse-random-move/internal/domain"
	"github.com/seungyeop-lee/poc/automation/mouse-random-move/internal/screen"
)

// AdaptiveMovement 현재 위치에 따라 적응적으로 동작하는 이동 전략입니다
// - 중앙 영역: 완전히 랜덤한 방향
// - 외곽 영역: 60% 확률로 중앙을 향해 이동
// - 극단 외곽 영역: 90% 확률로 중앙을 향해 이동
type AdaptiveMovement struct {
	rand *rand.Rand
}

// NewAdaptiveMovement 새로운 AdaptiveMovement 전략을 생성합니다
func NewAdaptiveMovement() *AdaptiveMovement {
	return &AdaptiveMovement{
		rand: rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

// CalculateNextMove 현재 위치를 기반으로 다음 이동을 계산합니다
func (s *AdaptiveMovement) CalculateNextMove(current domain.Position, scr screen.Screen) domain.Movement {
	region := scr.DetermineRegion(current)
	baseAngle := s.randomAngle()
	angle := s.adjustAngleBasedOnRegion(current, scr, region, baseAngle)
	distance := s.randomDistance()
	speed := s.randomSpeed()

	return domain.NewMovement(current, angle, distance, speed, region)
}

// randomAngle 도 단위의 랜덤 각도를 반환합니다 (0-359)
func (s *AdaptiveMovement) randomAngle() int {
	return s.rand.Intn(360)
}

// randomDistance 픽셀 단위의 랜덤 거리를 반환합니다 (100-500px)
func (s *AdaptiveMovement) randomDistance() int {
	return s.rand.Intn(401) + 100
}

// randomSpeed 랜덤 마우스 이동 속도를 반환합니다 (200-1000ms)
func (s *AdaptiveMovement) randomSpeed() time.Duration {
	milliseconds := s.rand.Intn(801) + 200 // 200-1000ms
	return time.Duration(milliseconds) * time.Millisecond
}

// adjustAngleBasedOnRegion 현재 영역에 따라 랜덤 각도를 조정합니다
func (s *AdaptiveMovement) adjustAngleBasedOnRegion(
	current domain.Position,
	scr screen.Screen,
	region domain.Region,
	randomAngle int,
) int {
	switch region {
	case domain.RegionCenter:
		// 중앙 영역: 완전히 랜덤
		return randomAngle

	case domain.RegionOuter:
		// 외곽 영역: 60% 확률로 중앙 방향
		if s.rand.Intn(100) < 60 {
			centerAngle := current.AngleTo(scr.Center())
			// ±60도 랜덤 오프셋
			offset := s.rand.Intn(121) - 60
			return (centerAngle + offset + 360) % 360
		}
		return randomAngle

	case domain.RegionEdge:
		// 극단 외곽 영역: 90% 확률로 중앙 방향
		if s.rand.Intn(100) < 90 {
			centerAngle := current.AngleTo(scr.Center())
			// ±30도 랜덤 오프셋
			offset := s.rand.Intn(61) - 30
			return (centerAngle + offset + 360) % 360
		}
		return randomAngle

	default:
		return randomAngle
	}
}
