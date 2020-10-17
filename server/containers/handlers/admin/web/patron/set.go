package patron

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/internal/handlers/admin/web/patron"
)

var HandlerSet = wire.NewSet(
	patron.NewHandler,
)
