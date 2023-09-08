package crypto

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha256"
	"crypto/x509"
	"encoding/asn1"
	"encoding/pem"
	"errors"
	"math/big"
)

type MessageSupplier interface {
	Get() []byte
}

type SignatureSupplier interface {
	Get() []byte
}

// Ecdsa is a struct for managing ECDSA keys, signing, and verification.
type Ecdsa struct {
	PrivateKey []byte
	PublicKey  []byte
}

// GenerateKey generates an ECDSA key pair and stores it in the Ecdsa struct.
func (e *Ecdsa) GenerateKey() error {
	privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return err
	}
	publicKey := &privateKey.PublicKey

	privateKeyBytes, err := x509.MarshalECPrivateKey(privateKey)
	if err != nil {
		return err
	}
	e.PrivateKey = pem.EncodeToMemory(
		&pem.Block{
			Type:  "EC PRIVATE KEY",
			Bytes: privateKeyBytes,
		},
	)

	publicKeyBytes, err := x509.MarshalPKIXPublicKey(publicKey)
	if err != nil {
		return err
	}
	e.PublicKey = pem.EncodeToMemory(
		&pem.Block{
			Type:  "EC PUBLIC KEY",
			Bytes: publicKeyBytes,
		},
	)

	return nil
}

// Sign signs the given message using ECDSA.
func (e *Ecdsa) Sign(messageSupplier MessageSupplier) ([]byte, error) {
	block, _ := pem.Decode(e.PrivateKey)
	if block == nil {
		return nil, errors.New("failed to parse private key")
	}

	priv, err := x509.ParseECPrivateKey(block.Bytes)
	if err != nil {
		return nil, err
	}

	hash := sha256.Sum256(messageSupplier.Get())

	r, s, err := ecdsa.Sign(rand.Reader, priv, hash[:])
	if err != nil {
		return nil, err
	}

	signature, err := asn1.Marshal(struct {
		R *big.Int
		S *big.Int
	}{r, s})

	return signature, err
}

// Verify verifies the given message and signature using ECDSA.
func (e *Ecdsa) Verify(messageSupplier MessageSupplier, signatureSupplier SignatureSupplier) (bool, error) {
	block, _ := pem.Decode(e.PublicKey)
	if block == nil {
		return false, errors.New("failed to parse public key")
	}

	pub, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return false, err
	}

	ecdsaPub, ok := pub.(*ecdsa.PublicKey)
	if !ok {
		return false, errors.New("not an ECDSA public key")
	}

	hash := sha256.Sum256(messageSupplier.Get())

	var rs struct {
		R *big.Int
		S *big.Int
	}

	if _, err := asn1.Unmarshal(signatureSupplier.Get(), &rs); err != nil {
		return false, err
	}

	return ecdsa.Verify(ecdsaPub, hash[:], rs.R, rs.S), nil
}
