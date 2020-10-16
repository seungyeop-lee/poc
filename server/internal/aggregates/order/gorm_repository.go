package order

import (
	"github.com/seungyeop-lee/go-scaffold/server/tools/datasource"

	"gorm.io/gorm"
)

type gormRepository struct {
	datasource.GormDB
}

func NewGormRepository() Repository {
	repo := &gormRepository{}
	return repo
}

func (d *gormRepository) FindById(id uint, tx datasource.Tx) (*Order, error) {
	result := &Order{}
	if err := d.ToGormDB(tx).First(result, id).Error; err != nil {
		return nil, err
	}
	return result, nil
}

func (d *gormRepository) Save(order Order, tx datasource.Tx) (id uint, err error) {
	if err := d.ToGormDB(tx).Save(&order).Error; err != nil {
		return 0, err
	}
	return order.ID, nil
}

func (d *gormRepository) Update(order Order, tx datasource.Tx) error {
	if err := d.ToGormDB(tx).Updates(&order).Error; err != nil {
		return err
	}
	return nil
}

func (d *gormRepository) Delete(order Order, tx datasource.Tx) error {
	if err := d.ToGormDB(tx).Delete(&order).Error; err != nil {
		return err
	}
	return nil
}

//SetDB unsupported method
func (d *gormRepository) SetDB(*gorm.DB) {
	panic("unsupported method")
}