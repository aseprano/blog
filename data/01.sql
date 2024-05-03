CREATE DATABASE IF NOT EXISTS blog;
USE blog;

CREATE TABLE IF NOT EXISTS categories (
    id          BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    label       VARCHAR(255) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS posts (
    id          BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    version     INT NOT NULL,
    title       VARCHAR(255),
    content     TEXT NOT NULL,
    picture_url VARCHAR(255) NOT NULL,
    id_category BIGINT NOT NULL,
    FOREIGN KEY (id_category) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS post_tags
(
    id_post     BIGINT       NOT NULL,
    tag         VARCHAR(255) NOT NULL,
    UNIQUE KEY id_post_tag (id_post, tag),
    FOREIGN KEY (id_post) REFERENCES posts (id) ON DELETE CASCADE,
    INDEX (tag)
) ENGINE = InnoDB;

INSERT IGNORE INTO categories (id, label) VALUES (1, 'Science'), (2, 'Technology'), (3, 'Religion');
