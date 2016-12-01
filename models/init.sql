CREATE TABLE Users (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  email VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  third_party_id VARCHAR(255) NOT NULL,
  third_party_token VARCHAR(255) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  platform VARCHAR(20) NOT NULL,
  serial_num VARCHAR(255) NOT NULL,
  auth_token VARCHAR(255) NOT NULL,
  push_token VARCHAR(255),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE Subscriptions (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  user_id MEDIUMINT NOT NULL,
  topic VARCHAR(255) NOT NULL,
  keyword VARCHAR(255),
  schedule TINYINT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE Topics (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE News (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  topic_id MEDIUMINT NOT NULL,
  url VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

insert into topics(name) values ('3C');
insert into topics(name) values ('美妝');
insert into topics(name) values ('教育');
insert into topics(name) values ('金融');

insert into subscriptions (user_id, topic, keyword, schedule) values (1, '2', '眼影', 14);
insert into subscriptions (user_id, topic, keyword, schedule) values (1, '2', '無阻', 14);
insert into subscriptions (user_id, topic, keyword, schedule) values (1, '2', '', 14);

insert into news(topic_id, url, title) values (2, 'http://www.books.com.tw/products/N000714993?loc=P_006_035', '1028 抗暈無阻 暹羅貓眼線液（兩色任選）01 濃烈爆黑');
insert into news(topic_id, url, title) values (2, 'http://www.books.com.tw/products/N011002571?loc=P_006_047', '【a;t fox】狐狸的午後時光- 眼線筆-迷戀紫');
insert into news(topic_id, url, title) values (2, 'http://www.books.com.tw/products/N000436903?loc=P_006_007', 'Solone 2mm極細眼線膠筆(共4色)01濃密黑');
insert into news(topic_id, url, title) values (2, 'http://www.books.com.tw/products/N000432131?loc=P_006_079', 'Solone 愛麗絲的奇幻冒險-完美勾勒眼線膠筆(共4色)01黑色髮帶');
