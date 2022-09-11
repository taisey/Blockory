package api
import(
	"mypkg/db"
)

type GetDiaryInfoResponse struct{
	DiaryCount int
	Diaries []db.DiaryWithWriterName
}

type PostDiaryInfoRequest struct{
	Title string `json:"Title"`
	Description string `json:"Description"`
	DiaryBody string `json:"DiaryBody"`
	ThumbnailBody string `json:"ThumbnailBody"`
	TargetDate string `json:"TargetDate"`
}

type GetUserInfoResponse struct{
	UserId string 
	UserName string
}

type AuthUserInfoResponse struct{
	SessionId string
}

type PostUserInfoRequest struct{
	UserId string
	UserName string
	UserPassword string
}

type MakeDiaryRequest struct{
	Action string
	Element string
	UserName string
	Date string
}
