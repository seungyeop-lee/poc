package patron

import (
	"github.com/seungyeop-lee/go-scaffold/server/tools/datasource"
)

type service struct {
	repo Repository
}

func NewService(repo Repository) *service {
	return &service{
		repo: repo,
	}
}

func (s service) FindByID(id uint, tx datasource.Tx) (*Patron, error) {
	return s.repo.FindById(id, tx)
}

func (s service) Save(input Patron, tx datasource.Tx) (uint, error) {
	if err := input.SaveValidate(); err != nil {
		return 0, nil
	}
	return s.repo.Save(input, tx)
}

func (s service) Update(input Patron, tx datasource.Tx) error {
	if err := input.UpdateValidate(); err != nil {
		return nil
	}
	return s.repo.Update(input, tx)
}

func (s service) Delete(input Patron, tx datasource.Tx) error {
	if err := input.DeleteValidate(); err != nil {
		return nil
	}
	return s.repo.Delete(input, tx)
}