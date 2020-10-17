package datasource

import (
	"context"
	"database/sql"

	"gorm.io/gorm"
)

type gormTxBeginner struct {
	db *gorm.DB
}

func NewGormTxBeginner(db *gorm.DB) TxBeginner {
	result := &gormTxBeginner{}
	result.db = db
	return result
}

func (g *gormTxBeginner) BeginTx(ctx context.Context, options ...*sql.TxOptions) (TxCommitter, error) {
	db := g.db.Begin(options...)
	if db.Error != nil {
		return nil, db.Error
	}

	db = g.db.WithContext(ctx)
	if db.Error != nil {
		return nil, db.Error
	}

	return NewGormTxCommitter(db), nil
}
