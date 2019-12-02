package model

import play.api.libs.json.{Json, Reads}

case class User(email: String, password: String)

object User {
  implicit val reads: Reads[User] = Json.reads[User]
}
