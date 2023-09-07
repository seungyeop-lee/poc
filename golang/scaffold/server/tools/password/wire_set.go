package password

import (
	"github.com/google/wire"
)

var ToolSet = wire.NewSet(
	NewBcryptHelper,
)
