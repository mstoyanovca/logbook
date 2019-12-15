package authentication

import javax.inject.Inject
import pdi.jwt._
import play.api.http.HeaderNames
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

case class UserRequest[A](jwt: JwtClaim, token: String, request: Request[A]) extends WrappedRequest[A](request)

class AuthenticationAction @Inject()(bodyParser: BodyParsers.Default,
                                     authenticationService: AuthenticationService)
                                    (implicit ec: ExecutionContext) extends ActionBuilder[UserRequest, AnyContent] {
  private val headerTokenRegex = """Bearer (.+?)""".r

  override def parser: BodyParser[AnyContent] = bodyParser

  override protected def executionContext: ExecutionContext = ec

  override def invokeBlock[A](request: Request[A], block: UserRequest[A] => Future[Result]): Future[Result] = extractBearerToken(request) map { token =>
    authenticationService.validateJwt(token) match {
      case Success(claim) => block(UserRequest(claim, token, request))
      case Failure(t) => Future.successful(Results.Unauthorized(t.getMessage))
    }
  } getOrElse Future.successful(Results.Unauthorized)

  private def extractBearerToken[A](request: Request[A]): Option[String] = request.headers.get(HeaderNames.AUTHORIZATION) collect {
    case headerTokenRegex(token) => token
  }
}
