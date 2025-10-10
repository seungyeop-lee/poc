package domain

import (
	"math"
	"time"
)

// Movement 마우스 이동 작업을 나타냅니다
type Movement struct {
	From     Position
	To       Position
	Angle    int
	Distance int
	Speed    time.Duration
	Region   Region
}

// NewMovement 새로운 Movement를 생성합니다
func NewMovement(from Position, angle, distance int, speed time.Duration, region Region) Movement {
	dx, dy := angleToOffset(angle, distance)
	to := from.Offset(dx, dy)

	return Movement{
		From:     from,
		To:       to,
		Angle:    angle,
		Distance: distance,
		Speed:    speed,
		Region:   region,
	}
}

// angleToOffset 각도(도 단위)를 주어진 거리만큼의 dx, dy 오프셋으로 변환합니다
func angleToOffset(degrees int, distance int) (int, int) {
	radians := float64(degrees) * math.Pi / 180.0
	dx := int(math.Cos(radians) * float64(distance))
	dy := int(math.Sin(radians) * float64(distance))
	return dx, dy
}
