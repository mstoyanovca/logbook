package dao

import java.time.format.DateTimeFormatter
import java.time.{LocalDate, LocalTime}

import com.google.inject.Inject
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.libs.json.{Json, Reads, Writes}
import slick.jdbc.JdbcProfile
import slick.jdbc.MySQLProfile.api._
import slick.lifted.Tag

import scala.concurrent.{ExecutionContext, Future}

case class Qso(id: Option[Long],
               userId: Option[Long],
               date: LocalDate,
               time: LocalTime,
               callsign: String,
               frequency: String,
               mode: String,
               rstSent: String,
               rstReceived: Option[String],
               power: Option[Int],
               name: Option[String],
               qth: Option[String],
               notes: Option[String])

object Qso {
  implicit val qsoReads: Reads[Qso] = Json.reads[Qso]
  implicit val qsoWrites: Writes[Qso] = Json.writes[Qso]
}

class QsoTableDef(tag: Tag) extends Table[Qso](tag, "qso") {
  def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

  def userId = column[Long]("user_id")

  def date = column[String]("date")

  def time = column[String]("time")

  def callsign = column[String]("callsign")

  def frequency = column[String]("frequency")

  def mode = column[String]("mode")

  def rstSent = column[String]("rst_sent")

  def rstReceived = column[String]("rst_received")

  def power = column[Int]("power")

  def name = column[String]("name")

  def qth = column[String]("qth")

  def notes = column[String]("notes")

  def create: (Option[Long], Option[Long], String, String, String, String, String, String, Option[String], Option[Int], Option[String], Option[String], Option[String]) => Qso =
    (id: Option[Long],
     userId: Option[Long],
     date: String,
     time: String,
     callsign: String,
     frequency: String,
     mode: String,
     rstSent: String,
     rstReceived: Option[String],
     power: Option[Int],
     name: Option[String],
     qth: Option[String],
     notes: Option[String]) => Qso(id, userId, LocalDate.parse(date), LocalTime.parse(time), callsign, frequency, mode, rstSent, rstReceived, power, name, qth, notes)

  def destroy(qso: Qso): Option[(Option[Long], Option[Long], String, String, String, String, String, String, Option[String], Option[Int], Option[String], Option[String], Option[String])] =
    Some(qso.id,
      qso.userId,
      qso.date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
      qso.time.format(DateTimeFormatter.ISO_DATE_TIME),
      qso.callsign,
      qso.frequency,
      qso.mode,
      qso.rstSent,
      qso.rstReceived,
      qso.power,
      qso.name,
      qso.qth,
      qso.notes)

  override def * = (id.?, userId.?, date, time, callsign, frequency, mode, rstSent, rstReceived.?, power.?, name.?, qth.?, notes.?) <>
    (create.tupled, destroy)
}

class QsoDao @Inject()(@play.db.NamedDatabase(value = "va3aui") protected val dbConfigProvider: DatabaseConfigProvider)
                      (implicit executionContext: ExecutionContext) extends HasDatabaseConfigProvider[JdbcProfile] {

  import profile.api._

  val qsos = TableQuery[QsoTableDef]

  def findById(id: Long): Future[Option[Qso]] = {
    db.run(qsos.filter(_.id === id).result.headOption)
  }

  def findAll: Future[Seq[Qso]] = {
    db.run(qsos.result)
  }

  def add(qso: Qso): Future[String] = {
    db.run(qsos += qso).map(_ => "Added a qso: " + qso).recover {
      case ex: Exception => ex.getCause.getMessage
    }
  }

  def delete(id: Long): Future[Int] = {
    db.run(qsos.filter(_.id === id).delete)
  }
}
