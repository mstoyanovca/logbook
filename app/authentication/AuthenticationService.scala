package authentication

import java.time.{Clock, LocalDateTime, ZoneOffset}
import java.util.UUID

import javax.inject.Inject
import model.User
import pdi.jwt.JwtAlgorithm.HS256
import pdi.jwt._
import play.api.Configuration

import scala.util.Try

class AuthenticationService @Inject()(config: Configuration) {
  private final val issuer = config.get[String]("jwt.issuer")
  private final val audience = config.get[Seq[String]]("jwt.audience").toSet
  private final val secretKey = config.get[String]("jwt.secretKey")
  private final val algorithm = HS256
  private final val tokenType = "JWT"

  private implicit val clock: Clock = Clock.systemUTC

  def createJwt(user: User): String = {
    val now: LocalDateTime = LocalDateTime.now()
    Jwt.encode(
      new JwtHeader(
        Some(algorithm),
        Some(tokenType),
        None,
        None
      ).toString,
      new JwtClaim(
        "email:" + user.email,
        Some(issuer),
        Some(user.email),
        Some(audience),
        Some(now.plusDays(7).toEpochSecond(ZoneOffset.UTC)),
        Some(now.toEpochSecond(ZoneOffset.UTC)),
        Some(now.toEpochSecond(ZoneOffset.UTC)),
        Some(UUID.randomUUID().toString)
      ).toString,
      secretKey,
      algorithm)
  }

  def validateJwt(token: String): Try[JwtClaim] = for {
    claims <- Jwt.decode(token, secretKey, Seq(JwtAlgorithm.HS256)) if claims.isValid(issuer)
  } yield claims
}
