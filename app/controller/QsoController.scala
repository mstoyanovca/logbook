package controller

import authentication.AuthenticationAction
import dao.{Qso, QsoDao}
import javax.inject.Inject
import play.api.libs.json.{JsError, JsValue, Json}
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class QsoController @Inject()(cc: ControllerComponents,
                              authAction: AuthenticationAction,
                              qsoDao: QsoDao) extends AbstractController(cc) {

  def findAll: Action[AnyContent] = authAction.async { implicit authenticationRequest =>
    qsoDao.findAll.map {
      qsos =>
        Ok(Json.toJson(qsos))
          .as("application/json")
          .withHeaders("Connection" -> "keep-alive")
    }
  }

  def add: Action[JsValue] = authAction.async(parse.json) { implicit authenticationRequest =>
    authenticationRequest.body.validate[Qso].fold(
      errors => {
        Future.successful(BadRequest(Json.obj("message" -> JsError.toJson(errors))))
      },
      qso => {
        qsoDao.add(qso).map(s => Ok(s).as("application/json").withHeaders("Connection" -> "keep-alive"))
      })
  }
}
