//+build wireinject

package containers

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/config"
	"github.com/seungyeop-lee/go-scaffold/server/internal/aggregates"
	"github.com/seungyeop-lee/go-scaffold/server/internal/commands"
	"github.com/seungyeop-lee/go-scaffold/server/internal/interactors"
	"github.com/seungyeop-lee/go-scaffold/server/internal/interactors/admin/web"
	"github.com/seungyeop-lee/go-scaffold/server/tools"
)

func InitAdminWeb() *web.MainHandler {
	wire.Build(
		aggregates.Set,
		commands.Set,
		interactors.Set,
		config.Set,
		tools.Set,
	)
	return &web.MainHandler{}
}
