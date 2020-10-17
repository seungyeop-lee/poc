package patron

import (
	"github.com/gin-gonic/gin"
)

type Handler struct {
	controller *Controller
}

func NewHandler(controller *Controller) *Handler {
	return &Handler{
		controller: controller,
	}
}

func (h *Handler) Register(c *gin.Engine) {
	g := c.Group("patron")
	g.POST("/sign-in", h.controller.SignIn())
}
