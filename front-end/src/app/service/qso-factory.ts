import {QsoDate} from '../model/qso-date';
import {QsoTime} from '../model/qso-time';
import {QSO} from '../model/qso';

export class QsoFactory {
  private static date1 = new QsoDate(2019, 12, 15);
  private static date2 = new QsoDate(2019, 12, 16);
  private static date3 = new QsoDate(2018, 12, 1);
  private static date4 = new QsoDate(2016, 12, 15);

  private static time1 = new QsoTime(22, 0);
  private static time2 = new QsoTime(20, 52);
  private static time3 = new QsoTime(21, 40);
  private static time4 = new QsoTime(22, 51);

  private static qsos: QSO[];

  static createQsos = (): QSO[] => {
    const qso1 = new QSO(1, QsoFactory.date1, QsoFactory.time1, 'LZ2KVA', '2m', 'SSB', '466', '123456789012345678901234567890123' +
      '456789012345678', '123456789012345678901234567890123456789012345678', '12345678901234567890123456789012345678901234567890123' +
      '456789012345678901234567890123456789012345678901234567890123456789012345678');
    const qso2 = new QSO(2, QsoFactory.date2, QsoFactory.time2, 'LZ1KVY', '80m', 'SSB', '588', 'Ivan', 'Varna', 'Dipole');
    const qso3 = new QSO(3, QsoFactory.date3, QsoFactory.time3, 'LZ2KVV', '70cm', 'RTTY', '344', 'Peter', 'Burgas', 'Dipole');
    const qso4 = new QSO(4, QsoFactory.date4, QsoFactory.time4, 'LZ4MN', '10m', 'FM', '588', 'Mike', 'Sofia', 'Dipole');

    QsoFactory.qsos = [qso1, qso2, qso3, qso4];

    for (let i = 0; i < 20; i++) {
      const date = new QsoDate(2018, 12, i + 1);
      const time = new QsoTime(21, 45);

      const qso = new QSO(i + 5, date, time, 'LZ2KVZ', '70cm', 'RTTY', '344', 'Ivan', 'Varna', 'Dipole');

      QsoFactory.qsos.push(qso);
    }

    return QsoFactory.qsos;
  }
}
