package model

import java.time.{LocalDate, LocalTime}

import play.api.libs.json.{Json, Reads, Writes}

case class Qso(id: Option[Long] = None,
               userId: Option[Long] = None,
               date: LocalDate,
               time: LocalTime,
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
  implicit val reads: Reads[Qso] = Json.reads[Qso]
  implicit val writes: Writes[Qso] = Json.writes[Qso]
}
