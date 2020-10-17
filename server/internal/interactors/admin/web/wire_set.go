package web

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/internal/interactors/admin/web/patron"
)

var InteractorSet = wire.NewSet(
	NewHandler,
	patron.InteractorSet,
)
