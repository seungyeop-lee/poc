package datasource

import (
	"gorm.io/gorm"
)

type gormTxCommitter struct {
	db *gorm.DB
}

func NewGormTxCommitter(db *gorm.DB) TxCommitter {
	return &gormTxCommitter{db: db}
}

func (g *gormTxCommitter) Commit() error {
	return g.db.Commit().Error
}

func (g *gormTxCommitter) Rollback() error {
	return g.db.Rollback().Error
}
