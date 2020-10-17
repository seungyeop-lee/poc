package patron

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/internal/aggregates/patron"
)

var AggregateSet = wire.NewSet(
	patron.NewAggregate,
	patron.NewGormRepository,
)
