package datasource

import (
	"context"
	"database/sql"
)

type TxBeginner interface {
	BeginTx(context.Context, ...*sql.TxOptions) (TxCommitter, error)
}