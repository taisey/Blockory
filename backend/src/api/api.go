package api

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"fmt"
	"time"
	"strconv"
	"mypkg/db"
	"mypkg/redis"
	"log"
	"github.com/google/uuid"
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
	//リクエストをディクショナリにする
	req := c.Request
	params := req.URL.Query()

	//[TODO]エラーハンドリング追加（paramsが存在するか、値が妥当か）

	query := "SELECT diaries.diary_id, diaries.title, diaries.writer_id, users.user_name, diaries.description, diaries.diary_body, " +
			"diaries.thumbnail_body, diaries.target_date, diaries.update_date " +
			"FROM diaries INNER JOIN users ON diaries.writer_id=users.user_id WHERE diaries.target_date "
	querySortOption :=  ` ORDER BY diaries.target_date asc, users.user_name asc;`
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


	if(containAll(params, [] string{"writerId"})){
		//クエリにuserIdを含む場合
		user_id := params["writerId"][0]
		userIdQuery := ` AND writer_id="%s" `
		userIdQueryWithParams := fmt.Sprintf(userIdQuery, user_id)
		query = query + between + userIdQueryWithParams
	}else{
		//クエリにuserIdを含まない場合
		query = query + between + querySortOption
	}
	fmt.Printf("[DB] query: %s\n", query)

	//DBインスタンスの取得
	dbIns := db.GetDB()

	//検索結果をrowsに格納
	rows, err := dbIns.Query(query)
	if(err != nil){
		panic(err.Error())
	}
	defer rows.Close()

	fmt.Println(rows)

	//レスポンスと同型の構造体配列diariesの生成
	diaries := []db.DiaryWithWriterName{}
	for rows.Next(){
		//Nullを許す構造体ndを生成
		nd := db.NullableDiaryWithWriterName{}
		err := rows.Scan(&nd.DiaryId, &nd.Title, &nd.WriterId, &nd.WriterName,
			&nd.Description, &nd.DiaryBody, &nd.ThumbnailBody, &nd.TargetDate, &nd.UpdateDate)

		//dに日記情報を格納
		d := db.DiaryWithWriterName{
			DiaryId: nd.DiaryId,
			Title: nd.Title.String,
			WriterId: nd.WriterId,
			WriterName: nd.WriterName,
			Description: nd.Description.String,
			DiaryBody: nd.DiaryBody.String,
			ThumbnailBody: nd.ThumbnailBody.String,
			TargetDate: nd.TargetDate,
			UpdateDate: nd.UpdateDate,
		}
		if err != nil{
			log.Fatal(err)
		}
		fmt.Println(d)
		//dをdiariesに追加
		diaries = append(diaries, d)
	}

	response := GetDiaryInfoResponse{
		DiaryCount: len(diaries),
		Diaries: diaries,
	}
	c.JSON(http.StatusOK, response)
}

func PostDiaryInfo(c *gin.Context){
	Request := PostDiaryInfoRequest{}
	err := c.ShouldBindJSON(&Request)

	fmt.Println("[Request] ", Request)
	//unmarshalが失敗した場合、404を返す
	if err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return;
	}

	//diariesテーブルへのINSERT文
	query := `INSERT diaries (diary_id, title, description, diary_body, thumbnail_body, writer_id, target_date, update_date) ` +
			`VALUES("%s", "%s", "%s", "%s", "%s","%s", "%s", "%s");`
	dbIns := db.GetDB()

	//[TODO]CookieのセッションIDからwriterIdを持ってくる
	writer_id := "testWriterId0"

	//diary_idをuuidで生成する
	diary_id, err := uuid.NewRandom()
	if err != nil {
			fmt.Println(err)
			return
	}

	//update_dateを生成する
	nowTime := time.Now()
	//yyyy-mm-dd hh:mm:ss形式に変換
	layoutYMDHMS := "2006-01-02 15:04:05"
	updateDate := nowTime.Format(layoutYMDHMS)

	//queryにvalueを埋め込む
	queryWithParam := fmt.Sprintf(query, diary_id, Request.Title, Request.Description, Request.DiaryBody, Request.ThumbnailBody,
						writer_id, Request.TargetDate, updateDate)

	//クエリの実行
	fmt.Println("[Query] ", queryWithParam)
	_, err1 := dbIns.Exec(queryWithParam)
	//クエリの実行が失敗した場合404を返す
	if err1 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	//200を返す
	//[TODO]Request + writer_id + writer_name + diary_id + update_dateをレスポンスとして返したい
	c.JSON(http.StatusOK, Request)
}

