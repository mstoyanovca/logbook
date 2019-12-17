package model

import java.time.{LocalDate, LocalTime}

import play.api.libs.json.{Json, Reads, Writes}

case class Qso(id: Long, callsign: String, date: LocalDate, time: LocalTime, frequency: String, mode: String, rst: String, notes: String)

object Qso {
  implicit val reads: Reads[Qso] = Json.reads[Qso]
  implicit val writes: Writes[Qso] = Json.writes[Qso]
}
