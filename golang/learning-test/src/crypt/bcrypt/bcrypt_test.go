package bcrypt

import (
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
	"testing"
)

var password = "abcd1234"
var notPassword = "bbbb1234"

func TestGenerateHash(t *testing.T) {
	pass1, err1 := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err1 != nil {
		assert.FailNow(t, err1.Error())
	}

	pass2, err2 := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err2 != nil {
		assert.FailNow(t, err2.Error())
	}
	assert.NotEqual(t, pass1, pass2)
}

func TestCompareHashAndPassword(t *testing.T) {
	cryptPass, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		assert.FailNow(t, err.Error())
	}

	err = bcrypt.CompareHashAndPassword(cryptPass, []byte(password))
	if err != nil {
		assert.FailNow(t, err.Error())
	}

	err = bcrypt.CompareHashAndPassword(cryptPass, []byte(notPassword))
	if assert.Error(t, err) {
		assert.EqualError(t, err, "crypto/bcrypt: hashedPassword is not the hash of the given password")
	}
}
