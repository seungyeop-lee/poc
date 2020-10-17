package database

import "gorm.io/gorm"

func NewGormDB() *gorm.DB {
	return &gorm.DB{}
}
