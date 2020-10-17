package patron

import (
	"github.com/gin-gonic/gin"
	"github.com/seungyeop-lee/go-scaffold/server/internal/interactors/admin/web/patron"
)

type Handler struct {
	controller *patron.Controller
}

func NewHandler(controller *patron.Controller) *Handler {
	return &Handler{
		controller: controller,
	}
}

func (h *Handler) RouterPath() string {
	return "patron"
}

func (h *Handler) Register(c *gin.Engine) {
	g := c.Group("patron")
	g.POST("/sign-in", h.controller.SignIn())
}
