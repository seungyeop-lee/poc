package product

import "github.com/seungyeop-lee/go-scaffold/server/tools/datasource"

type Repository interface {
	FindById(uint, datasource.Tx) (*Product, error)
	Save(Product, datasource.Tx) (uint, error)
	Update(Product, datasource.Tx) error
	Delete(Product, datasource.Tx) error
}