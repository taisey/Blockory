package db

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
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

//initlocal
func InitLocal(){
	var err error
	db, err = sql.Open("mysql", "yamaguchi:homebase0908@/BlockoryDB")
    if err != nil {
        panic(err.Error())
    }
}

//initlocal
func Init(){
	var err error
	db, err = sql.Open("mysql", "yamaguchi:homebase0908@/BlockoryDB")
    if err != nil {
        panic(err.Error())
    }
}

func GetDB() *sql.DB{
	return db
}