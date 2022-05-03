package main

import (
	"mypkg/api"
	"github.com/gin-gonic/gin"
)

func main() {
	engine := gin.Default()
	engine.GET("/", api.RootHandle)
	engine.Run(":8080")
}
