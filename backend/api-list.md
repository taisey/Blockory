## API一覧
説明|メゾット|エンドポイント
 -- | -- | -- 
日記情報一覧取得 |GET|DiaryInfo/{year, month, day}
日記情報登録 |POST |DiaryInfo
ユーザー情報取得 |GET|UserInfo

## 各APIの仕様

### 日記情報一覧取得　GET DiaryInfo/{year, month, day}
日記情報を取得するAPI

与えられたクエリによって取得する期間が変化
- year = 2022 ：2022年内の日記を全て取得
- year = 2022, month = 2：2022年2月内の日記を全て取得
- year = 2022, month = 2, day = 3：2022年2月3日内の日記を全て取得

**リクエスト**
```
 {
   year: 2022,
   month: 2,
   day: 3
 }
 ```

 ```
 GET AllDiaryInfoMonth/?year=2022&month=2&day=3
 ```
 
 フィールド名 | 型 | 必須 | 説明
 -- | -- | -- | --
year|number|true|一覧表示する日記の作成年
month|number|false|一覧表示する日記の作成月
day|number|false|一覧表示する日記の作成日

**レスポンス200応答**
```
{
  DiaryCount: 1,
  Diaries:[
    {
      DiaryId:"日記ID",
      Title: "日記タイトル",
      WriterId: "日記作者ID",
      WriterName:  "日記作者名前",
      Description: "日記の説明",
      DiaryBody: "日記コード",
      ThumbnailBody: "サムネイル本体",
      TargetDate:"yyyy-mm-dd",
      UpdateDate:"yyyy-mm-dd",
    }
  ]
}
```
 フィールド名 | 型 | 必須 | 説明
 -- | -- | -- | --
DiaryCount|number|true|条件に一致する日記の全件数
Diaries|日記情報配列|true|一覧表示するための日記情報の配列

日記情報：
 フィールド名 | 型 | 必須 | 説明
 -- | -- | -- | --
DiaryId | string | true | 日記ID
Title | string | false | 日記タイトル
WriterId | string | true | 日記作者ID
WriterName | string | false | 日記作者名前
Description | string | false | 日記の説明
DiaryBody | string | true | 日記コード
ThumbnailBody | string | false | サムネイル画像をbase64でエンコードした文字列
TargetDate | date | true | 日記の日付
UpdateDate | date | true | 最後に更新した日付

### 日記情報登録 POST /DiaryInfo
日記情報を保存するAPI
>セキュリティの観点から、クライアント側から送られてきたuserIdは使わず、代わりにsessionIdを利用する

**リクエスト**
```
{
  DiaryCount: 1,
  Diaries:[
    {
      Title: "日記タイトル",
      Description: "日記の説明",
      DiaryBody: "日記コード",
      ThumbnailBody: "サムネイル本体"
    }
  ]
}
```

日記情報：
フィールド名 | 型 | 必須 | 説明
 -- | -- | -- | --
Title | string | true | 日記タイトル
Description | string | true | 日記の説明
DiaryBody | string | true | 日記コード
ThumbnailBody | string | true | サムネイル画像をbase64でエンコードした文字列

### ユーザー情報取得 GET /UserInfo
ユーザ情報を取得するAPI
>セキュリティの観点から、クライアント側から送られてきたuserIdは使わず、代わりにsessionIdを利用する

**リクエスト**
```
 {
 }
 ```
 **レスポンス**
 ```
 {
  UserId:"ユーザID",
  UserName:"ユーザネーム"
 }
 ```
 ユーザ情報：
 フィールド名 | 型 | 必須 | 説明
 -- | -- | -- | --
UserId | string | true | ユーザID
UserName | string | true | ユーザネーム
 

