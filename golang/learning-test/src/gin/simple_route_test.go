package gin

import (
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func execRequest(r *gin.Engine, method string, url string, body io.Reader) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(method, url, body)
	r.ServeHTTP(w, req)
	return w
}

func TestPingRoute(t *testing.T) {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})

	w := execRequest(r, "GET", "/ping", nil)

	assert.Equal(t, 200, w.Code)
	assert.Equal(t, "pong", w.Body.String())
}

func TestPathContained(t *testing.T) {
	r := gin.Default()
	r.GET("/user/:id", func(c *gin.Context) {
		c.String(200, "id: "+c.Param("id"))
	})

	w := execRequest(r, "GET", "/user/", nil)
	assert.Equal(t, 404, w.Code)

	w = execRequest(r, "GET", "/user/1", nil)
	assert.Equal(t, 200, w.Code)
	assert.Equal(t, "id: 1", w.Body.String())

	w = execRequest(r, "GET", "/user/1/", nil)
	assert.Equal(t, 301, w.Code)
	assert.Contains(t, w.Body.String(), "/user/1")
}

func TestPathContainedAsterisk(t *testing.T) {
	r := gin.Default()
	r.GET("/user/:id/*info", func(c *gin.Context) {
		c.String(200, "id: "+c.Param("id")+", info: "+c.Param("info"))
	})

	w := execRequest(r, "GET", "/user/1", nil)
	assert.Equal(t, 404, w.Code)

	w = execRequest(r, "GET", "/user/1/", nil)
	assert.Equal(t, 200, w.Code)
	assert.Equal(t, "id: 1, info: /", w.Body.String())

	w = execRequest(r, "GET", "/user/1/name", nil)
	assert.Equal(t, 200, w.Code)
	assert.Equal(t, "id: 1, info: /name", w.Body.String())
}

func TestNoRoute(t *testing.T) {
	r := gin.Default()
	r.GET("/user", func(c *gin.Context) {
		c.String(200, "id: "+c.Param("id")+", info: "+c.Param("info"))
	})
	r.NoRoute(func(c *gin.Context) {
		c.String(404, "Fail!")
	})

	w := execRequest(r, "GET", "/users", nil)
	assert.Equal(t, 404, w.Code)
	assert.Equal(t, "Fail!", w.Body.String())
}
