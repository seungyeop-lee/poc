package message

import signIn "github.com/seungyeop-lee/go-scaffold/server/internal/commands/patron/sign_in"

type SignInInfo struct {
	LoginID  string
	Password string
	Email    string
}

func (s SignInInfo) Patron() *signIn.Patron {
	result := signIn.Patron{}
	result.LoginID = s.LoginID
	result.Password = s.Password
	result.Email = s.Email
	return &result
}
