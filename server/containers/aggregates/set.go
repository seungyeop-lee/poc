package aggregates

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/containers/aggregates/patron"
)

var Set = wire.NewSet(
	patron.AggregateSet,
)
