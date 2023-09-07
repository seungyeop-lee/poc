package datasource

type TxCommitter interface {
	Commit() error
	Rollback() error
}
