import {QsoTime} from './qso-time';
import {QsoDate} from './qso-date';

export class QSO {
    constructor(public id: number,
                public callsign: string,
                public date: QsoDate,
                public time: QsoTime,
                public frequency: string,
                public mode: string,
                public rst: string,
                public notes: string) {
    }
}
