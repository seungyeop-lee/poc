package entities

import (
	validation "github.com/go-ozzo/ozzo-validation"
)

type Deliveries struct {
	ID          uint
	OrderID     uint
	Address     string
	IsDelivered bool
}

func (d Deliveries) FindByIDValidate() error {
	return d.idValidate()
}

func (d Deliveries) SaveValidate() error {
	return validation.ValidateStruct(&d,
		validation.Field(&d.OrderID, validation.Required),
		validation.Field(&d.IsDelivered, validation.Required),
		validation.Field(&d.Address, validation.Required),
	)
}

func (d Deliveries) UpdateValidate() error {
	return d.idValidate()
}

func (d Deliveries) DeleteValidate() error {
	return d.idValidate()
}

func (d Deliveries) idValidate() error {
	return validation.ValidateStruct(&d,
		validation.Field(&d.ID, validation.Required),
	)
}
