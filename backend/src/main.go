package main

import (
	"github.com/gin-gonic/gin"
	"mypkg/api"
	"mypkg/db"
	"os"
)

func main() {
	//MysqlDB設定
	if os.Args[1] == "local"{
		db.InitLocal()
	}else{
		db.Init()
	}
	dbInstance := db.GetDB()
	defer dbInstance.Close()

	//Gin　engine設定
	engine := gin.Default()
	engine.GET("/", api.RootHandle)
	engine.GET("/DiaryInfo", api.GetDiaryInfo)
	//engine.POST("/DiaryInfo", api.postDiaryInfo)
	//engine.GET("/UserInfo", api.getUserInfo)
	engine.Run(":8080")

}
