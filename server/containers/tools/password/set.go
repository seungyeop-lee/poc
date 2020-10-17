package password

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/tools/password"
)

var ToolSet = wire.NewSet(
	password.NewBcryptHelper,
)
