package api

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

//root-handle
func RootHandle(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "hello world",
	})
}
