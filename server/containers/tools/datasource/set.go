package datasource

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/tools/datasource"
)

var ToolSet = wire.NewSet(
	datasource.NewGormTxBeginner,
	datasource.NewGormTxCommitter,
	datasource.NewGormTxWrapper,
)
