import {Component, OnInit} from '@angular/core';
import {QSO} from '../model/qso';
import {Direction} from '../model/direction';
import {Band} from '../model/band';
import {QsoService} from '../service/qso-service';
import {QsoDate} from '../model/qso-date';
import {QsoTime} from '../model/qso-time';

@Component({
  selector: 'app-log-book',
  templateUrl: './log-book.component.html',
  styleUrls: ['./log-book.component.css']
})

export class LogBookComponent implements OnInit {
  newQso: QSO;
  qsosFromDB: QSO[] = [];
  qsos: QSO[] = [];

  callsignDirection = Direction.None;
  bandDirection = Direction.None;
  asc = '..\\..\\assets\\up-icon.png';
  desc = '..\\..\\assets\\down-icon.png';
  callsignImagePath = '';
  bandImagePath = '';

  filter = '';

  page = 1;
  pageSize = 10;
  collectionSize = 0;

  qsoToDelete = new QSO(0, null, null, '', '', '', '', '', '', '');

  constructor(private qsoService: QsoService) {
  }

  ngOnInit() {
    const date = new Date();
    this.newQso = new QSO(
      0,
      new QsoDate(date.getFullYear(), date.getMonth() + 1, date.getDate()),
      new QsoTime(date.getHours(), date.getMinutes()),
      '', '70cm', 'FM', '', '', '', '');

    this.findAll();
  }

  private findAll(): void {
    this.qsoService.findAll().subscribe(result => {
      this.qsosFromDB = result;
      this.qsos = this.qsosFromDB.sort(this.compareDate).sort(this.compareTime);
      this.collectionSize = this.qsosFromDB.length;
    });
  }

  private add(qso: QSO): void {
    this.qsoService.add(qso).subscribe(result => {
      this.qsosFromDB.push(result);
      this.qsos = this.qsosFromDB.sort(this.compareDate).sort(this.compareTime);
      this.collectionSize = this.qsosFromDB.length;
      this.resetManualSorting();
    });
  }

  private delete(qso: QSO): void {
    this.qsoService.delete(qso).subscribe(result => {
      this.qsosFromDB = this.qsosFromDB.filter(q => q !== qso);
      this.qsos = this.qsosFromDB.sort(this.compareDate).sort(this.compareTime);
      this.collectionSize = this.qsosFromDB.length;
      this.resetManualSorting();
      document.getElementById('closeQsoModal').click();
    });
  }

  private onSubmit() {
    this.add(this.newQso);
  }

  private setQsoToDelete(qso: QSO): void {
    this.qsoToDelete = qso;
  }

  compareDate = (qso1: QSO, qso2: QSO): number => {
    if (qso1.date.year !== qso2.date.year) {
      return qso1.date.year - qso2.date.year;
    } else if (qso1.date.month !== qso2.date.month) {
      return qso1.date.month - qso2.date.month;
    } else {
      return qso1.date.day - qso2.date.day;
    }
  }

  compareTime = (qso1: QSO, qso2: QSO): number => {
    const datesDiff = this.compareDate(qso1, qso2);
    if (datesDiff === 0) {
      return qso1.time.hour !== qso2.time.hour ? qso1.time.hour - qso2.time.hour : qso1.time.minute - qso2.time.minute;
    } else {
      return datesDiff;
    }
  }

  private sortByCallsign = (): void => {
    this.bandDirection = Direction.None;
    this.bandImagePath = '';
    if (this.callsignDirection === Direction.None) {
      // @ts-ignore
      this.qsos = this.qsosFromDB.sort((qso1: QSO, qso2: QSO) => {
        return qso1.callsign < qso2.callsign ? -1 : qso1.callsign > qso2.callsign ? 1 : this.compareDate;
      });
      this.callsignDirection = Direction.Asc;
      this.callsignImagePath = this.asc;
    } else if (this.callsignDirection === Direction.Asc) {
      // @ts-ignore
      this.qsos = this.qsosFromDB.sort((qso1: QSO, qso2: QSO) => {
        return qso1.callsign > qso2.callsign ? -1 : qso1.callsign < qso2.callsign ? 1 : this.compareDate;
      });
      this.callsignDirection = Direction.Desc;
      this.callsignImagePath = this.desc;
    } else {
      this.qsos = this.qsosFromDB.sort(this.compareDate);
      this.callsignDirection = Direction.None;
      this.callsignImagePath = '';
    }
  }

  private sortByBand = (): void => {
    this.callsignDirection = Direction.None;
    this.callsignImagePath = '';
    if (this.bandDirection === Direction.None) {
      this.qsos = this.qsosFromDB.sort((qso1: QSO, qso2: QSO) => {
        return this.compareBandAsc(qso1, qso2);
      });
      this.bandDirection = Direction.Asc;
      this.bandImagePath = this.asc;
    } else if (this.bandDirection === Direction.Asc) {
      this.qsos = this.qsosFromDB.sort((qso1: QSO, qso2: QSO) => {
        return this.compareBandDesc(qso1, qso2);
      });
      this.bandDirection = Direction.Desc;
      this.bandImagePath = this.desc;
    } else {
      this.qsos = this.qsosFromDB.sort(this.compareDate);
      this.bandDirection = Direction.None;
      this.bandImagePath = '';
    }
  }

  compareBandAsc = (qso1: QSO, qso2: QSO): number => {
    const result = Band.codeToPosition(qso1.band) - Band.codeToPosition(qso2.band);
    // @ts-ignore
    return result !== 0 ? result : this.compareDate;
  }

  compareBandDesc = (qso1: QSO, qso2: QSO): number => {
    const result = Band.codeToPosition(qso2.band) - Band.codeToPosition(qso1.band);
    // @ts-ignore
    return result !== 0 ? result : this.compareDate;
  }

  private filterData = (): void => {
    this.qsos = this.qsosFromDB.filter(qso =>
      (qso.date.year + '-' + qso.date.month + '-' + qso.date.day).indexOf(this.filter) > -1 ||
      (qso.time.hour + ':' + qso.time.minute).indexOf(this.filter) > -1 ||
      qso.callsign.indexOf(this.filter.toUpperCase()) > -1 ||
      qso.band.toLowerCase().indexOf(this.filter) > -1 ||
      qso.name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1 ||
      qso.qth.toLowerCase() === this.filter.toLowerCase());
    this.collectionSize = this.qsos.length;
  }

  private resetManualSorting = (): void => {
    this.callsignDirection = Direction.None;
    this.callsignImagePath = '';
    this.bandDirection = Direction.None;
    this.bandImagePath = '';
  }
}
