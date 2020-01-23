package controller

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

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
    val userId: Long = authenticationRequest.claim.subject.get.toLong
    qsoDao.findAllByUserId(userId).map(qsos => Ok(Json.toJson(qsos)).as("application/json"))
  }

  def findByDateTimeAndCallsign(dateTime: String, callsign: String): Action[AnyContent] = authAction.async { implicit authenticationRequest =>
    val userId: Long = authenticationRequest.claim.subject.get.toLong
    qsoDao.findByDateTimeAndCallsign(
      userId,
      LocalDateTime.parse(dateTime, DateTimeFormatter.ofPattern("MM/dd/yyyy, HH:mm:ss")),
      callsign)
      .map(qsos => Ok(Json.toJson(qsos)).as("application/json"))
  }

  def add: Action[JsValue] = authAction.async(parse.json) { implicit authenticationRequest =>
    authenticationRequest.body.validate[Qso].fold(
      errors => {
        Future.successful(BadRequest(Json.obj("message" -> JsError.toJson(errors))))
      },
      qso => {
        qso.userId = Some(authenticationRequest.claim.subject.get.toLong)
        qsoDao.add(qso).map(qso => Ok(Json.toJson(qso)).as("application/json"))
      })
  }

  def delete(id: String): Action[AnyContent] = authAction.async { implicit authenticationRequest =>
    qsoDao.delete(id.toLong).map(i => Ok(i.toString).as("application/json"))
  }
}
