package crypto

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"errors"
	"io"
)

// Aes 구조체는 AES 암호화/복호화를 처리합니다.
type Aes struct {
	Key []byte // 암호화 키
}

// Encrypt 메서드는 주어진 평문(plaintext)을 암호화합니다.
func (a *Aes) Encrypt(plaintext []byte) ([]byte, error) {
	block, err := aes.NewCipher(a.Key)
	if err != nil {
		return nil, err
	}

	// 블록 크기에 맞게 패딩
	padding := block.BlockSize() - len(plaintext)%block.BlockSize()
	padtext := bytes.Repeat([]byte{byte(padding)}, padding)
	plaintext = append(plaintext, padtext...)

	// 암호화를 위한 출력 슬라이스 초기화
	ciphertext := make([]byte, aes.BlockSize+len(plaintext))

	// IV를 생성하고 채움
	iv := ciphertext[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return nil, err
	}

	// 암호화 모드 설정 및 암호화 수행
	mode := cipher.NewCBCEncrypter(block, iv)
	mode.CryptBlocks(ciphertext[aes.BlockSize:], plaintext)

	return ciphertext, nil
}

// Decrypt 메서드는 주어진 암호문(ciphertext)을 복호화합니다.
func (a *Aes) Decrypt(ciphertext []byte) ([]byte, error) {
	block, err := aes.NewCipher(a.Key)
	if err != nil {
		return nil, err
	}

	if len(ciphertext) < aes.BlockSize {
		return nil, errors.New("Ciphertext too short")
	}

	// IV 및 암호화된 부분 분리
	iv := ciphertext[:aes.BlockSize]
	ciphertext = ciphertext[aes.BlockSize:]

	// 복호화 모드 설정 및 복호화 수행
	mode := cipher.NewCBCDecrypter(block, iv)
	mode.CryptBlocks(ciphertext, ciphertext)

	// 패딩 제거
	padding := int(ciphertext[len(ciphertext)-1])
	if padding > len(ciphertext) {
		return nil, errors.New("Padding size error")
	}

	return ciphertext[:len(ciphertext)-padding], nil
}
