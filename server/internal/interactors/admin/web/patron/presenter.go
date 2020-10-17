package patron

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type presenter struct {
}

func NewPresenter() *presenter {
	return &presenter{}
}

func (p *presenter) Error(c *gin.Context) {
	c.AbortWithStatus(http.StatusInternalServerError)
}

func (p *presenter) SignIn(c *gin.Context) {
	c.Status(http.StatusOK)
}
