package authentication

import javax.inject.Inject
import pdi.jwt._
import play.api.http.HeaderNames
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

case class AuthenticationRequest[A](request: Request[A], claim: JwtClaim) extends WrappedRequest[A](request)

class AuthenticationAction @Inject()(bodyParser: BodyParsers.Default,
                                     authenticationService: AuthenticationService)
                                    (implicit ec: ExecutionContext) extends ActionBuilder[AuthenticationRequest, AnyContent] {
  private final val headerTokenRegex = """Bearer (.+?)""".r

  override def parser: BodyParser[AnyContent] = bodyParser

  override protected def executionContext: ExecutionContext = ec

  override def invokeBlock[A](request: Request[A], block: AuthenticationRequest[A] => Future[Result]): Future[Result] = extractBearerToken(request) map { token =>
    authenticationService.validateJwt(token) match {
      case Success(claim) => block(AuthenticationRequest(request, claim))
      case Failure(t) => Future.successful(Results.Unauthorized(t.getMessage))
    }
  } getOrElse Future.successful(Results.Unauthorized)

  private def extractBearerToken[A](request: Request[A]): Option[String] = request.headers.get(HeaderNames.AUTHORIZATION) collect {
    case headerTokenRegex(token) => token
  }
}
