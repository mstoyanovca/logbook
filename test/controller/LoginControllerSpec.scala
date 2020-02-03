package controller

import akka.stream.Materializer
import authentication.{AuthenticationAction, AuthenticationService}
import dao.{User, UserDao}
import org.mockito.Mockito._
import org.scalatestplus.mockito.MockitoSugar
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneServerPerSuite
import play.api.libs.json.Json
import play.api.libs.ws.WSClient
import play.api.mvc._
import play.api.test.FakeRequest
import play.api.test.Helpers._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future


class LoginControllerSpec extends PlaySpec with MockitoSugar with Results with GuiceOneServerPerSuite {
  implicit lazy val materializer: Materializer = app.materializer
  implicit lazy val Action: DefaultActionBuilder = app.injector.instanceOf(classOf[DefaultActionBuilder])

  val mockUserDao: UserDao = mock[UserDao]
  // when(mockUserDao.findByEmailAndPassword(User(None, "a@a.com", Some("password")))).thenReturn(Future(Option(User(Some(1L), "a@a.com", Some("password")))))
  when(mockUserDao.findByEmail("a@a.com")).thenReturn(Future(Option(User(Some(1L), "a@a.com", Some("password")))))

  val mockAuthenticationService: AuthenticationService = mock[AuthenticationService]
  when(mockAuthenticationService.loginJwt(User(Some(1L), "a@a.com", None))).thenReturn("jwt_token")

  val mockAuthenticationAction: AuthenticationAction = mock[AuthenticationAction]

  "LoginController index" should {
    "return ok" in {
      val controller = new LoginController(stubControllerComponents(), mockUserDao, mockAuthenticationService, mockAuthenticationAction)
      val result: Future[Result] = controller.index().apply(FakeRequest())
      val bodyText: String = contentAsString(result)
      bodyText mustBe "ok"
    }
  }

  "EssentialAction test" should {
    "return an email" in {
      val action: EssentialAction = Action { request =>
        val value = (request.body.asJson.get \ "email").as[String]
        Ok(value)
      }

      val request = FakeRequest(POST, "/forgotPassword").withJsonBody(Json.parse("""{ "email": "a@a.com" }"""))
      val result = call(action, request)

      status(result) mustEqual OK
      contentAsString(result) mustEqual "a@a.com"
    }
  }

  "LoginController on forgotPassword" should {
    "return a user with a token" in {
      val wsClient = app.injector.instanceOf[WSClient]
      val url = "http://localhost:9000"
      val response = await(wsClient.url(url).addQueryStringParameters("forgotPasswordEmail" -> "a@a.com").get())
      response.status mustBe OK
    }
  }
}
