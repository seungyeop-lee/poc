//+build wireinject

package containers

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/containers/aggregates"
	"github.com/seungyeop-lee/go-scaffold/server/containers/commands"
	"github.com/seungyeop-lee/go-scaffold/server/containers/config"
	"github.com/seungyeop-lee/go-scaffold/server/containers/handlers"
	"github.com/seungyeop-lee/go-scaffold/server/containers/interactors"
	"github.com/seungyeop-lee/go-scaffold/server/containers/tools"
	"github.com/seungyeop-lee/go-scaffold/server/internal/handlers/admin/web"
)

func InitAdminWeb() *web.MainHandler {
	wire.Build(
		aggregates.Set,
		commands.Set,
		handlers.Set,
		interactors.Set,
		config.Set,
		//queries.Set,
		tools.Set,
	)
	return &web.MainHandler{}
}
