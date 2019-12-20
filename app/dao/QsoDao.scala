package dao

import java.time.{LocalDate, LocalTime}

import javax.inject.Inject
import model.Qso

@javax.inject.Singleton
class QsoDao @Inject()() {
  def findAll(): Seq[Qso] = {
    var qsos = Seq(
      Qso(Some(1L), Some(1L), LocalDate.of(2019, 12, 15), LocalTime.of(22, 0), "LZ2AB", "144.000", "FM", "Jivko", Some("Balchik"), Some(100), Some("59+"), Some("58"), Some("HT")),
      Qso(Some(2L), Some(1L), LocalDate.of(2019, 12, 16), LocalTime.of(22, 52), "LZ1CD", "14.085", "CW", "Ivan", Some("Karlovo"), Some(20), Some("588"), Some("46"), Some("Vetical")),
      Qso(Some(3L), Some(1L), LocalDate.of(2018, 12, 1), LocalTime.of(21, 40), "LZ2EF", "3.564", "SSB", "Miro", Some("Sofia"), Some(50), Some("466"), Some("59"), Some("Ground Plane")),
      Qso(Some(1L), Some(1L), LocalDate.of(2016, 12, 15), LocalTime.of(2, 51), "LZ4MN", "28.800", "FT8", "Kiro", Some("Turnovo"), Some(200), Some("598"), Some("59"), Some("JPole"))
    )
    for (i <- 0 to 20) {
      qsos = qsos :+ Qso(Some(5 + i), Some(1L), LocalDate.of(2018, 12, i + 1), LocalTime.of(21, 20 + i), "LZ2KVV", "7.150", "SSB", "Ivan", Some("Varna"), Some(100), Some("59"), Some("48"), Some("Dipole"))
    }
    qsos
  }
}
