package interactors

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/containers/interactors/admin"
)

var Set = wire.NewSet(
	admin.InteractorSet,
)
