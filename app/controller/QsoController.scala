package controller

import authentication.AuthenticationAction
import dao.QsoDao
import javax.inject.Inject
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import scala.concurrent.ExecutionContext.Implicits.global

class QsoController @Inject()(cc: ControllerComponents,
                              authAction: AuthenticationAction,
                              qsoDao: QsoDao) extends AbstractController(cc) {

  def qso: Action[AnyContent] = authAction.async { implicit authenticationRequest =>
    qsoDao.findAll.map {
      qsos =>
        Ok(Json.toJson(qsos))
          .as("application/json")
          .withHeaders("Connection" -> "keep-alive")
    }
  }
}
