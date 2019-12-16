package controller

import authentication.AuthenticationAction
import javax.inject.Inject
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

class QsoController @Inject()(cc: ControllerComponents,
                              authAction: AuthenticationAction) extends AbstractController(cc) {

  def qso: Action[AnyContent] = authAction { implicit authenticationRequest =>
    val request = authenticationRequest.request
    val claim = authenticationRequest.claim
    Ok(Seq.empty)
      .as("application/json")
      .withHeaders("Connection" -> "keep-alive")
  }
}
