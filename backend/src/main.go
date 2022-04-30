package main

import (
	"log"
	"net/http"
	"mypkg/api"
)

func main() {
	//ルーティング設定。"/"というアクセスがきたらlogを出力する
	http.HandleFunc("/", api.RootHandle)
	
	log.Println("Listening...")
	// 8080ポートでサーバーを立ち上げる
	http.ListenAndServe(":8080", nil)
}
