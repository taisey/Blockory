 -- ユーザ管理テーブル
 CREATE TABLE IF NOT EXISTS `BlockoryDB`.`users`(
     `user_id` CHAR(16) NOT NULL COMMENT 'ユーザID',
     `user_name` CHAR(16) NOT NULL COMMENT 'ユーザ名',
     PRIMARY KEY (`user_id`));

 CREATE TABLE IF NOT EXISTS `BlockoryDB`.`diaries`(
     `diary_id` CHAR(16) COMMENT '日記ID',
     `title` CHAR(16) ,
     `writer_id` CHAR(16) NOT NULL,
     `description` TEXT,
     `thumbnail_body` BLOB,
     `target_date` DATE,
     `update_date` DATETIME,
     PRIMARY KEY (`diary_id`));
