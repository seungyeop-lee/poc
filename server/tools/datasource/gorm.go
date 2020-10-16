package datasource

import (
	"errors"
	"gorm.io/gorm"
)

var NotGormDB = errors.New("tx is not *gorm.DB")

type GormDB struct {
	db *gorm.DB
}

func (g *GormDB) SetDB(db *gorm.DB) {
	g.db = db
}

func (g *GormDB) GetDB() *gorm.DB {
	return g.db
}

func (g GormDB) ToGormDB(tx Tx) *gorm.DB {
	gormDB, ok := tx.(*gorm.DB)
	if !ok {
		return nil
	}
	return gormDB
}

func (g GormDB) Begin() Tx {
	return g.db
}

func (g GormDB) Commit(tx Tx) error {
	gormDB, ok := tx.(*gorm.DB)
	if !ok {
		return NotGormDB
	}
	return gormDB.Commit().Error
}

func (g GormDB) Rollback(tx Tx) error {
	gormDB, ok := tx.(*gorm.DB)
	if !ok {
		return NotGormDB
	}
	return gormDB.Rollback().Error
}