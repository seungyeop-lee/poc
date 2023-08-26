package password

import "golang.org/x/crypto/bcrypt"

type bcryptHelper struct {
	defaultCost int
}

func NewBcryptHelper() Helper {
	return &bcryptHelper{
		defaultCost: bcrypt.DefaultCost,
	}
}

func (b *bcryptHelper) Generate(password string) (hashedPassword string, err error) {
	hash, err := bcrypt.GenerateFromPassword(
		b.stringToByte(password),
		b.defaultCost,
	)
	if err != nil {
		return "", err
	}
	return b.byteToString(hash), nil
}

func (b *bcryptHelper) Compare(hashedPassword string, password string) error {
	return bcrypt.CompareHashAndPassword(
		b.stringToByte(hashedPassword),
		b.stringToByte(password),
	)
}

func (b *bcryptHelper) byteToString(input []byte) string {
	return string(input)
}

func (b *bcryptHelper) stringToByte(input string) []byte {
	return []byte(input)
}
