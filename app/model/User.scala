package model

import play.api.libs.json.{Json, Reads, Writes}

case class User(id: Option[Long], email: String, var password: Option[String], var token: Option[String])

object User {
  implicit val reads: Reads[User] = Json.reads[User]
  implicit val writes: Writes[User] = Json.writes[User]
}