func GetUserInfo(c *gin.Context){
	//HeaderからSessionIdを入手
	session_id:= c.Request.Header.Get("SessionId")

	//redisからUserIdを取得
	user_id, err:= redis.Get(session_id)
	if(err != nil){
		//UserIdの取得に失敗したとき
		c.JSON(http.StatusBadRequest, gin.H{"error": "Your SessionId is invalid"})
		return
	}

	//クエリを作成
	query := `SELECT user_name FROM users WHERE user_id="%s" ;`
	queryWithParam := fmt.Sprintf(query, user_id)

	//クエリを実行
	dbIns := db.GetDB()
	rows, _ := dbIns.Query(queryWithParam)


	//レスポンスを作成
	response := GetUserInfoResponse{UserId: user_id}
	for rows.Next(){
		rows.Scan(&response.UserName)
	}
	c.JSON(http.StatusOK, response)
	return
}

func PostUserInfo(c * gin.Context){
	Request := PostUserInfoRequest{}
	err := c.ShouldBindJSON(&Request)

	fmt.Println("[Request] ", Request)
	//unmarshalが失敗した場合、404を返す
	if err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return;
	}

	user_id := Request.UserId
	user_name := Request.UserName
	user_password := Request.UserPassword

	//登録したいIDと同一のIDを持つユーザを抽出する
	query := `SELECT * FROM users WHERE user_id="%s" ;`
	queryWithParams := fmt.Sprintf(query, user_id)
	fmt.Printf("[query]")
	fmt.Println(queryWithParams)

	//DBインスタンスの取得
	dbIns := db.GetDB()
	rows, _ := dbIns.Query(queryWithParams)

	//既に同IDのユーザがいるかどうかの確認
	exist_f := false
	for rows.Next(){
		exist_f = true
	}

	if(exist_f == false){
		//IDの重複がなかった場合
		insertQuery := `INSERT users (user_id, user_name, user_password) VALUES ("%s", "%s", "%s")`
		insertQueryWithParams := fmt.Sprintf(insertQuery, user_id, user_name, user_password)
		dbIns.Query(insertQueryWithParams)

		//リクエストそのままを200レスポンスで返す
		c.JSON(http.StatusOK, Request)
	}else{
		//IDの重複があった場合
		//400レスポンスを返す
		c.JSON(http.StatusBadRequest, gin.H{"error": "Your UserId Is Already Used"})
	}
}

func AuthUserInfo(c *gin.Context){
	//リクエストをディクショナリにする
	req := c.Request
	params := req.URL.Query()

	user_id := params["UserId"][0]
	user_password := params["UserPassword"][0]

	//user_idとuser_passwordを照合する
	query := `SELECT * FROM users WHERE user_id="%s" AND user_password="%s"`
	queryWithParams := fmt.Sprintf(query, user_id, user_password)

	//DBインスタンスの取得
	dbIns := db.GetDB()
	rows, _ := dbIns.Query(queryWithParams)

	//認証できたかどうかを表すフラグ
	auth_f := false
	for rows.Next(){
		auth_f = true
	}

	//認証ができた場合
	if(auth_f){
		session_id_uuid, err := uuid.NewRandom()
		if err != nil {
				fmt.Println(err)
				return
		}
		session_id := session_id_uuid.String()

		//redisに登録
		redis.Set(session_id, user_id)

		//レスポンスの作成
		response := AuthUserInfoResponse{SessionId: session_id}
		c.JSON(http.StatusOK, response)
	}else{
		//認証ができない場合
		c.JSON(http.StatusBadRequest, gin.H{"error": "Your Account Not Found"})
		return
	}
}

func MakeDiary(c *gin.Context){
	Request := MakeDiaryRequest{}
	err := c.ShouldBindJSON(&Request)
	fmt.Println("[Request] ", Request)
	//unmarshalが失敗した場合、404を返す
	if err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return;
	}

	action := Request.Action
	element := Request.Element
	user_name := Request.UserName
	date := Request.Date

	c.HTML(http.StatusOK, "diaryMovie.html", gin.H{
		"Action": action,
		"Element": element,
		"UserName": user_name,
		"Date": date,
	})
	// c.HTML(http.StatusOK, "index.tmpl", gin.H{
	// 	"title": "Main website",
	// })
}

func MakeDiaryGet(c *gin.Context){
	req := c.Request
	params := req.URL.Query()

	action := params["Action"][0]
	element := params["Element"][0]
	user_name := params["UserName"][0]
	date := params["Date"][0]

	c.HTML(http.StatusOK, "diaryMovie.html", gin.H{
		"Action": action,
		"Element": element,
		"UserName": user_name,
		"Date": date,
	})
	// c.HTML(http.StatusOK, "index.tmpl", gin.H{
	// 	"title": "Main website",
	// })
}

func SaveMovie(c *gin.Context){
	//リクエストそのままを200レスポンスで返す
	c.String(http.StatusOK, "uploaded")
}