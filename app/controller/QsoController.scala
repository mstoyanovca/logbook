package controller

import authentication.AuthenticationAction
import dao.QsoDao
import javax.inject.Inject
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

class QsoController @Inject()(cc: ControllerComponents,
                              authAction: AuthenticationAction,
                              qsoDao: QsoDao) extends AbstractController(cc) {

  def qso: Action[AnyContent] = authAction { implicit authenticationRequest =>
    val request = authenticationRequest.request
    val claim = authenticationRequest.claim
    Ok(Json.toJson(qsoDao.findAll()))
      .as("application/json")
      .withHeaders("Connection" -> "keep-alive")
  }
}
