package go_jwt

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

const secretKey = "key"

var expectedHMACClaims = jwt.MapClaims{
	"foo": "bar",
	"nbf": time.Date(2015, 10, 10, 12, 0, 0, 0, time.UTC).Unix(),
}
var expectedHMACTokenString = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJuYmYiOjE0NDQ0Nzg0MDB9.s-5FCqcKKSq8EyzsrYNbfiz1dHqmFav5BWC6Njv5EmQ"

func TestBuildingTokenHMAC(t *testing.T) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, expectedHMACClaims)
	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		assert.FailNow(t, err.Error())
	}
	assert.Equal(t, expectedHMACTokenString, tokenString)
}

func TestParsingTokenHMAC(t *testing.T) {
	token, err := jwt.Parse(expectedHMACTokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secretKey), nil
	})
	if err != nil {
		assert.FailNow(t, err.Error())
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		assert.Equal(t, expectedHMACClaims["foo"], claims["foo"])
		assert.EqualValues(t, expectedHMACClaims["nbf"], claims["nbf"])
	} else {
		assert.FailNow(t, err.Error())
	}
}

func BenchmarkHMAC(b *testing.B) {
	for i := 0; i < b.N; i++ {
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, expectedHMACClaims)
		tokenString, _ := token.SignedString([]byte(secretKey))
		jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(secretKey), nil
		})
	}
}
