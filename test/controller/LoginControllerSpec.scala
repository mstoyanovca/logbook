package controller

import org.scalatestplus.mockito.MockitoSugar
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneServerPerTest
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.Json
import play.api.libs.ws.WSClient
import play.api.mvc._
import play.api.test.Helpers._

class LoginControllerSpec extends PlaySpec with MockitoSugar with Results with GuiceOneServerPerTest {
  /* implicit lazy val materializer: Materializer = app.materializer
   implicit lazy val Action: DefaultActionBuilder = app.injector.instanceOf(classOf[DefaultActionBuilder])

   val mockUserDao: UserDao = mock[UserDao]
   when(mockUserDao.findByEmailAndPassword(User(None, "a@a.com", Some("password")))).thenReturn(Future(Option(User(Some(1L), "a@a.com", Some("password")))))
   when(mockUserDao.findByEmail("a@a.com")).thenReturn(Future(Option(User(Some(1L), "a@a.com", Some("password")))))

   val mockAuthenticationService: AuthenticationService = mock[AuthenticationService]
   when(mockAuthenticationService.loginJwt(User(Some(1L), "a@a.com", None))).thenReturn("jwt_token")

   val mockAuthenticationAction: AuthenticationAction = mock[AuthenticationAction]*/

  override def fakeApplication(): Application = {
    GuiceApplicationBuilder().configure(Map("play.filters.disabled.0" -> "play.filters.hosts.AllowedHostsFilter")).build()
  }

  "LoginController on forgotPassword" should {
    "return a user with a token" in {
      val wsClient = app.injector.instanceOf[WSClient]
      val url = s"http://localhost:$port/forgotPassword"
      val response = await(wsClient.url(url).post(Json.parse("""{ "forgotPasswordEmail": "a@a.com" }""")))
      response.status mustBe OK
    }
  }
}
