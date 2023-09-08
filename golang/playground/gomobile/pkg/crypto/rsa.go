package crypto

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"errors"
)

// Rsa is a struct for managing RSA encryption and decryption.
type Rsa struct {
	PrivateKey []byte
	PublicKey  []byte
}

// GenerateKey generates an RSA key pair and stores it in the Rsa struct.
func (r *Rsa) GenerateKey(bits int) error {
	privateKey, err := rsa.GenerateKey(rand.Reader, bits)
	if err != nil {
		return err
	}
	publicKey := &privateKey.PublicKey

	privateKeyBytes := x509.MarshalPKCS1PrivateKey(privateKey)
	r.PrivateKey = pem.EncodeToMemory(
		&pem.Block{
			Type:  "RSA PRIVATE KEY",
			Bytes: privateKeyBytes,
		},
	)

	publicKeyBytes, err := x509.MarshalPKIXPublicKey(publicKey)
	if err != nil {
		return err
	}
	r.PublicKey = pem.EncodeToMemory(
		&pem.Block{
			Type:  "RSA PUBLIC KEY",
			Bytes: publicKeyBytes,
		},
	)

	return nil
}

// Encrypt encrypts the given plaintext using RSA.
func (r *Rsa) Encrypt(plaintext []byte) ([]byte, error) {
	block, _ := pem.Decode(r.PublicKey)
	if block == nil {
		return nil, errors.New("failed to parse public key")
	}

	pub, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return nil, err
	}

	rsaPub, ok := pub.(*rsa.PublicKey)
	if !ok {
		return nil, errors.New("not a RSA public key")
	}

	return rsa.EncryptPKCS1v15(rand.Reader, rsaPub, plaintext)
}

// Decrypt decrypts the given ciphertext using RSA.
func (r *Rsa) Decrypt(ciphertext []byte) ([]byte, error) {
	block, _ := pem.Decode(r.PrivateKey)
	if block == nil {
		return nil, errors.New("failed to parse private key")
	}

	priv, err := x509.ParsePKCS1PrivateKey(block.Bytes)
	if err != nil {
		return nil, err
	}

	return rsa.DecryptPKCS1v15(rand.Reader, priv, ciphertext)
}
