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

type SaveDiaryMovieResponse struct{
	DiaryId string
	UserId string
	TargetDate string
}

type SaveDiaryInfoResponse struct{
	DiaryId string
}
type GetDiaryMovieResponse struct{
	DiaryMovie []byte
}

type PostUserInfoRequest struct{
	UserId string
	UserName string
	UserPassword string
}

type MakeDiaryMovieRequest struct{
	Action string
	Element string
	UserName string
	Date string
}

type SaveDiaryMovieRequest struct{
	UserId string `form:"UserId"`
	UserName string `form:"UserName"`
	TargetDate string `form:"TargetDate"`
	DiaryMovie []byte `form:"DiaryMovie"`
}
type SaveDiaryInfoRequest struct{
	DiaryId string
	Title string
	Description string
	DiaryText string
	Thumbnail []byte
}

type GetDiaryMovieRequest struct{
	UserId string
	TargetDate string
}