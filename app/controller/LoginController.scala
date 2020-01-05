package controller

import authentication.{AuthenticationAction, AuthenticationService}
import dao.{User, UserService}
import javax.inject.Inject
import play.api.libs.json.{JsError, JsValue, Json}
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class LoginController @Inject()(cc: ControllerComponents,
                                userService: UserService,
                                authAction: AuthenticationAction,
                                authService: AuthenticationService) extends AbstractController(cc) {

  def login: Action[JsValue] = Action.async(parse.json) { implicit request =>
    request.body.validate[User].fold(
      errors => {
        Future.successful(BadRequest(Json.obj("message" -> JsError.toJson(errors))))
      },
      user => {
        for {
          u <- userService.findByEmailAndPassword(user)
          uu: Result = u match {
            case Some(u) =>
              u.password = None
              u.token = Some(authService.createJwt(user))
              Ok(Json.toJson(u))
                .as("application/json")
                .withHeaders("Connection" -> "keep-alive")
            case None => Unauthorized
          }
        } yield uu
      })
  }
}
