package patron

import (
	"github.com/seungyeop-lee/go-scaffold/server/tools/datasource"
)

type Aggregate struct {
	repo Repository
}

func NewAggregate(repo Repository) *Aggregate {
	return &Aggregate{
		repo: repo,
	}
}

func (s Aggregate) FindByID(input Patron, tx datasource.TxCommitter) (*Patron, error) {
	if err := input.FindByIDValidate(); err != nil {
		return nil, err
	}
	return s.repo.FindByID(input, tx)
}

func (s Aggregate) Save(input Patron, tx datasource.TxCommitter) (uint, error) {
	if err := input.SaveValidate(); err != nil {
		return 0, err
	}
	return s.repo.Save(input, tx)
}

func (s Aggregate) Update(input Patron, tx datasource.TxCommitter) error {
	if err := input.UpdateValidate(); err != nil {
		return err
	}
	return s.repo.Update(input, tx)
}

func (s Aggregate) Delete(input Patron, tx datasource.TxCommitter) error {
	if err := input.DeleteValidate(); err != nil {
		return err
	}
	return s.repo.Delete(input, tx)
}
