package _interface

import "github.com/gin-gonic/gin"

type SubHandler interface {
	RouterPath() string
	Register(*gin.RouterGroup)
}
