DROP DATABASE IF EXISTS BlockoryDB;
CREATE DATABASE BlockoryDB;
 -- ユーザ管理テーブル
 CREATE TABLE IF NOT EXISTS `BlockoryDB`.`users`(
     `user_id` CHAR(48) NOT NULL COMMENT 'ユーザID',
     `user_name` CHAR(16) NOT NULL COMMENT 'ユーザ名',
     `user_password` CHAR(16) NOT NULL COMMENT 'パスワード',
     PRIMARY KEY (`user_id`));

 CREATE TABLE IF NOT EXISTS `BlockoryDB`.`diaries`(
     `diary_id` CHAR(48) COMMENT '日記ID',
     `title` CHAR(16) ,
     `user_id` CHAR(48),
     `description` TEXT,
     `diary_text` TEXT,	
     `diary_movie` LONGBLOB,
     `thumbnail_body` LONGBLOB,
     `target_date` DATE,
     `update_date` DATETIME,
     PRIMARY KEY (`diary_id`));
