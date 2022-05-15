package db

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"fmt"
)

var (
	db *sql.DB
)

//Nullable
type User struct {
	UserId string
	UserName string
}

type NullableDiary struct{
	DiaryId string
	Title sql.NullString
	WriterId string
	Description sql.NullString
	ThumbnailBody sql.NullString
	TargetDate string
	UpdateDate string
}

type NullableDiaryWithWriterName struct{
	DiaryId string
	Title sql.NullString
	WriterId string
	WriterName string
	Description sql.NullString
	ThumbnailBody sql.NullString
	TargetDate string
	UpdateDate string
}

type Diary struct{
	DiaryId string
	Title string
	WriterId string
	Description string
	ThumbnailBody string
	TargetDate string
	UpdateDate string
}

type DiaryWithWriterName struct{
	DiaryId string
	Title string
	WriterId string
	WriterName string
	Description string
	ThumbnailBody string
	TargetDate string
	UpdateDate string
}

//ローカルDBを使用するための初期設定
func InitLocal(){
	fmt.Println("[DB] trying to connect LocalDB")
	var err error
	db, err = sql.Open("mysql", "yamaguchi:homebase0908@/BlockoryDB")
    if err != nil {
        panic(err.Error())
	}
	fmt.Println("[DB] connected LocalDB successfully")
}

//本番DBを使用するための初期設定
func InitProd(userName string, password string, host string, databaseName string){
	var err error
	fmt.Println("[DB] trying to connect ProdDB")
	dbInfo := fmt.Sprintf("%s:%s@tcp(%s)/%s", userName, password, host, databaseName)
	db, err = sql.Open("mysql", dbInfo)
    if err != nil {
        panic(err.Error())
	}
	fmt.Println("[DB] connected ProdDB successfully")
}

func GetDB() *sql.DB{
	return db
}