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
              u.token = Some(authService.loginJwt(u))
              Ok(Json.toJson(u)).as("application/json")
            case None => Unauthorized
          }
        } yield u
      })
  }

  def forgotPassword: Action[JsValue] = Action.async(parse.json) { implicit request =>
    val forgotPasswordEmail: String = (request.body \ "forgotPasswordEmail").as[String]

    for {
      maybeUser <- userDao.findByEmail(forgotPasswordEmail)
      u = maybeUser match {
        case Some(u) =>
          val passwordResetToken = authService.passwordResetJwt(u)
          // TODO:
          // publish to AWS
          // obtain an email account from AWS
          // implement an email service to send an email with a password reset link
          // implement a guarded by the AuthenticationAction route to validate the token, and open a new password form
          Ok("Success").as("text/plain")
        case None => BadRequest("Error").as("text/plain")
      }
    } yield u
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
