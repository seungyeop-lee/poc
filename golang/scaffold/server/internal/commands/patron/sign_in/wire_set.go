package signIn

import (
	"github.com/google/wire"
)

var CommandSet = wire.NewSet(
	NewCommand,
)
