package dao

import java.time.{LocalDate, LocalTime}

import javax.inject.Inject
import model.Qso

@javax.inject.Singleton
class QsoDao @Inject()() {
  def findAll(): Seq[Qso] = {
    var qsos = Seq(
      Qso(None, None, LocalDate.of(2019, 12, 15), LocalTime.of(22, 0), "LZ2AB", "144.000", "FM", "59+", Some("58"), Some(100), Some("Jivko"), Some("Balchik"), Some("HT")),
      Qso(None, None, LocalDate.of(2019, 12, 16), LocalTime.of(22, 52), "LZ1CD", "14.085", "CW", "588", Some("46"), Some(20), Some("Ivan"), Some("Karlovo"), Some("Vetical")),
      Qso(None, None, LocalDate.of(2018, 12, 1), LocalTime.of(21, 40), "LZ2EF", "3.564", "SSB", "466", Some("59"), Some(50), Some("Miro"), Some("Sofia"), Some("Ground Plane")),
      Qso(Some(1L), Some(1L), LocalDate.of(2016, 12, 15), LocalTime.of(2, 51), "LZ4MN", "28.800", "FT8", "598", Some("59"), Some(200), Some("Kiro"), Some("Turnovo"), Some("JPole"))
    )
    for (i <- 0 to 20) {
      qsos = qsos :+ Qso(None, None, LocalDate.of(2018, 12, i + 1), LocalTime.of(21, 20 + i), "LZ2KVV", "7.150", "SSB", "59", Some("48"), Some(100), Some("Ivan"), Some("Varna"), Some("Dipole"))
    }
    qsos
  }
}
