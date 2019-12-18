import {QSO} from '../model/qso';

export class QsoFactory {
    private static date1 = new Date(2019, 12, 15);
    private static date2 = new Date(2019, 12, 16);
    private static date3 = new Date(2018, 12, 1);
    private static date4 = new Date(2016, 12, 15);

    private static time1 = new Date(22, 0);
    private static time2 = new Date(20, 52);
    private static time3 = new Date(21, 40);
    private static time4 = new Date(22, 51);

    private static qsos: QSO[];

    static createQsos = (): QSO[] => {
        const qso1 = new QSO(1, 'LZ2KVA', QsoFactory.date1, QsoFactory.time1, '144.000m', 'FM', '466', '5W');
        const qso2 = new QSO(2, 'LZ1KVY', QsoFactory.date2, QsoFactory.time2, '80m', 'SSB', '588', 'Dipole');
        const qso3 = new QSO(3, 'LZ2KVV', QsoFactory.date3, QsoFactory.time3, '70cm', 'RTTY', '344', 'Dipole');
        const qso4 = new QSO(4, 'LZ4MN', QsoFactory.date4, QsoFactory.time4, '10m', 'FM', '588', 'Dipole');

        QsoFactory.qsos = [qso1, qso2, qso3, qso4];

        for (let i = 0; i < 20; i++) {
            const date = new Date(2018, 12, i + 1);
            const time = new Date(21, 45);

            const qso = new QSO(i + 5, 'LZ2KVZ', date, time, '70cm', 'RTTY', '344', 'Dipole');

            QsoFactory.qsos.push(qso);
        }

        return QsoFactory.qsos;
    }
}
