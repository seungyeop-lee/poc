package crypto

import "testing"

func TestRsa_EncryptDecrypt(t *testing.T) {
	rsaObj := Rsa{}
	if err := rsaObj.GenerateKey(2048); err != nil {
		panic(err)
	}

	plaintext := "Hello, world!"

	plaintextBytes := []byte(plaintext)
	ciphertext, err := rsaObj.Encrypt(plaintextBytes)
	if err != nil {
		panic(err)
	}

	decrypted, err := rsaObj.Decrypt(ciphertext)
	if err != nil {
		panic(err)
	}

	if plaintext != string(decrypted) {
		t.Fail()
	}
}
