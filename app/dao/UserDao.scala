package dao

import javax.inject.Inject
import model.User

@javax.inject.Singleton
class UserDao @Inject()() {
  def findUser(u: User): Boolean = {
    if (u.email == "mstoyanovca@gmail.com" && u.password == "password") true else false
  }
}
