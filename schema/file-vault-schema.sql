drop database if exists filevault;

create database if not exists filevault;

use filevault;

CREATE TABLE user (
    user_id VARCHAR(250) PRIMARY KEY,
    user_email VARCHAR(250) UNIQUE KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS file_record (
    file_record_id VARCHAR(250) PRIMARY KEY,
    file_storage_name VARCHAR(250) UNIQUE NOT NULL,
    file_name VARCHAR(250) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(250) NOT NULL,
    file_path VARCHAR(250) NOT NULL,
    user_id VARCHAR(250) NOT NULL,
    CONSTRAINT file_record_fk_user_id FOREIGN KEY (user_id)
        REFERENCES user (user_id)
);

