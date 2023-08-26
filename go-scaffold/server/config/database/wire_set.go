package database

import (
	"github.com/google/wire"
)

var ConfigSet = wire.NewSet(
	NewGormDB,
)
