package product

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

func (d *gormRepository) FindById(id uint, tx datasource.Tx) (*Product, error) {
	result := &Product{}
	if err := d.ToGormDB(tx).First(result, id).Error; err != nil {
		return nil, err
	}
	return result, nil
}

func (d *gormRepository) Save(product Product, tx datasource.Tx) (id uint, err error) {
	if err := d.ToGormDB(tx).Save(&product).Error; err != nil {
		return 0, err
	}
	return product.ID, nil
}

func (d *gormRepository) Update(product Product, tx datasource.Tx) error {
	if err := d.ToGormDB(tx).Updates(&product).Error; err != nil {
		return err
	}
	return nil
}

func (d *gormRepository) Delete(product Product, tx datasource.Tx) error {
	if err := d.ToGormDB(tx).Delete(&product).Error; err != nil {
		return err
	}
	return nil
}

//SetDB unsupported method
func (d *gormRepository) SetDB(*gorm.DB) {
	panic("unsupported method")
}