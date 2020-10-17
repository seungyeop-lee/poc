package config

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/containers/config/database"
)

var Set = wire.NewSet(
	database.ConfigSet,
)
