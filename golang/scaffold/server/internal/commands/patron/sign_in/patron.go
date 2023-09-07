package signIn

import (
	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/seungyeop-lee/go-scaffold/server/internal/aggregates/patron"
	"github.com/seungyeop-lee/go-scaffold/server/internal/entities"
	"github.com/seungyeop-lee/go-scaffold/server/tools/password"
)

type Patron struct {
	entities.Patrons
	PasswordRaw string
}

func (p Patron) Validate() error {
	return validation.Validate(&p.PasswordRaw, validation.Required)
}

func (p Patron) NewPatron(helper password.Helper) *patron.Patron {
	hashed, err := helper.Generate(p.PasswordRaw)
	if err != nil {
		panic(err)
	}
	p.Patrons.Password = hashed

	return &patron.Patron{
		Patrons: p.Patrons,
	}
}
