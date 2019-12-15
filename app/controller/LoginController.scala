package controller

import authentication.{AuthenticationAction, AuthenticationService}
import dao.UserDao
import javax.inject.Inject
import model.User
import play.api.libs.json.Json
import play.api.mvc._

class LoginController @Inject()(cc: ControllerComponents,
                                userDao: UserDao,
                                authAction: AuthenticationAction,
                                authService: AuthenticationService) extends AbstractController(cc) {

  def login: Action[AnyContent] = Action { implicit request =>
    val user = request.body.asJson.get.as[User]
    if (userDao.findUser(user)) {
      user.password = None
      user.token = Some(authService.createJwt(user))
      Ok(Json.toJson(user))
        .as("application/json")
        .withHeaders("Connection" -> "keep-alive")
    } else {
      Unauthorized
    }
  }

  def qsos: Action[AnyContent] = authAction { implicit request =>
    Ok("")
  }
}
