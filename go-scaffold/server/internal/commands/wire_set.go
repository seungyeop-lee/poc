package commands

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/internal/commands/patron"
)

var Set = wire.NewSet(
	patron.CommandSet,
)
