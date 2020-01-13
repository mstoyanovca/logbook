import {QSO} from '../model/qso';

export class QsoFactory {
    private static dateTime1 = new Date(2019, 12, 15, 22, 0);
    private static dateTime2 = new Date(2019, 12, 16, 20, 52);
    private static dateTime3 = new Date(2018, 12, 1, 21, 40);
    private static dateTime4 = new Date(2016, 12, 15, 22, 51);

    private static qsos: QSO[];

    static createQsos = (): QSO[] => {
        const qso1 = new QSO(QsoFactory.dateTime1, 'LZ2VA', '144.000', 'FM', 'Kiro', 'Karlovo');
        const qso2 = new QSO(QsoFactory.dateTime2, 'LZ1YY', '3.560', 'SSB', 'Pesho', 'Shumen');
        const qso3 = new QSO(QsoFactory.dateTime3, 'LZ2AB', '446.110', 'RTTY', 'Bochito', 'Ruse');
        const qso4 = new QSO(QsoFactory.dateTime4, 'LZ4MN', '29.125', 'FM', 'Krasyo', 'Smolyan');

        QsoFactory.qsos = [qso1, qso2, qso3, qso4];

        for (let i = 0; i < 20; i++) {
            const dateTime = new Date(2018, 8, i + 1, 21, 10 + i);
            const qso = new QSO(dateTime, 'LZ2KVV', '466.654', 'RTTY', 'Ivan', 'Varna');
            QsoFactory.qsos.push(qso);
        }

        return QsoFactory.qsos;
    }
}
