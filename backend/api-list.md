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
  diaryCount: 1,
  items:[
    {
      diaryId:"日記ID",
      title: "日記タイトル",
      writerId: "日記作者ID",
      writerName:  "日記作者名前",
      description: "日記の説明",
      thumbnailBody: "サムネイル本体"
      date:"yyyy-mm-dd"
      updateDate:"yyyy-mm-dd"
    }
  ]
}
```
 フィールド名 | 型 | 必須 | 説明
 -- | -- | -- | --
diaryCount|number|true|条件に一致する日記の全件数
items|日記情報配列|true|一覧表示するための日記情報の配列

日記情報：
 フィールド名 | 型 | 必須 | 説明
 -- | -- | -- | --
diaryId | string | true | 日記ID
title | string | true | 日記タイトル
writerId | string | true | 日記作者ID
writerName | string | true | 日記作者名前
description | string | true | 日記の説明
thubnailInfo | サムネイル情報配列 | true | サムネイル情報
thumbnailBody | string | true | サムネイル画像をbase64でエンコードした文字列
date | date | 日記の日付
updateDate | date | 最後に更新した日付

### 日記情報登録 POST /DiaryInfo
日記情報を保存するAPI
>セキュリティの観点から、クライアント側から送られてきたuserIdは使わず、代わりにsessionIdを利用する

**リクエスト**
```
{
  diaryCount: 1,
  items:[
    {
      title: "日記タイトル",
      description: "日記の説明",
      thumbnailBody: "サムネイル本体"
    }
  ]
}
```

日記情報：
フィールド名 | 型 | 必須 | 説明
 -- | -- | -- | --
title | string | true | 日記タイトル
description | string | true | 日記の説明
thubnailInfo | サムネイル情報配列 | true | サムネイル情報
thumbnailBody | string | true | サムネイル画像をbase64でエンコードした文字列

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
  userId:"ユーザID",
  userName:"ユーザネーム"
 }
 ```
 ユーザ情報：
 フィールド名 | 型 | 必須 | 説明
 -- | -- | -- | --
userId | string | true | ユーザID
userName | string | true | ユーザネーム
 

