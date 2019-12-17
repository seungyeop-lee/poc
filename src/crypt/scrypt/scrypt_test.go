package scrypt

import (
	"crypto/rand"
	"fmt"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/scrypt"
	"io"
	"testing"
)

var password = "abcd1234"

func TestGenerate(t *testing.T) {
	salt := generateRandomSalt(8)
	dk, err := scrypt.Key([]byte(password), []byte(salt), 32768, 8, 1, 32)
	if err != nil {
		assert.FailNow(t, err.Error())
	}
	fmt.Println(salt)
	fmt.Println(string(dk))
}

func generateRandomSalt(length int) string {
	salt := make([]byte, length)
	if _, err := io.ReadFull(rand.Reader, salt); err != nil {
		return ""
	}
	return string(salt)
}