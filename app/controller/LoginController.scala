package controller

import dao.UserDao
import javax.inject.Inject
import model.User
import play.api.libs.json.Json
import play.api.mvc._

class LoginController @Inject()(cc: ControllerComponents, userDao: UserDao) extends AbstractController(cc) {

  def login: Action[AnyContent] = Action { implicit request =>
    val user = request.body.asJson.get.as[User]
    if (userDao.findUser(user)) {
      user.token = Some("token")
      Ok(Json.toJson(user))
    } else {
      Redirect(routes.HomeController.index())
    }
  }

  def logout: Action[AnyContent] = Action { implicit request: Request[AnyContent] =>
    Redirect(routes.HomeController.index()).withNewSession
  }
}
