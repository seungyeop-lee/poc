package patron

import (
	"github.com/gin-gonic/gin"
	signIn "github.com/seungyeop-lee/go-scaffold/server/internal/commands/patron/sign_in"
	"github.com/seungyeop-lee/go-scaffold/server/internal/interactors/admin/web/patron/message"
)

type Controller struct {
	signIn    *signIn.Command
	presenter *presenter
}

func NewController(signIn *signIn.Command, presenter *presenter) *Controller {
	return &Controller{
		signIn:    signIn,
		presenter: presenter,
	}
}

func (ct *Controller) SignIn() gin.HandlerFunc {
	return func(c *gin.Context) {
		info := message.SignInInfo{}
		if err := c.ShouldBindJSON(&info); err != nil {
			ct.presenter.Error(c)
			return
		}

		if err := ct.signIn.Do(c.Request.Context(), *info.Patron()); err != nil {
			ct.presenter.Error(c)
			return
		}

		ct.presenter.SignIn(c)
	}
}
