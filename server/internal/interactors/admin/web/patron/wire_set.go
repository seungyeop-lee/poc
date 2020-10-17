package patron

import (
	"github.com/google/wire"
)

var InteractorSet = wire.NewSet(
	NewHandler,
	NewController,
	NewPresenter,
)
