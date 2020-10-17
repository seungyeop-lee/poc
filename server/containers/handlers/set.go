package handlers

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/containers/handlers/admin"
)

var Set = wire.NewSet(
	admin.HandlerSet,
)
