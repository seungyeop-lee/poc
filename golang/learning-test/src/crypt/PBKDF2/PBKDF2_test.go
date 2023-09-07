package PBKDF2

import (
	"crypto/rand"
	"crypto/sha256"
	"fmt"
	"golang.org/x/crypto/pbkdf2"
	"io"
	"testing"
)

var password = "abcd1234"

func TestGenerate(t *testing.T) {
	salt := generateRandomSalt(8)
	dk := pbkdf2.Key([]byte(password), []byte(salt), 4096, 32, sha256.New)
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
