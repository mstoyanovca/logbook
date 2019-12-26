package dao

import slick.ast.ColumnOption.Unique
import slick.jdbc.MySQLProfile.api._
import slick.lifted.{TableQuery, Tag}

object LiftedEmbedding extends App {

  class User(tag: Tag) extends Table[(Long, String, String)](tag, "USER") {
    def id = column[Long]("ID", O.PrimaryKey)

    def email = column[String]("EMAIL", Unique)

    def password = column[String]("PASSWORD")

    override def * = (id, email, password)
  }

  val user = TableQuery[User]
  val schema = user.schema
  val db: Database = Database.forConfig("mysql")
  db.run(DBIO.seq(schema.createIfNotExists))
  schema.createIfNotExists.statements.foreach(println)
}
