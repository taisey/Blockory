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

	//paramsのyear, month, dayをint型に変換（ExtractNum）　
	extractNum := strconv.Atoi

	//検索範囲の先頭と末尾
	var(
		startDate time.Time
		endDate time.Time
	)

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
	between := fmt.Sprintf(`BETWEEN %s AND %s`, startDateStr, endDateStr)
	query = query + between
	
	fmt.Println(query)
}
