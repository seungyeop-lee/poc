package crypto

import (
	"testing"
)

func TestAes_EncryptDecrypt(t *testing.T) {
	// 키는 16, 24, 32 바이트 중 하나여야 함 (AES-128, AES-192, AES-256)
	key := []byte("mysecretpassword")

	aesObj := Aes{Key: key}

	plaintext := "Hello, world!"

	plaintextBytes := []byte(plaintext)
	ciphertext, err := aesObj.Encrypt(plaintextBytes)
	if err != nil {
		panic(err)
	}

	decrypted, err := aesObj.Decrypt(ciphertext)
	if err != nil {
		panic(err)
	}

	if plaintext != string(decrypted) {
		t.Fail()
	}
}
