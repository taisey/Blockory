package api
import(
	"mypkg/db"
)

type GetDiaryInfoResponse struct{
	DiaryCount int
	Diaries []db.DiaryWithWriterName
}

