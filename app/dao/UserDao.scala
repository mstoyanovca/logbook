package dao

import javax.inject.Inject
import model.User

@javax.inject.Singleton
class UserDao @Inject()() {
  def findUser(user: User): Boolean = {
    if (user.email == "mstoyanovca@gmail.com" && user.password.contains("password")) true else false
  }
}
