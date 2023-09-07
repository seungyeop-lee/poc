package entities

import (
	validation "github.com/go-ozzo/ozzo-validation"
	"time"
)

type Orders struct {
	ID        uint
	ProductID uint
	PatronID  uint
	Quantity  uint
	CreatedAt time.Time
}

func (o Orders) FindByIDValidate() error {
	return o.idValidate()
}

func (o Orders) SaveValidate() error {
	return validation.ValidateStruct(&o,
		validation.Field(&o.ProductID, validation.Required),
		validation.Field(&o.PatronID, validation.Required),
		validation.Field(&o.Quantity, validation.Required),
	)
}

func (o Orders) UpdateValidate() error {
	return o.idValidate()
}

func (o Orders) DeleteValidate() error {
	return o.idValidate()
}

func (o Orders) idValidate() error {
	return validation.ValidateStruct(&o,
		validation.Field(&o.ID, validation.Required),
	)
}
