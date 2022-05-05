## users
列名|データ型|列制約
--|--|--
user_id | CHAR(16) | PRIMARY KEY
user_name | CHAR(16) | NOT NULL

## diaries
列名|データ型|列制約
--|--|--
diary_id|CHAR(16)| PRIMARY KEY
title|CHAR(16)|
writer_id|CHAR(16)| NOT NULL
description | CHAR(256) | 
thumbnail_body | VARCHAR |
target_date | DATE |
update_date | DATE |
