package controller

import auth.UserAction
import dao.UserDao
import javax.inject.Inject
import model.User
import play.api.mvc._
import play.filters.csrf.CSRF.Token
import play.filters.csrf.{CSRF, CSRFAddToken, CSRFCheck}

class LoginController @Inject()(cc: ControllerComponents, userDao: UserDao, userAction: UserAction, addToken: CSRFAddToken,
                                checkToken: CSRFCheck) extends AbstractController(cc) {

  def login: Action[AnyContent] = addToken(Action { implicit request =>
    val user: User = request.body.asJson.get.as[User]
    if (userDao.findUser(user)) {
      val Token(name, value) = CSRF.getToken.get
      Ok(s"$name=$value")
      // Redirect(routes.HomeController.index())
      // .withSession("email" -> user.email)
      // .withCookies(Cookie("XSRF-TOKEN", createCSFRToken(user.email), httpOnly = false))
    } else {
      Redirect(routes.HomeController.index())
    }
  })

  def logout: Action[AnyContent] = userAction { implicit request: Request[AnyContent] =>
    Redirect(routes.HomeController.index()).withNewSession
  }

  private def createCSFRToken(str: String): String = {
    "token"
  }
}
