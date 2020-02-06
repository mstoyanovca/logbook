package controller

import authentication.AuthenticationService
import dao.{Qso, QsoDao, User}
import org.mockito.Mockito._
import org.scalatestplus.mockito.MockitoSugar
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneServerPerTest
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.{Json, Reads}
import play.api.libs.ws.WSClient
import play.api.mvc.Results
import play.api.test.Helpers.{await, _}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class QsoControllerSpec extends PlaySpec with Results with GuiceOneServerPerTest with MockitoSugar {
  implicit val qsosReads: Reads[List[Qso]] = Reads.list(Json.format[Qso])

  private val mockQsoDao: QsoDao = mock[QsoDao]
  when(mockQsoDao.findAllByUserId(1L)).thenReturn(Future(List.empty[Qso]))

  override def fakeApplication(): Application = {
    GuiceApplicationBuilder()
      .configure("play.filters.disabled.0" -> "play.filters.hosts.AllowedHostsFilter",
        "play.filters.disabled.1" -> "play.filters.csrf.CSRFFilter")
      .build()
  }

  "QsoController on findAll" should {
    "return all QSOs" in {
      val service = app.injector.instanceOf[AuthenticationService]
      val jwtToken = service.passwordResetJwt(User(Some(1L), "a@a.com", Some("password")))

      val wsClient = app.injector.instanceOf[WSClient]
      val url = s"http://localhost:$port/qso"

      val response = await(wsClient.url(url).withHttpHeaders("Authorization" -> ("Bearer " + jwtToken)).get())

      val qsos: List[Qso] = Json.parse(response.body).validate[List[Qso]](qsosReads).fold(
        errors => {
          List.empty[Qso]
        },
        qsos => {
          qsos
        })

      response.status mustBe OK
      response.contentType mustBe "application/json"

      qsos.length mustBe 4
    }
  }

  "QsoController on findByDateTimeAndCallsign" should {
    "return a list of QSOs" in {
      val service = app.injector.instanceOf[AuthenticationService]
      val jwtToken = service.passwordResetJwt(User(Some(1L), "a@a.com", Some("password")))

      val wsClient = app.injector.instanceOf[WSClient]
      val url = s"http://localhost:$port/qso/requestQsl?dateTime=2020-02-05T20:30:04&callsign=VA3AUI"

      val response = await(wsClient.url(url).withHttpHeaders("Authorization" -> ("Bearer " + jwtToken)).get())

      val qsos = Json.parse(response.body).validate[List[Qso]].fold(
        errors => {
          List.empty[Qso]
        },
        qsos => {
          qsos
        })

      response.status mustBe OK
      response.contentType mustBe "application/json"

      qsos must be(List.empty)
    }
  }

  "QsoController on add" should {
    "return a QSO with id" in {
      val service = app.injector.instanceOf[AuthenticationService]
      val jwtToken = service.passwordResetJwt(User(Some(1L), "a@a.com", Some("password")))

      val wsClient = app.injector.instanceOf[WSClient]
      val url = s"http://localhost:$port/qso"

      val response = await(
        wsClient
          .url(url)
          .withHttpHeaders("Authorization" -> ("Bearer " + jwtToken))
          .post(Json.parse(s"""{ "dateTime": "2020-02-05T20:30:04.631", "callsign": "VA3AUI", "frequency": "14.125", "mode": "SSB", "rstSent": "56" }"""))
      )

      val qso = Json.parse(response.body).validate[Qso].fold(
        errors => {
          null
        },
        qso => {
          qso
        })

      response.status mustBe OK
      response.contentType mustBe "application/json"

      qso.callsign must be("VA3AUI")
      qso.frequency must be("14.125")
      qso.mode must be("SSB")
      qso.rstSent must be("56")
    }
  }

  "QsoController on delete" should {
    "return an id" in {
      val service = app.injector.instanceOf[AuthenticationService]
      val jwtToken = service.passwordResetJwt(User(Some(1L), "a@a.com", Some("password")))

      val wsClient = app.injector.instanceOf[WSClient]
      val url = s"http://localhost:$port/qso/1"

      val response = await(
        wsClient
          .url(url)
          .withHttpHeaders("Authorization" -> ("Bearer " + jwtToken))
          .delete()
      )

      response.status mustBe OK
      response.contentType mustBe "application/json"
    }
  }
}
