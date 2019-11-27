package controllers

import javax.inject.{Inject, Singleton}
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

@Singleton
class LoginController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  def login: Action[AnyContent] = Action { implicit request =>
    Ok("Hello, Scala!")
  }
}
