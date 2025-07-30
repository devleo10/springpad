package main

import (
	"springpad-doc-parser/internal/config"
	"springpad-doc-parser/internal/handler"
	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadEnv()
	r := gin.Default()

	handler.RegisterRoutes(r)

	r.Run(":8080")
}
