package main

import (
	"log"

	"github.com/seungyeop-lee/go-scaffold/server/containers"

	"github.com/gin-gonic/gin"
)

func main() {
	g := gin.Default()

	containers.InitAdminWeb().Register(g)

	if err := g.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
