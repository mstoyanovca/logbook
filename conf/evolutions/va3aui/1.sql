-- User schema
-- !Ups
create table user (
  id bigint not null auto_increment,
  email varchar(255) not null unique,
  password varchar(255) not null,
  primary key (id)
);

create table qso(
id bigint not null auto_increment,
user_id bigint not null,
date_time datetime not null,
callsign varchar(16) not null,
frequency varchar(16) not null,
mode varchar(16) not null,
rst_sent varchar(16) not null,
rst_received varchar(16),
power varchar(16),
name varchar(32),
qth varchar(32),
notes varchar(255),
primary key (id),
foreign key (user_id) references user(id)
);

insert into user values (0, "mstoyanovca@gmail.com", "password");

insert into qso values(0, (select id from user where email="mstoyanovca@gmail.com"), "2019-12-15 22:00:00", "LZ2AB", "144.000MHz", "FM", "59+", "58", "100W", "Jivko", "Balchik", "HT");
insert into qso values(0, (select id from user where email="mstoyanovca@gmail.com"), "2019-12-16 22:00:00", "LZ1CD", "14.085MHz", "CW", "588", "46", "20W", "Ivan", "Karlovo", "Vetical");
insert into qso values(0, (select id from user where email="mstoyanovca@gmail.com"), "2018-12-1 21:40:00", "LZ2EF", "3.564MHz", "SSB", "46", "59", "50W", "Miro", "Sofia", "Ground Plane");
insert into qso values(0, (select id from user where email="mstoyanovca@gmail.com"), "2016-12-15 2:45:00", "LZ4MN", "28.800MHz", "FT8", "59", "59", "200W", "Kiro", "Turnovo", "JPole");
insert into qso values(0, (select id from user where email="mstoyanovca@gmail.com"), "2016-12-15 2:58:00", "LZ4MN", "28.815MHz", "FT8", "59", "59", "200W", "Kiro", "Turnovo", "JPole");

-- !Downs
drop table user;
drop table qso;
