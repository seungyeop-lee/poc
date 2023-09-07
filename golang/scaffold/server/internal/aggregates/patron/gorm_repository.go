package patron

import (
	"github.com/seungyeop-lee/go-scaffold/server/tools/datasource"
)

type gormRepository struct {
	datasource.GormTxConverter
}

func NewGormRepository() Repository {
	repo := &gormRepository{}
	return repo
}

func (d *gormRepository) FindByID(patron Patron, tx datasource.TxCommitter) (*Patron, error) {
	result := &Patron{}
	if err := d.ToGormDB(tx).First(&result, patron.ID).Error; err != nil {
		return nil, err
	}
	return result, nil
}

func (d *gormRepository) Save(patron Patron, tx datasource.TxCommitter) (id uint, err error) {
	if err := d.ToGormDB(tx).Save(&patron).Error; err != nil {
		return 0, err
	}
	return patron.ID, nil
}

func (d *gormRepository) Update(patron Patron, tx datasource.TxCommitter) error {
	if err := d.ToGormDB(tx).Updates(&patron).Error; err != nil {
		return err
	}
	return nil
}

func (d *gormRepository) Delete(patron Patron, tx datasource.TxCommitter) error {
	if err := d.ToGormDB(tx).Delete(&patron).Error; err != nil {
		return err
	}
	return nil
}
