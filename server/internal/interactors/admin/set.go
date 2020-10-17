package admin

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/internal/interactors/admin/web"
)

var InteractorSet = wire.NewSet(
	web.InteractorSet,
)
