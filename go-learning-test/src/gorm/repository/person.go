package repository

import (
	"github.com/jinzhu/gorm"
	"learning-test/src/gorm/model"
)

type Repository interface {
	Get(id uint) (*model.Person, error)
	Create(id uint, name string) error
}

type repo struct {
	DB *gorm.DB
}

func CreateRepository(db *gorm.DB) Repository {
	return &repo{
		DB: db,
	}
}

func (p *repo) Get(id uint) (*model.Person, error) {
	person := new(model.Person)

	err := p.DB.Where("id = ?", id).Find(person).Error

	return person, err
}

func (p *repo) Create(id uint, name string) error {
	person := &model.Person{
		ID:   id,
		Name: name,
	}

	return p.DB.Create(person).Error
}
