package patron

import (
	"github.com/google/wire"
)

var AggregateSet = wire.NewSet(
	NewAggregate,
	NewGormRepository,
)
