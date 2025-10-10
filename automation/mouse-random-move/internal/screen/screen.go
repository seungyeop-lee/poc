package screen

import (
	"math"

	"github.com/go-vgo/robotgo"

	"github.com/seungyeop-lee/poc/automation/mouse-random-move/internal/domain"
)

// Screen 화면 정보 및 작업을 나타냅니다
type Screen interface {
	// Size 화면의 너비와 높이를 반환합니다
	Size() (width, height int)
	// Center 화면의 중앙 위치를 반환합니다
	Center() domain.Position
	// DetermineRegion 위치가 속한 영역을 결정합니다
	DetermineRegion(pos domain.Position) domain.Region
}

// DefaultScreen robotgo를 사용하는 기본 구현체입니다
type DefaultScreen struct {
	width  int
	height int
	center domain.Position
}

// NewDefaultScreen 새로운 DefaultScreen을 생성합니다
func NewDefaultScreen() *DefaultScreen {
	width, height := robotgo.GetScreenSize()
	center := domain.NewPosition(width/2, height/2)

	return &DefaultScreen{
		width:  width,
		height: height,
		center: center,
	}
}

// Size 화면의 너비와 높이를 반환합니다
func (s *DefaultScreen) Size() (width, height int) {
	return s.width, s.height
}

// Center 화면의 중앙 위치를 반환합니다
func (s *DefaultScreen) Center() domain.Position {
	return s.center
}

// DetermineRegion 위치가 속한 영역을 결정합니다
func (s *DefaultScreen) DetermineRegion(pos domain.Position) domain.Region {
	// 중심으로부터의 거리 계산
	distanceFromCenter := pos.DistanceTo(s.center)

	// 최대 거리 계산 (중심에서 모서리까지의 대각선)
	maxDistance := math.Sqrt(float64(s.center.X*s.center.X + s.center.Y*s.center.Y))
	ratio := distanceFromCenter / maxDistance

	if ratio < 0.5 {
		return domain.RegionCenter // 중앙 50%
	} else if ratio < 0.85 {
		return domain.RegionOuter // 외곽 영역
	}
	return domain.RegionEdge // 극단 외곽 영역 (85%+)
}
