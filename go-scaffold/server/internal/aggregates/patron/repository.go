package patron

import "github.com/seungyeop-lee/go-scaffold/server/tools/datasource"

type Repository interface {
	FindByID(Patron, datasource.TxCommitter) (*Patron, error)
	Save(Patron, datasource.TxCommitter) (uint, error)
	Update(Patron, datasource.TxCommitter) error
	Delete(Patron, datasource.TxCommitter) error
}