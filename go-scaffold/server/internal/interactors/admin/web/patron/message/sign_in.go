package message

import signIn "github.com/seungyeop-lee/go-scaffold/server/internal/commands/patron/sign_in"

type SignInInfo struct {
	LoginID  string `json:"login_id"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

func (s SignInInfo) Patron() *signIn.Patron {
	result := signIn.Patron{}
	result.LoginID = s.LoginID
	result.PasswordRaw = s.Password
	result.Email = s.Email
	return &result
}
