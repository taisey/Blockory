package api

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"fmt"
	"time"
	"strconv"
	"mypkg/db"
	"log"
	//"encoding/json"
	//"os"
)

//root-handle
func RootHandle(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "hello world",
	})
}

func GetDiaryInfo(c *gin.Context){
	req := c.Request
	params := req.URL.Query()
	//[TODO]エラーハンドリング追加（paramsが存在するか、値が妥当か）
	
	query := "SELECT diaries.diary_id, diaries.title, diaries.writer_id, users.user_name, diaries.description, " +
			"diaries.thumbnail_body, diaries.target_date, diaries.update_date " +
			"FROM diaries INNER JOIN users ON diaries.writer_id=users.user_id WHERE diaries.target_date "
	querySortOption :=  ` ORDER BY diaries.target_date asc, users.user_name asc`
	//リストが特定の要素を全て含むか確認する関数
	containAll := func (list map[string][]string, elements []string) bool {
		for _, element := range(elements){
			if _, ok := list[element]; ok{
				continue
			}else{
				return false
			}
		}
		return true
	}

	//文字列をint型に変換（ExtractNum）　
	extractNum := strconv.Atoi

	//検索範囲の先頭と末尾
	var(
		startDate time.Time
		endDate time.Time
	)

	//year, month, dayを含むかどうかで場合わけ
	if(containAll(params, [] string{"year", "month", "day"})){
		//検索期間が1日
		year, _ := extractNum(params["year"][0])
		month, _ := extractNum(params["month"][0])
		day, _ := extractNum(params["day"][0])

		startDate = time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.Local)
		endDate = startDate
		
	}else if(containAll(params, [] string{"year", "month"})){
		//検索期間が1ヶ月	
		year, _ := extractNum(params["year"][0])
		month, _ := extractNum(params["month"][0])

		startDate = time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.Local)
		endDate = startDate.AddDate(0, 1, -1)

	}else if(containAll(params, [] string{"year"})){
		//検索期間が1年
		year, _ := extractNum(params["year"][0])

		startDate = time.Date(year, time.Month(1), 1, 0, 0, 0, 0, time.Local)
		endDate = startDate.AddDate(1, 0, -1)
	}

	//yyyy-mm-dd形式に変換
	layoutYMD := "2006-01-02"
	startDateStr := startDate.Format(layoutYMD)
	endDateStr := endDate.Format(layoutYMD)

	//queryを生成
	between := fmt.Sprintf(`BETWEEN '%s' AND '%s'`, startDateStr, endDateStr)
	query = query + between + querySortOption
	
	fmt.Printf("[DB]query: %s\n", query)

	//DBインスタンスの取得
	dbIns := db.GetDB()
	rows, _ := dbIns.Query(query)
	defer rows.Close()
	
	fmt.Println(rows)
	diaries := []db.DiaryWithWriterName{}
	for rows.Next(){
		nd := db.NullableDiaryWithWriterName{}
		err := rows.Scan(&nd.DiaryId, &nd.Title, &nd.WriterId, &nd.WriterName,
			&nd.Description, &nd.ThumbnailBody, &nd.TargetDate, &nd.UpdateDate)
		
		d := db.DiaryWithWriterName{
			DiaryId: nd.DiaryId,
			Title: nd.Title.String,
			WriterId: nd.WriterId,
			WriterName: nd.WriterName,
			Description: nd.Description.String,
			ThumbnailBody: nd.ThumbnailBody.String,
			TargetDate: nd.TargetDate,
			UpdateDate: nd.UpdateDate,
		}
		if err != nil{
			log.Fatal(err)
		}
		fmt.Println(d)
		diaries = append(diaries, d)
	}

	response := GetDiaryInfoResponse{
		DiaryCount: len(diaries),
		Diaries: diaries,
	}
	c.JSON(http.StatusOK, response)
}
