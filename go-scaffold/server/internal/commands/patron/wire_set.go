package patron

import (
	"github.com/google/wire"
	signIn "github.com/seungyeop-lee/go-scaffold/server/internal/commands/patron/sign_in"
)

var CommandSet = wire.NewSet(
	signIn.CommandSet,
)
