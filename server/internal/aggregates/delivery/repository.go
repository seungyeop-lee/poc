package delivery

import "github.com/seungyeop-lee/go-scaffold/server/tools/datasource"

type Repository interface {
	FindById(uint, datasource.Tx) (*Delivery, error)
	Save(Delivery, datasource.Tx) (uint, error)
	Update(Delivery, datasource.Tx) error
	Delete(Delivery, datasource.Tx) error
}