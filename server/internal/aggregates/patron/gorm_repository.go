package patron

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

func (d *gormRepository) FindById(id uint, tx datasource.Tx) (*Patron, error) {
	result := &Patron{}
	if err := d.ToGormDB(tx).First(result, id).Error; err != nil {
		return nil, err
	}
	return result, nil
}

func (d *gormRepository) Save(patron Patron, tx datasource.Tx) (id uint, err error) {
	if err := d.ToGormDB(tx).Save(&patron).Error; err != nil {
		return 0, err
	}
	return patron.ID, nil
}

func (d *gormRepository) Update(patron Patron, tx datasource.Tx) error {
	if err := d.ToGormDB(tx).Updates(&patron).Error; err != nil {
		return err
	}
	return nil
}

func (d *gormRepository) Delete(patron Patron, tx datasource.Tx) error {
	if err := d.ToGormDB(tx).Delete(&patron).Error; err != nil {
		return err
	}
	return nil
}

//SetDB unsupported method
func (d *gormRepository) SetDB(*gorm.DB) {
	panic("unsupported method")
}