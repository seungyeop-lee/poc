package domain

import "math"

// Position 화면상의 한 점을 나타냅니다
type Position struct {
	X int
	Y int
}

// NewPosition 새로운 Position을 생성합니다
func NewPosition(x, y int) Position {
	return Position{X: x, Y: y}
}

// DistanceTo 다른 위치까지의 거리를 계산합니다
func (p Position) DistanceTo(other Position) float64 {
	dx := float64(p.X - other.X)
	dy := float64(p.Y - other.Y)
	return math.Sqrt(dx*dx + dy*dy)
}

// AngleTo 다른 위치까지의 각도를 도 단위로 계산합니다
func (p Position) AngleTo(target Position) int {
	dx := float64(target.X - p.X)
	dy := float64(target.Y - p.Y)
	radians := math.Atan2(dy, dx)
	degrees := int(radians * 180.0 / math.Pi)
	if degrees < 0 {
		degrees += 360
	}
	return degrees
}

// Offset dx와 dy만큼 오프셋된 새로운 위치를 반환합니다
func (p Position) Offset(dx, dy int) Position {
	return Position{
		X: p.X + dx,
		Y: p.Y + dy,
	}
}
