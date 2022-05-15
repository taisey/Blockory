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
		//ローカル環境
		db.InitLocal()
	}
	if os.Args[1] == "prod"{
		//引数から必要な情報を取得
		userName := os.Args[2] 
		password := os.Args[3]
		host := os.Args[4]
		databaseName := os.Args[5]
		db.InitProd(userName, password, host, databaseName)
	}	
	dbInstance := db.GetDB()
	defer dbInstance.Close()

	//Gin　engine設定
	engine := gin.Default()
	engine.GET("/", api.RootHandle)
	engine.GET("/DiaryInfo", api.GetDiaryInfo)
	//engine.POST("/DiaryInfo", api.postDiaryInfo)
	//engine.GET("/UserInfo", api.getUserInfo)
	engine.Run(":8000")

}
