## 各APIの使用

### 日記情報一覧表示（一か月分） POST AllDiaryinfoMonth/
日記情報を一月分取得するAPI

**リクエスト**
```
 {
   year: "yyyy"
   month: "mm"
 }
 ```
 
 フィールド名 | 型 | 必須 | 説明
 -- | -- | -- | --
year|number|true|一覧表示する日記の作成年
month|number|ture|一覧表示する日記の作成月

**レスポンス200応答**
```
{
  diaryCount: "取得した日記の数",
  items:[
    {
      diaryId:"日記ID",
      title: "日記タイトル",
      writerId: "日記作者ID",
      writerName:  "日記作者名前,
      description: "日記の説明",
      thumbnailInfo:[
        thumbnailId: "サムネイル ID",
        thumbnailBody: "サムネイル本体"
    }
  ]
}
```
 フィールド名 | 型 | 必須 | 説明
 -- | -- | -- | --
diaryCount|number|true|条件に一致する日記の全件数
items|日記情報配列|ture|一覧表示するための日記情報の配列

日記情報：
 フィールド名 | 型 | 必須 | 説明
 -- | -- | -- | --
diaryId | string | true | 日記ID
title | string | true | 日記タイトル
writerId | string | true | 日記作者ID
writerName | string | true | 日記作者名前
description | string | true | 日記の説明
thubnailInfo | サムネイル情報配列 | true | サムネイル情報

サムネイル情報：
フィールド名 | 型 | 必須 | 説明
-- | -- | -- | --
thumbnailId | string | true | サムネイルのID
thumbnailBody | string | true | サムネイル画像をbase64でエンコードした文字列
