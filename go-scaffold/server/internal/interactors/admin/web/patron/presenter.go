package patron

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type presenter struct {
}

func NewPresenter() *presenter {
	return &presenter{}
}

func (p *presenter) Error(c *gin.Context, err error) {
	fmt.Println(err)
	c.AbortWithStatus(http.StatusInternalServerError)
}

func (p *presenter) SignIn(c *gin.Context) {
	c.Status(http.StatusOK)
}
