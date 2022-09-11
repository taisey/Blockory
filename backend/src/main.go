package main

import (
	"github.com/gin-gonic/gin"
	"mypkg/api"
	"mypkg/db"
	"mypkg/redis"
	"github.com/gin-contrib/cors"
	"os"
	"time"
)
func corsSetting(engine *gin.Engine){
	engine.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"https://example.com",
			"https://example2.com",
		},
		AllowMethods: []string{
			"POST",
			"GET",
			"OPTIONS",
		},
		AllowHeaders: []string{
			"Access-Control-Allow-Credentials",
			"Access-Control-Allow-Headers",
			"Content-Type",
			"Content-Length",
			"Accept-Encoding",
			"Authorization",
		},
		AllowCredentials: true,
		MaxAge: 24 * time.Hour,
	  }))
}

func corsSettingAllPass(engine *gin.Engine){
	engine.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"*",
		},
		AllowMethods: []string{
			"*",
		},
		AllowHeaders: []string{
			"*",
		},
	  }))
}
func main() {
	//MysqlDB設定
	if os.Args[1] == "local"{
		//ローカル環境
		redis.InitLocal()
		db.InitLocal()
	}
	if os.Args[1] == "prod"{
		//引数から必要な情報を取得
		userName := os.Args[2] 
		password := os.Args[3]
		host := os.Args[4]
		databaseName := os.Args[5]
		redis.InitProd()
		db.InitProd(userName, password, host, databaseName)
	}	
	dbInstance := db.GetDB()
	defer dbInstance.Close()

	//Gin　engine設定
	engine := gin.Default()
	//CORS設定
	//corsSetting(engine)
	corsSettingAllPass(engine)

	//テンプレートの設定
	engine.LoadHTMLGlob("templates/*")

	engine.Static("/img", "./img")
	engine.Static("/assets", "./assets")
	engine.GET("/", api.RootHandle)
	engine.GET("/DiaryInfo", api.GetDiaryInfo)
	engine.POST("/DiaryInfo", api.PostDiaryInfo)
	engine.GET("/AuthUserInfo", api.AuthUserInfo)
	engine.GET("/UserInfo", api.GetUserInfo)
	engine.POST("/UserInfo", api.PostUserInfo)
	engine.POST("/MakeDiary", api.MakeDiary)
	engine.GET("/MakeDiary", api.MakeDiaryGet)
	engine.Run(":8080")

}
