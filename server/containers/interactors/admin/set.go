package admin

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/containers/interactors/admin/patron"
)

var InteractorSet = wire.NewSet(
	patron.InteractorSet,
)
