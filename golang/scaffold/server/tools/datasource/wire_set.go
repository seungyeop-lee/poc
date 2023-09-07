package datasource

import (
	"github.com/google/wire"
)

var ToolSet = wire.NewSet(
	NewGormTxBeginner,
	NewGormTxCommitter,
	NewGormTxWrapper,
)
