package entities

import (
	validation "github.com/go-ozzo/ozzo-validation"
	"time"
)

type Patrons struct {
	ID        uint
	LoginID   string
	Password  string
	Email     string
	DeletedAt time.Time
}

func (p Patrons) FindByIDValidate() error {
	return p.idValidate()
}

func (p Patrons) SaveValidate() error {
	return validation.ValidateStruct(&p,
		validation.Field(&p.LoginID, validation.Required),
		validation.Field(&p.Password, validation.Required),
		validation.Field(&p.Email, validation.Required),
	)
}

func (p Patrons) UpdateValidate() error {
	return p.idValidate()
}

func (p Patrons) DeleteValidate() error {
	return p.idValidate()
}

func (p Patrons) idValidate() error {
	return validation.ValidateStruct(&p,
		validation.Field(&p.ID, validation.Required),
	)
}
