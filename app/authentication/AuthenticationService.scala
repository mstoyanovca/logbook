package authentication

import java.time.Clock
import java.util.UUID

import dao.User
import javax.inject.Inject
import pdi.jwt.JwtAlgorithm.HS256
import pdi.jwt._
import pdi.jwt.exceptions.JwtLengthException
import play.api.Configuration

import scala.util.Try

class AuthenticationService @Inject()(config: Configuration) {
  private final val issuer = config.get[String]("jwt.issuer")
  private final val audience = config.get[String]("jwt.audience")
  private final val expiration = config.get[String]("jwt.expiration").toLong
  private final val secretKey = config.get[String]("jwt.secretKey")
  private final val algorithm = HS256

  private implicit val clock: Clock = Clock.systemUTC

  def createJwt(user: User): String = {
    Jwt.encode(
      JwtHeader(JwtAlgorithm.HS256).toJson,
      JwtClaim()
        .by(issuer)
        .about(user.id.get.toString)
        .to(audience)
        .expiresIn(expiration)
        .startsNow
        .issuedNow
        .withId(UUID.randomUUID().toString)
        .toJson,
      secretKey,
      algorithm)
  }

  def validateJwt(token: String): Try[JwtClaim] = for {
    claim <- Try(JwtJson.parseClaim(splitToken(token)._2)) if claim.isValid(issuer)
  } yield claim

  private def splitToken(token: String): (String, String, String) = {
    val parts = token.split("\\.")

    val signature = parts.length match {
      case 2 => ""
      case 3 => parts(2)
      case _ => throw new JwtLengthException(s"Expected token [$token] to be composed of 2 or 3 parts separated by dots")
    }

    (JwtBase64.decodeString(parts(0)), JwtBase64.decodeString(parts(1)), signature)
  }
}
