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
	tx := g.db.Begin(options...)
	if tx.Error != nil {
		return nil, tx.Error
	}

	tx = tx.WithContext(ctx)
	if tx.Error != nil {
		return nil, tx.Error
	}

	return NewGormTxCommitter(tx), nil
}
