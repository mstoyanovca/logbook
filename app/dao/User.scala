package dao

import com.google.inject.Inject
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.libs.json.{Json, Reads, Writes}
import slick.ast.ColumnOption.Unique
import slick.jdbc.JdbcProfile
import slick.jdbc.MySQLProfile.api._
import slick.lifted.Tag

import scala.concurrent.{ExecutionContext, Future}

case class User(var id: Option[Long], email: String, var password: Option[String], var token: Option[String])

object User {
  implicit val userReads: Reads[User] = Json.reads[User]
  implicit val userWrites: Writes[User] = Json.writes[User]
}

class UserTableDef(tag: Tag) extends Table[User](tag, "user") {
  def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

  def email = column[String]("email", Unique)

  def password = column[String]("password")

  def create: (Option[Long], String, Option[String]) => User = (id: Option[Long], email: String, password: Option[String]) => User(id, email, password, Option.empty)

  def destroy(user: User): Option[(Option[Long], String, Option[String])] = Some(user.id, user.email, user.password)

  override def * = (id.?, email, password.?) <> (create.tupled, destroy)
}

class UserDao @Inject()(@play.db.NamedDatabase(value = "va3aui") protected val dbConfigProvider: DatabaseConfigProvider)
                       (implicit executionContext: ExecutionContext) extends HasDatabaseConfigProvider[JdbcProfile] {

  import profile.api._

  val users = TableQuery[UserTableDef]

  def findById(id: Long): Future[Option[User]] = {
    db.run(users.filter(_.id === id).result.headOption)
  }

  def findByEmailAndPassword(user: User): Future[Option[User]] = {
    db.run(users.filter(_.email === user.email).filter(_.password === user.password).result.headOption)
  }

  def findAll: Future[Seq[User]] = {
    db.run(users.result)
  }

  def add(user: User): Future[String] = {
    db.run(users += user).map(_ => "Added a user: " + user).recover {
      case ex: Exception => ex.getCause.getMessage
    }
  }

  def delete(id: Long): Future[Int] = {
    db.run(users.filter(_.id === id).delete)
  }
}
