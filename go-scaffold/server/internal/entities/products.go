package entities

import validation "github.com/go-ozzo/ozzo-validation"

type Products struct {
	ID uint
	Name string
	Stock uint
}

func (p Products) FindByIDValidate() error {
	return p.idValidate()
}

func (p Products) SaveValidate() error {
	return validation.ValidateStruct(&p,
		validation.Field(&p.Name, validation.Required),
		validation.Field(&p.Stock, validation.Required),
	)
}

func (p Products) UpdateValidate() error {
	return p.idValidate()
}

func (p Products) DeleteValidate() error {
	return p.idValidate()
}

func (p Products) idValidate() error {
	return validation.ValidateStruct(&p,
		validation.Field(&p.ID, validation.Required),
	)
}