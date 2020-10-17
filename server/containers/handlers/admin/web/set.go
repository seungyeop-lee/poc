package web

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/containers/handlers/admin/web/patron"
	"github.com/seungyeop-lee/go-scaffold/server/internal/handlers/admin/web"
)

var HandlerSet = wire.NewSet(
	web.NewHandler,
	patron.HandlerSet,
)
