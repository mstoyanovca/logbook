-- User schema
-- !Ups
create table user (
  id bigint not null auto_increment,
  email varchar(255) not null unique,
  password varchar(255) not null,
  primary key (id)
);

insert into user values (1, "mstoyanovca@gmail.com", "password");

create table qso(
id bigint not null auto_increment,
user_id bigint not null,
date date not null,
time time not null,
callsign varchar(16) not null,
frequency varchar(16) not null,
mode varchar(16) not null,
rst_sent varchar(16) not null,
rst_received varchar(16),
power int,
name varchar(32),
qth varchar(32),
notes varchar(255),
primary key (id),
foreign key (user_id) references user(id)
);

insert into qso values(1, 1, '2019-12-15', '22:00:00', "LZ2AB", "144.000", "FM", "59+", "58", 100, "Jivko", "Balchik", "HT");
insert into qso values(2, 1, '2019-12-16', '22:00:00', "LZ1CD", "14.085", "CW", "588", "46", 20, "Ivan", "Karlovo", "Vetical");
insert into qso values(3, 1, '2018-12-1', '21:40:00', "LZ2EF", "3.564", "SSB", "466", "59", 50, "Miro", "Sofia", "Ground Plane");
insert into qso values(4, 1, '2016-12-15', '2:45:00', "LZ4MN", "28.800", "FT8", "598", "59", 200, "Kiro", "Turnovo", "JPole");
insert into qso values(5, 1, '2016-12-15', '2:58:00', "LZ4MN", "28.815", "FT8", "598", "59", 200, "Kiro", "Turnovo", "JPole");

-- !Downs
drop table user;
drop table qso;
