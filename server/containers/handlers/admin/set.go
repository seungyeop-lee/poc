package admin

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/containers/handlers/admin/web"
)

var HandlerSet = wire.NewSet(
	web.HandlerSet,
)
