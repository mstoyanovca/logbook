package dao

import javax.inject.Inject

import scala.concurrent.Future

class UserService @Inject()(userDao: UserDao) {
  def findById(id: Long): Future[Option[User]] = {
    userDao.findById(id)
  }

  def findByEmailAndPassword(user: User): Future[Option[User]] = {
    userDao.findByEmailAndPassword(user)
  }

  def findAll: Future[Seq[User]] = {
    userDao.findAll
  }

  def add(user: User): Future[String] = {
    userDao.add(user)
  }

  def delete(id: Long): Future[Int] = {
    userDao.delete(id)
  }
}
