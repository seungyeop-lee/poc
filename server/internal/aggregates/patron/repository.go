package patron

import "github.com/seungyeop-lee/go-scaffold/server/tools/datasource"

type Repository interface {
	FindById(uint, datasource.Tx) (*Patron, error)
	Save(Patron, datasource.Tx) (uint, error)
	Update(Patron, datasource.Tx) error
	Delete(Patron, datasource.Tx) error
}