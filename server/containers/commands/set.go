package commands

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/containers/commands/patron"
)

var Set = wire.NewSet(
	patron.CommandSet,
)
