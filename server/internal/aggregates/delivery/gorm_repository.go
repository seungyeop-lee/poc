package delivery

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

func (d *gormRepository) FindById(id uint, tx datasource.Tx) (*Delivery, error) {
	result := &Delivery{}
	if err := d.ToGormDB(tx).First(result, id).Error; err != nil {
		return nil, err
	}
	return result, nil
}

func (d *gormRepository) Save(delivery Delivery, tx datasource.Tx) (id uint, err error) {
	if err := d.ToGormDB(tx).Save(&delivery).Error; err != nil {
		return 0, err
	}
	return delivery.ID, nil
}

func (d *gormRepository) Update(delivery Delivery, tx datasource.Tx) error {
	if err := d.ToGormDB(tx).Updates(&delivery).Error; err != nil {
		return err
	}
	return nil
}

func (d *gormRepository) Delete(delivery Delivery, tx datasource.Tx) error {
	if err := d.ToGormDB(tx).Delete(&delivery).Error; err != nil {
		return err
	}
	return nil
}

//SetDB unsupported method
func (d *gormRepository) SetDB(*gorm.DB) {
	panic("unsupported method")
}