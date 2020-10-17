package database

import (
	"github.com/google/wire"
	"github.com/seungyeop-lee/go-scaffold/server/containers/config/database"
)

var ConfigSet = wire.NewSet(
	database.NewGormDB,
)
