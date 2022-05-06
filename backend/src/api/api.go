package api

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"fmt"
	"time"
	"strconv"
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
	
	query := `SELECT * FROM diaries WHERE target_date `
	//year, month, dayの要素が存在するか確認 && int型に変換
	if yearStr, ok := strconv.Atoi(params["year"]); ok{
		if monthStr_s, ok:= strconv.Atoi(params["month"]); ok{
			if dayStr, ok := strconv.Atoi(params["day"]); ok{
				//検索期間が1日
				//検索対象の先頭と末尾（末尾は含まれる)
				startDate := time.Date(year, month, day, 0, 0, 0, time.Local)
				endDate := startDate.ADD(time.Duration(1) * time.Day - time.Dration(1) * time.Day)
			}else{
				//検索期間が1ヶ月
				startDate := time.Date(year, month, 1, 0, 0, 0, time.Local)
				endDate := startDate.ADD(time.Duration(1) * time.Month - time.Dration(1) * time.Day)
			}
		}else{
			//検索期間が1年
			startDate := time.Date(year, month, 1, 0, 0, 0, time.Local)
			endDate := startDate.ADD(time.Duration(1) * time.Year - time.Dration(1) * time.Day)
	
			layoutYMD = "2006-01-02"
			startDateStr := startDate.format(layoutYMD)
			endDateStr := endDate.format(layoutYMD)
	
			between := fmt.Sprintf(`BETWEEN %s AND %s`, startDateStr, endDateStr)
		}
	}
	query = query + between
	fmt.Println(query)
}
