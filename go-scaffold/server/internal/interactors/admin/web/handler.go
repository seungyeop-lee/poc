package web

import (
	"github.com/gin-gonic/gin"
	"github.com/seungyeop-lee/go-scaffold/server/internal/interactors/admin/web/patron"
)

type MainHandler struct {
	patron *patron.Handler
}

func NewHandler(patron *patron.Handler) *MainHandler {
	return &MainHandler{
		patron: patron,
	}
}

func (h *MainHandler) Register(c *gin.Engine) {
	h.patron.Register(c)
}
