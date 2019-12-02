package auth

import javax.inject.Inject
import play.api.mvc.Results._
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

class UserAction @Inject()(parser: BodyParsers.Default)(implicit ec: ExecutionContext) extends ActionBuilderImpl(parser) {
  override def invokeBlock[A](request: Request[A], block: Request[A] => Future[Result]): Future[Result] = {
    request.session.get("email") match {
      case None =>
        Future.successful(Forbidden("Not logged in"))
      case Some(u) =>
        block(request)
    }
  }
}
