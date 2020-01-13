package dao

import java.time.format.DateTimeFormatter
import java.time.{LocalDateTime, ZoneId}

import com.google.inject.Inject
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.libs.json.{JsPath, Json, Reads, Writes}
import slick.jdbc.JdbcProfile
import slick.jdbc.MySQLProfile.api._
import slick.lifted.Tag

import scala.concurrent.{ExecutionContext, Future}

case class Qso(id: Option[Long],
               userId: Option[Long],
               dateTime: LocalDateTime,
               callsign: String,
               frequency: String,
               mode: String,
               rstSent: String,
               rstReceived: Option[String] = None,
               power: Option[Int] = None,
               name: Option[String] = None,
               qth: Option[String] = None,
               notes: Option[String] = None)

object Qso {

  import play.api.libs.functional.syntax._

  implicit val qsoReads: Reads[Qso] = (
    (JsPath \ "id").readNullable[Long] and
      (JsPath \ "userId").readNullable[Long] and
      (JsPath \ "dateTime").read[String].map[LocalDateTime](s => LocalDateTime.parse(s, DateTimeFormatter.ISO_OFFSET_DATE_TIME.withZone(ZoneId.of("UTC")))) and
      (JsPath \ "callsign").read[String] and
      (JsPath \ "frequency").read[String] and
      (JsPath \ "mode").read[String] and
      (JsPath \ "rstSent").read[String] and
      (JsPath \ "rstReceived").readNullable[String] and
      (JsPath \ "power").readNullable[Int] and
      (JsPath \ "name").readNullable[String] and
      (JsPath \ "qth").readNullable[String] and
      (JsPath \ "notes").readNullable[String]
    ) (Qso.apply _)

  /*implicit val qsoWrites: Writes[Qso] = (
    (JsPath \ "id").writeNullable[Long] and
      (JsPath \ "userId").writeNullable[Long] and
      (JsPath \ "dateTime").write[LocalDateTime] and
      (JsPath \ "callsign").write[String] and
      (JsPath \ "frequency").write[String] and
      (JsPath \ "mode").write[String] and
      (JsPath \ "rstSent").write[String] and
      (JsPath \ "rstReceived").writeNullable[String] and
      (JsPath \ "power").writeNullable[Int] and
      (JsPath \ "name").writeNullable[String] and
      (JsPath \ "qth").writeNullable[String] and
      (JsPath \ "notes").writeNullable[String]
    ) (unlift(Qso.unapply))*/

  implicit val qsoWrites: Writes[Qso] = Json.writes[Qso]
}

class QsoTableDef(tag: Tag) extends Table[Qso](tag, "qso") {
  def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

  def userId = column[Long]("user_id")

  def dateTime = column[String]("date_time")

  def callsign = column[String]("callsign")

  def frequency = column[String]("frequency")

  def mode = column[String]("mode")

  def rstSent = column[String]("rst_sent")

  def rstReceived = column[String]("rst_received")

  def power = column[Int]("power")

  def name = column[String]("name")

  def qth = column[String]("qth")

  def notes = column[String]("notes")

  def create: (Option[Long], Option[Long], String, String, String, String, String, Option[String], Option[Int], Option[String], Option[String], Option[String]) => Qso =
    (id: Option[Long],
     userId: Option[Long],
     dateTime: String,
     callsign: String,
     frequency: String,
     mode: String,
     rstSent: String,
     rstReceived: Option[String],
     power: Option[Int],
     name: Option[String],
     qth: Option[String],
     notes: Option[String]) =>
      Qso(id,
        userId,
        LocalDateTime.parse(dateTime, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
        callsign,
        frequency,
        mode,
        rstSent,
        rstReceived,
        power,
        name,
        qth,
        notes)

  def destroy(qso: Qso): Option[(Option[Long], Option[Long], String, String, String, String, String, Option[String], Option[Int], Option[String], Option[String], Option[String])] =
    Some(qso.id,
      qso.userId,
      qso.dateTime.format(DateTimeFormatter.ISO_DATE_TIME),
      qso.callsign,
      qso.frequency,
      qso.mode,
      qso.rstSent,
      qso.rstReceived,
      qso.power,
      qso.name,
      qso.qth,
      qso.notes)

  override def * = (id.?, userId.?, dateTime, callsign, frequency, mode, rstSent, rstReceived.?, power.?, name.?, qth.?, notes.?) <>
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
    db.run(qsos += qso).map(r => "Added a new qso").recover {
      case ex: Exception => ex.getCause.getMessage
    }
  }

  def delete(id: Long): Future[Int] = {
    db.run(qsos.filter(_.id === id).delete)
  }
}
