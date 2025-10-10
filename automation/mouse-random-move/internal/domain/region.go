package domain

// Region 화면상에서 위치가 속한 영역을 나타냅니다
type Region int

const (
	// RegionCenter 화면의 중앙 영역을 나타냅니다 (최대 거리의 50% 이내)
	RegionCenter Region = iota
	// RegionOuter 외곽 영역을 나타냅니다 (최대 거리의 50-85%)
	RegionOuter
	// RegionEdge 극단 외곽 영역을 나타냅니다 (최대 거리의 85% 이상)
	RegionEdge
)

// String 영역의 문자열 표현을 반환합니다
func (r Region) String() string {
	switch r {
	case RegionCenter:
		return "중앙"
	case RegionOuter:
		return "외곽"
	case RegionEdge:
		return "극단외곽"
	default:
		return "알수없음"
	}
}
