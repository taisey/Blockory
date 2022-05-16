## users
列名|データ型|列制約
--|--|--
user_id | CHAR(48) | PRIMARY KEY
user_name | CHAR(16) | NOT NULL

## diaries
列名|データ型|列制約
--|--|--
diary_id|CHAR(48)| PRIMARY KEY
title|CHAR(16)|
writer_id|CHAR(48)| NOT NULL
description | TEXT | 
diary_body | TEXT |
thumbnail_body | BLOB |
target_date | DATE |
update_date | DATETIME |

## 懸念点
- CHAR型の長さをどれくらいにするべきか
- criate_dateやupdate_dateを全てのテーブルに入れるのが一般的らしいが、入れるべきか
- TEXTは人が読める文字列、VERCHARは読めない文字列という使い分けで正しい？
