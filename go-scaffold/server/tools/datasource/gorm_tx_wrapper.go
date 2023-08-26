package datasource

import (
	"context"
	"database/sql"
)

type gormTxWrapper struct {
	beginner TxBeginner
}

func NewGormTxWrapper(beginner TxBeginner) TxWrapper {
	return &gormTxWrapper{
		beginner: beginner,
	}
}

func (g *gormTxWrapper) Do(ctx context.Context, wrapFunc TxWrapFunc, options ...*sql.TxOptions) error {
	tx, err := g.beginner.BeginTx(ctx, options...)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if err := wrapFunc(tx); err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}
