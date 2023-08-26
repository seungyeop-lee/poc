package go_jwt

import (
	"crypto/rand"
	"crypto/rsa"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/stretchr/testify/assert"
	"log"
	"os"
	"testing"
	"time"
)

var RSASignKey *rsa.PrivateKey
var RSAVerifyKey *rsa.PublicKey
var expectedRSAClaims = jwt.MapClaims{
	"foo": "bar",
	"nbf": time.Date(2015, 10, 10, 12, 0, 0, 0, time.UTC).Unix(),
}

func fatal(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func TestMain(m *testing.M) {
	setUp()
	os.Exit(m.Run())
}

func setUp() {
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	fatal(err)
	publicKey := &privateKey.PublicKey
	RSASignKey = privateKey
	RSAVerifyKey = publicKey
}

func TestBuildingAndParsingTokenRSA(t *testing.T) {
	buildingToken := jwt.NewWithClaims(jwt.SigningMethodRS256, expectedRSAClaims)

	tokenString, err := buildingToken.SignedString(RSASignKey)
	if err != nil {
		assert.FailNow(t, err.Error())
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return RSAVerifyKey, nil
	})
	if err != nil {
		assert.FailNow(t, err.Error())
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		assert.Equal(t, expectedRSAClaims["foo"], claims["foo"])
		assert.EqualValues(t, expectedRSAClaims["nbf"], claims["nbf"])
	} else {
		assert.FailNow(t, err.Error())
	}
}

func BenchmarkRSA(b *testing.B) {
	setUp()
	for i := 0; i < b.N; i++ {
		buildingToken := jwt.NewWithClaims(jwt.SigningMethodRS256, expectedRSAClaims)
		tokenString, _ := buildingToken.SignedString(RSASignKey)
		jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return RSAVerifyKey, nil
		})
	}
}