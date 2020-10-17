package password

type Helper interface {
	Generate(password string) (hashedPassword string, err error)
	Compare(hashedPassword string, password string) error
}
