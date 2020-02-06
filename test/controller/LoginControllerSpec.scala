package controller

import authentication.AuthenticationService
import dao.User
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneServerPerTest
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.Json
import play.api.libs.ws.WSClient
import play.api.mvc._
import play.api.test.Helpers._

class LoginControllerSpec extends PlaySpec with Results with GuiceOneServerPerTest {

  override def fakeApplication(): Application = {
    GuiceApplicationBuilder()
      .configure("play.filters.disabled.0" -> "play.filters.hosts.AllowedHostsFilter",
        "play.filters.disabled.1" -> "play.filters.csrf.CSRFFilter")
      .build()
  }

  "LoginController on login" should {
    "return a user with a token" in {
      val wsClient = app.injector.instanceOf[WSClient]
      val url = s"http://localhost:$port/login"

      val response = await(wsClient.url(url).post(Json.parse("""{ "email": "a@a.com", "password": "password" }""")))

      val user: User = Json.parse(response.body).validate[User].fold(
        errors => {
          null
        },
        user => {
          user
        })

      response.status mustBe OK
      response.contentType mustBe "application/json"

      user.password must be(None)
      user.token.get.length must be > 0
    }
  }

  "LoginController on forgotPassword" should {
    "return a user with a token" in {
      val wsClient = app.injector.instanceOf[WSClient]
      val url = s"http://localhost:$port/forgotPassword"

      val response = await(wsClient.url(url).post(Json.parse("""{ "forgotPasswordEmail": "a@a.com" }""")))

      val user: User = Json.parse(response.body).validate[User].fold(
        errors => {
          null
        },
        user => {
          user
        })

      response.status mustBe OK
      response.contentType mustBe "application/json"

      user.password must be(None)
      user.token.get.length must be > 0
    }
  }

  "LoginController on changePassword" should {
    "return a user with a token" in {
      val service = app.injector.instanceOf[AuthenticationService]
      val jwtToken = service.passwordResetJwt(User(Some(1L), "a@a.com", Some("password")))

      val wsClient = app.injector.instanceOf[WSClient]
      val url = s"http://localhost:$port/changePassword"

      val response = await(
        wsClient
          .url(url)
          .withHttpHeaders("Authorization" -> ("Bearer " + jwtToken))
          .post(Json.parse("""{ "newPassword": "password" }"""))
      )

      response.status mustBe OK
      response.contentType mustBe "text/plain"
    }
  }
}
