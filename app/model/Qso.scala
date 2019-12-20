package model

import java.time.{LocalDate, LocalTime}

import play.api.libs.json.{Json, Reads, Writes}

case class Qso(id: Option[Long],
               userId: Option[Long],
               date: LocalDate,
               time: LocalTime,
               callsign: String,
               frequency: String,
               mode: String,
               name: String,
               qth: Option[String],
               power: Option[Int],
               rstSent: Option[String],
               rstReceived: Option[String],
               notes: Option[String])

object Qso {
  implicit val reads: Reads[Qso] = Json.reads[Qso]
  implicit val writes: Writes[Qso] = Json.writes[Qso]
}
