package datasource

import (
	"gorm.io/gorm"
)

type GormTxConverter struct {}

//ToGormDB tx가 *gormTxCommitter가 아니면 nil을 반환한다.
func (g GormTxConverter) ToGormDB(tx TxCommitter) *gorm.DB {
	gormTxCommitter, ok := tx.(*gormTxCommitter)
	if !ok {
		return nil
	}
	return gormTxCommitter.db
}