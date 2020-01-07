-- User schema
-- !Ups
create table user (
  id bigint(20) not null auto_increment,
  email varchar(255) not null unique,
  password varchar(255) not null,
  primary key (id)
);

insert into user values (1, "mstoyanovca@gmail.com", "password");

-- !Downs
drop table user;
