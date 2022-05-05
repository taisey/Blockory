## UserInfo
列名|データ型|列制約
--|--|--
userId | CHAR(16) | PRIMARY KEY
userName | CHAR(16) | NOT NULL

## DiaryInfo
列名|データ型|列制約
--|--|--
diaryId|CHAR(16)| PRIMARY KEY
title|CHAR(16)|
writerId|CHAR(16)| NOT NULL
description | CHAR(256) | 
thumbnailBody | VARCHAR |
targetDate | DATE |
updateDate | DATE |
