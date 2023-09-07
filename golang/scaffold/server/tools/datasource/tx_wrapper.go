package datasource

import (
	"context"
	"database/sql"
)

type TxWrapFunc func(committer TxCommitter) error

type TxWrapper interface {
	Do(context.Context, TxWrapFunc, ...*sql.TxOptions) error
}
