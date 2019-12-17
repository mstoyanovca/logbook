package dao

import java.time.{LocalDate, LocalTime}

import javax.inject.Inject
import model.Qso

@javax.inject.Singleton
class QsoDao @Inject()() {
  def findAll(): Seq[Qso] = {
    var qsos = Seq(
      Qso(1, "LZ2KVA", LocalDate.of(2019, 12, 15), LocalTime.of(22, 0), "144.000", "FM", "599", "5W"),
      Qso(2, "LZ1KVY", LocalDate.of(2019, 12, 16), LocalTime.of(22, 52), "462.100", "FM", "588", "5W"),
      Qso(3, "LZ2KVV", LocalDate.of(2018, 12, 1), LocalTime.of(21, 40), "3.564", "SSB", "466", "Dipole"),
      Qso(4, "LZ4MN", LocalDate.of(2016, 12, 15), LocalTime.of(22, 51), "28.800", "FM", "598", "Dipole")
    )
    for (i <- 0 to 20) {
      qsos = qsos :+ Qso(i + 5, "LZ2KVZ", LocalDate.of(2018, 12, i + 1), LocalTime.of(21, 20 + i), "7.150", "SSB", "599", "Dipole")
    }
    qsos
  }
}
