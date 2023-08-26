package gin_jwt

import (
	"bytes"
	"encoding/json"
	jwt "github.com/appleboy/gin-jwt/v2"
	jwtGo "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"
)

type Login struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Success struct {
	Code   int    `json:"code"`
	Token  string `json:"token"`
	Expire string `json:"expire"`
}

type Fail struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

const (
	key = "secret key"
	identity = "identity"
)

var (
	executeOrder         []string
	defaultAuthenticator = func(c *gin.Context) (interface{}, error) {
		executeOrder = append(executeOrder, "Authenticator")
		var loginVals Login
		if binderr := c.ShouldBindJSON(&loginVals); binderr != nil {
			return "", jwt.ErrMissingLoginValues
		}
		username := loginVals.Username
		password := loginVals.Password
		if username == "admin" && password == "admin" {
			return username, nil
		}
		if username == "guest" {
			return username, nil
		}
		return "", jwt.ErrFailedAuthentication
	}
	defaultPayloadFunc = func(data interface{}) jwt.MapClaims {
		executeOrder = append(executeOrder, "PayloadFunc")
		if v, ok := data.(string); ok {
			if v == "admin" || v == "guest" {
				return jwt.MapClaims{
					identity: v,
				}
			}
		}
		return jwt.MapClaims{}
	}
	defaultLoginResponse = func(c *gin.Context, code int, token string, expire time.Time) {
		executeOrder = append(executeOrder, "LoginResponse")
		c.JSON(http.StatusOK, Success{
			Code:   http.StatusOK,
			Token:  token,
			Expire: expire.Format(time.RFC3339),
		})
	}
	defaultUnauthorized = func(c *gin.Context, code int, message string) {
		executeOrder = append(executeOrder, "Unauthorized")
		c.JSON(code, Fail{
			Code:    code,
			Message: message,
		})
	}
)

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func ginJWTMidForLoginTest() *jwt.GinJWTMiddleware {
	authMiddleware, err := jwt.New(&jwt.GinJWTMiddleware{
		Key:           []byte(key), // 필수
		Authenticator: defaultAuthenticator,
		PayloadFunc:   defaultPayloadFunc,
		LoginResponse: defaultLoginResponse,
		Unauthorized:  defaultUnauthorized,
	})
	checkErrAndFatal(err, "fail build GinJWTMiddleware")
	return authMiddleware
}

func TestLoginFail(t *testing.T) {
	r := gin.Default()
	authMiddleware := ginJWTMidForLoginTest()
	r.POST("/login", authMiddleware.LoginHandler)

	executeOrder = []string{}
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/login", nil)
	r.ServeHTTP(w, req)

	fail := getFail(t, w)
	assert.Equal(t, 401, fail.Code)
	assert.Equal(t, "missing Username or Password", fail.Message)

	assert.Equal(t, 2, len(executeOrder))
	assert.Equal(t, "Authenticator", executeOrder[0])
	assert.Equal(t, "Unauthorized", executeOrder[1])
}

func TestLoginNormal(t *testing.T) {
	r := gin.Default()
	authMiddleware := ginJWTMidForLoginTest()
	r.POST("/login", authMiddleware.LoginHandler)

	executeOrder = []string{}
	info := Login{
		Username: "admin",
		Password: "admin",
	}
	loginJson, _ := json.Marshal(&info)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(loginJson))
	r.ServeHTTP(w, req)

	success := getSuccess(t, w)
	assert.Equal(t, 200, success.Code)
	token, _ := jwtGo.Parse(success.Token, func(t *jwtGo.Token) (i interface{}, err error) {
		return []byte(key), nil
	})
	if claims, ok := token.Claims.(jwtGo.MapClaims); ok {
		assert.Equal(t, claims["identity"], "admin")
	} else {
		assert.Fail(t, "get claim fail")
	}

	assert.Equal(t, 3, len(executeOrder))
	assert.Equal(t, "Authenticator", executeOrder[0])
	assert.Equal(t, "PayloadFunc", executeOrder[1])
	assert.Equal(t, "LoginResponse", executeOrder[2])
}

