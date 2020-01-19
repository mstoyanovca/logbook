package controller

import authentication.{AuthenticationAction, AuthenticationService}
import dao.{User, UserDao}
import javax.inject.Inject
import play.api.libs.json.{JsError, JsValue, Json}
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class LoginController @Inject()(cc: ControllerComponents,
                                userDao: UserDao,
                                authService: AuthenticationService,
                                authAction: AuthenticationAction) extends AbstractController(cc) {

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
              u.password = None
              u.token = Some(authService.createJwt(u))
              Ok(Json.toJson(u)).as("application/json")
            case None => Unauthorized
          }
        } yield u
      })
  }

  def changePassword: Action[JsValue] = authAction.async(parse.json) { implicit request =>
    val newPassword = (request.body \ "newPassword").as[String]
    val userId = request.claim.subject.getOrElse("0").toLong

    for {
      i: Int <- userDao.changePassword(userId, newPassword)
      r: Result = i match {
        case 1 => Ok("Success").as("text/plain")
        case _ => BadRequest("Error").as("text/plain")
      }
    } yield r
  }
}
