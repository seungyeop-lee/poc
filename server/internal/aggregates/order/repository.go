package order

import "github.com/seungyeop-lee/go-scaffold/server/tools/datasource"

type Repository interface {
	FindById(uint, datasource.Tx) (*Order, error)
	Save(Order, datasource.Tx) (uint, error)
	Update(Order, datasource.Tx) error
	Delete(Order, datasource.Tx) error
}