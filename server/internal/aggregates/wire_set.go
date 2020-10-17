package aggregates

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/internal/aggregates/patron"
)

var Set = wire.NewSet(
	patron.AggregateSet,
)
