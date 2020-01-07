package controller

import authentication.AuthenticationService
import dao.{User, UserDao}
import javax.inject.Inject
import play.api.libs.json.{JsError, JsValue, Json}
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class LoginController @Inject()(cc: ControllerComponents,
                                userDao: UserDao,
                                authService: AuthenticationService) extends AbstractController(cc) {

  def login: Action[JsValue] = Action.async(parse.json) { implicit request =>
    request.body.validate[User].fold(
      errors => {
        Future.successful(BadRequest(Json.obj("message" -> JsError.toJson(errors))))
      },
      user => {
        for {
          maybeUser <- userDao.findByEmailAndPassword(user)
          u = maybeUser match {
            case Some(u) =>
              u.id = None
              u.password = None
              u.token = Some(authService.createJwt(user))
              Ok(Json.toJson(u))
                .as("application/json")
                .withHeaders("Connection" -> "keep-alive")
            case None => Unauthorized
          }
        } yield u
      })
  }
}
