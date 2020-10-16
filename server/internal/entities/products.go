package entities

import validation "github.com/go-ozzo/ozzo-validation"

type Products struct {
	ID uint
	Name string
	Stock uint
}

func (p Products) SaveValidate() error {
	return validation.ValidateStruct(&p,
		validation.Field(p.Name, validation.Required),
		validation.Field(p.Stock, validation.Required),
	)
}

func (p Products) UpdateValidate() error {
	return validation.ValidateStruct(&p,
		validation.Field(p.ID, validation.Required),
	)
}

func (p Products) DeleteValidate() error {
	return validation.ValidateStruct(&p,
		validation.Field(p.ID, validation.Required),
	)
}
