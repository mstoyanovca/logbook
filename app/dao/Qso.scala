package dao

import java.time.format.DateTimeFormatter
import java.time.{Duration, LocalDateTime}

import com.google.inject.Inject
import play.api.Logger
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.libs.json.{Json, Reads, Writes}
import slick.jdbc.JdbcProfile
import slick.jdbc.MySQLProfile.api._
import slick.lifted.Tag

import scala.concurrent.{ExecutionContext, Future}

case class Qso(var id: Option[Long],
               var userId: Option[Long],
               dateTime: LocalDateTime,
               callsign: String,
               frequency: String,
               mode: String,
               rstSent: String,
               rstReceived: Option[String] = None,
               power: Option[String] = None,
               name: Option[String] = None,
               qth: Option[String] = None,
               notes: Option[String] = None)

object Qso {
  implicit val qsoReads: Reads[Qso] = Json.reads[Qso]
  implicit val qsoWrites: Writes[Qso] = Json.writes[Qso]
}

class QsoTableDef(tag: Tag) extends Table[Qso](tag, "qso") {
  private val localDateTimeToStringMapper: BaseColumnType[LocalDateTime] = MappedColumnType.base[LocalDateTime, String](
    ldt => ldt.format(DateTimeFormatter.ISO_DATE_TIME),
    s => LocalDateTime.parse(s.replace(" ", "T"), DateTimeFormatter.ISO_DATE_TIME)
  )

  def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

  def userId = column[Long]("user_id")

  def dateTime = column[LocalDateTime]("date_time")(localDateTimeToStringMapper)

  def callsign = column[String]("callsign")

  def frequency = column[String]("frequency")

  def mode = column[String]("mode")

  def rstSent = column[String]("rst_sent")

  def rstReceived = column[String]("rst_received")

  def power = column[String]("power")

  def name = column[String]("name")

  def qth = column[String]("qth")

  def notes = column[String]("notes")

  override def * = (
    id.?,
    userId.?,
    dateTime,
    callsign,
    frequency,
    mode,
    rstSent,
    rstReceived.?,
    power.?,
    name.?,
    qth.?,
    notes.?) <> ((Qso.apply _).tupled, Qso.unapply)
}

class QsoDao @Inject()(@play.db.NamedDatabase(value = "va3aui") protected val dbConfigProvider: DatabaseConfigProvider)
                      (implicit executionContext: ExecutionContext) extends HasDatabaseConfigProvider[JdbcProfile] {

  import profile.api._

  val logger: Logger = Logger(this.getClass)
  val qsos = TableQuery[QsoTableDef]

  def findById(id: Long): Future[Option[Qso]] = {
    logger.info(s"findById($id)")
    db.run(qsos.filter(_.id === id).result.headOption)
  }

  def findAllByUserId(userId: Long): Future[Seq[Qso]] = {
    logger.info(s"findAllByUserId($userId)")
    db.run(qsos.filter(_.userId === userId).result)
  }

  def findByDateTimeAndCallsign(userId: Long, dateTime: LocalDateTime, callsign: String): Future[Seq[Qso]] = {
    logger.info(s"findByDateTimeAndCallsign(userId=$userId, dateTime=$dateTime, callsign=$callsign)")
    for {
      all <- db.run(qsos.result)
      result = all
        .filter(_.userId.contains(userId))
        .filter(_.callsign == callsign)
        .filter(qso => Math.abs(Duration.between(qso.dateTime, dateTime).toMinutes) <= 15)
    } yield result
  }

  def findAll: Future[Seq[Qso]] = {
    logger.info(s"findAll()")
    db.run(qsos.result)
  }

  def add(qso: Qso): Future[Qso] = {
    for {
      qso <- db.run(qsos returning qsos.map(_.id) into ((qso, id) => qso.copy(id = Some(id))) += qso)
      _ = logger.info(s"Added a QSO: $qso")
    } yield qso
  }

  def delete(id: Long): Future[Int] = {
    for {
      i <- db.run(qsos.filter(_.id === id).delete)
      _ = logger.info(s"Deleted a qso with id=$id")
    } yield i
  }
}
