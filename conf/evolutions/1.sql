-- User schema
-- Up
create table `user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` TEXT NOT NULL,
  `password` TEXT NOT NULL
)

-- Down
drop table `user`
