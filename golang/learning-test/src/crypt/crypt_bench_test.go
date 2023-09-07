package crypt

import (
	"crypto/rand"
	"crypto/sha256"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/crypto/pbkdf2"
	"golang.org/x/crypto/scrypt"
	"io"
	"testing"
)

var password = "abcd1234"
var hash, _ = bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

func BenchmarkPBKDF2Generate(b *testing.B) {
	for i := 0; i < b.N; i++ {
		salt := generateRandomSalt(8)
		pbkdf2.Key([]byte(password), []byte(salt), 4096, 32, sha256.New)
	}
}

func BenchmarkBcryptGenerate(b *testing.B) {
	for i := 0; i < b.N; i++ {
		bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	}
}

func BenchmarkBcryptCompareHash(b *testing.B) {
	for i := 0; i < b.N; i++ {
		bcrypt.CompareHashAndPassword(hash, []byte(password))
	}
}

func BenchmarkScryptGenerate(b *testing.B) {
	for i := 0; i < b.N; i++ {
		salt := generateRandomSalt(8)
		scrypt.Key([]byte(password), []byte(salt), 32768, 8, 1, 32)
	}
}

func BenchmarkPBKDF2GenerateMulticore(b *testing.B) {
	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			salt := generateRandomSalt(8)
			pbkdf2.Key([]byte(password), []byte(salt), 4096, 32, sha256.New)
		}
	})
}

func BenchmarkBcryptGenerateMulticore(b *testing.B) {
	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		}
	})
}

func BenchmarkBcryptCompareHashMulticore(b *testing.B) {
	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			bcrypt.CompareHashAndPassword(hash, []byte(password))
		}
	})
}

func BenchmarkScryptGenerateMulticore(b *testing.B) {
	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			salt := generateRandomSalt(8)
			scrypt.Key([]byte(password), []byte(salt), 32768, 8, 1, 32)
		}
	})
}

func generateRandomSalt(length int) string {
	salt := make([]byte, length)
	if _, err := io.ReadFull(rand.Reader, salt); err != nil {
		return ""
	}
	return string(salt)
}
