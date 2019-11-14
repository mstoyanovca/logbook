import {QsoTime} from './qso-time';
import {QsoDate} from './qso-date';

export class QSO {
  constructor(public id: number,
              public date: QsoDate,
              public time: QsoTime,
              public callsign: string,
              public band: string,
              public mode: string,
              public rst: string,
              public name: string,
              public qth: string,
              public notes: string) {
  }
}
