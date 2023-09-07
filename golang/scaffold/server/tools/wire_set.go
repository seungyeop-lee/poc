package tools

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/tools/datasource"
	"github.com/seungyeop-lee/go-scaffold/server/tools/password"
)

var Set = wire.NewSet(
	datasource.ToolSet,
	password.ToolSet,
)
