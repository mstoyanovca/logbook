import {QSO} from '../model/qso';

export class QsoFactory {
    private static date1 = new Date(2019, 12, 15);
    private static date2 = new Date(2019, 12, 16);
    private static date3 = new Date(2018, 12, 1);
    private static date4 = new Date(2016, 12, 15);

    private static time1 = new Date(0, 0, 0, 22, 0);
    private static time2 = new Date(0, 0, 0, 20, 52);
    private static time3 = new Date(0, 0, 0, 21, 40);
    private static time4 = new Date(0, 0, 0, 22, 51);

    private static qsos: QSO[];

    static createQsos = (): QSO[] => {
        const qso1 = new QSO(QsoFactory.date1, QsoFactory.time1, 'LZ2VA', '144.000', 'FM', 'Kiro', 'Karlovo');
        const qso2 = new QSO(QsoFactory.date2, QsoFactory.time2, 'LZ1YY', '3.560', 'SSB', 'Pesho', 'Shumen');
        const qso3 = new QSO(QsoFactory.date3, QsoFactory.time3, 'LZ2AB', '446.110', 'RTTY', 'Bochito', 'Ruse');
        const qso4 = new QSO(QsoFactory.date4, QsoFactory.time4, 'LZ4MN', '29.125', 'FM', 'Krasyo', 'Smolyan');

        QsoFactory.qsos = [qso1, qso2, qso3, qso4];

        for (let i = 0; i < 20; i++) {
            const date = new Date(2018, 8, i + 1);
            const time = new Date(0, 0, 0, 21, 10 + i);

            const qso = new QSO(date, time, 'LZ2KVV', '466.654', 'RTTY', 'Ivan', 'Varna');

            QsoFactory.qsos.push(qso);
        }

        return QsoFactory.qsos;
    }
}