func ginJWTMidForAuthorizeTest() *jwt.GinJWTMiddleware {
	authMiddleware, err := jwt.New(&jwt.GinJWTMiddleware{
		Key:           []byte(key), // 필수
		Authenticator: defaultAuthenticator,
		PayloadFunc:   defaultPayloadFunc,
		LoginResponse: defaultLoginResponse,
		IdentityHandler: func(c *gin.Context) interface{} {
			executeOrder = append(executeOrder, "IdentityHandler")
			claims := jwt.ExtractClaims(c)
			return claims[identity].(string)
		},
		Authorizator: func(data interface{}, c *gin.Context) bool {
			executeOrder = append(executeOrder, "Authorizator")
			if v, ok := data.(string); ok {
				if v == "admin" {
					return true
				}
			}
			return false
		},
		Unauthorized: defaultUnauthorized,
	})
	checkErrAndFatal(err, "fail build GinJWTMiddleware")
	return authMiddleware
}

func initForAuthorizeTest() *gin.Engine {
	r := gin.Default()
	authMiddleware := ginJWTMidForAuthorizeTest()

	r.POST("/login", authMiddleware.LoginHandler)

	user := r.Group("/user")
	user.Use(authMiddleware.MiddlewareFunc())
	user.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})
	return r
}

func TestAuthorizeFail_EmptyHeader(t *testing.T) {
	r := initForAuthorizeTest()

	executeOrder = []string{}
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/user/ping", nil)
	r.ServeHTTP(w, req)

	fail := getFail(t, w)
	assert.Equal(t, 401, fail.Code)
	assert.Equal(t, "auth header is empty", fail.Message)
	assert.Equal(t, 1, len(executeOrder))
	assert.Equal(t, "Unauthorized", executeOrder[0])
}

func TestAuthorizeFail_InvalidToken(t *testing.T) {
	r := initForAuthorizeTest()

	executeOrder = []string{}
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/user/ping", nil)
	req.Header.Add("Authorization", "Bearer " + "invalidToken")
	r.ServeHTTP(w, req)

	fail := getFail(t, w)
	assert.Equal(t, 401, fail.Code)
	assert.Equal(t, "token contains an invalid number of segments", fail.Message)
	assert.Equal(t, 1, len(executeOrder))
	assert.Equal(t, "Unauthorized", executeOrder[0])
}

func TestAuthorizeFail_UnAuthorize(t *testing.T) {
	r := initForAuthorizeTest()

	executeOrder = []string{}
	info := Login{
		Username: "guest",
		Password: "guest",
	}
	loginJson, _ := json.Marshal(&info)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(loginJson))
	r.ServeHTTP(w, req)
	success := getSuccess(t, w)

	executeOrder = []string{}
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("GET", "/user/ping", nil)
	req.Header.Add("Authorization", "Bearer "+success.Token)
	r.ServeHTTP(w, req)

	fail := getFail(t, w)
	assert.Equal(t, 403, fail.Code)
	assert.Equal(t, "you don't have permission to access this resource", fail.Message)
	assert.Equal(t, 3, len(executeOrder))
	assert.Equal(t, "IdentityHandler", executeOrder[0])
	assert.Equal(t, "Authorizator", executeOrder[1])
	assert.Equal(t, "Unauthorized", executeOrder[2])
}

func TestAuthorizeNormal(t *testing.T) {
	r := initForAuthorizeTest()

	executeOrder = []string{}
	info := Login{
		Username: "admin",
		Password: "admin",
	}
	loginJson, _ := json.Marshal(&info)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(loginJson))
	r.ServeHTTP(w, req)
	success := getSuccess(t, w)

	executeOrder = []string{}
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("GET", "/user/ping", nil)
	req.Header.Add("Authorization", "Bearer "+success.Token)
	r.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	assert.Equal(t, "pong", w.Body.String())
	assert.Equal(t, 2, len(executeOrder))
	assert.Equal(t, "IdentityHandler", executeOrder[0])
	assert.Equal(t, "Authorizator", executeOrder[1])
}

func checkErrAndFatal(err error, msg string) {
	if err != nil {
		log.Fatal(msg)
	}
}

func getFail(t *testing.T, w *httptest.ResponseRecorder) *Fail {
	var fail Fail
	err := json.NewDecoder(w.Body).Decode(&fail)
	if err != nil {
		assert.Fail(t, err.Error())
	}
	return &fail
}

func getSuccess(t *testing.T, w *httptest.ResponseRecorder) *Success {
	var success Success
	err := json.NewDecoder(w.Body).Decode(&success)
	if err != nil {
		assert.Fail(t, err.Error())
	}
	return &success
}