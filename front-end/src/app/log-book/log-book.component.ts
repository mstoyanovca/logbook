import {Component, OnInit} from '@angular/core';
import {QSO} from '../model/qso';
import {Direction} from '../model/direction';
import {QsoService} from '../service/qso-service';
import {QsoDate} from "../model/qso-date";
import {QsoTime} from "../model/qso-time";

@Component({
    selector: 'app-log-book',
    templateUrl: './log-book.component.html',
    styleUrls: ['./log-book.component.css']
})

export class LogBookComponent implements OnInit {
    newQso: QSO;
    qsoDate: QsoDate;
    qsoTime: QsoTime;
    qsosFromDB: QSO[] = [];
    qsos: QSO[] = [];

    callsignDirection = Direction.None;
    frequencyDirection = Direction.None;
    asc = '..\\..\\assets\\down-icon.png';
    desc = '..\\..\\assets\\up-icon.png';
    callsignImagePath = '';
    frequencyImagePath = '';

    filter = '';

    page = 1;
    pageSize = 10;
    collectionSize = 0;

    monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    qsoToDelete = new QSO(null, null, '', '', '', null);

    constructor(private qsoService: QsoService) {
    }

    ngOnInit() {
        const date = new Date();
        const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes());
        this.qsoDate = {
            year: utcDate.getFullYear(),
            month: utcDate.getMonth(),
            day: utcDate.getDate()
        };
        this.qsoTime = {hour: utcDate.getHours(), minute: utcDate.getMinutes()};

        this.newQso = new QSO(
            utcDate,
            utcDate,
            '',
            '',
            'SSB',
            null);

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
        qso.date = new Date(this.qsoDate.year, this.qsoDate.month, this.qsoDate.day);
        qso.time = new Date(0, 0, 0, this.qsoTime.hour, this.qsoTime.minute);
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
        if (qso1.date.getFullYear() !== qso2.date.getFullYear()) {
            return qso1.date.getFullYear() - qso2.date.getFullYear();
        } else if (qso1.date.getMonth() !== qso2.date.getMonth()) {
            return qso1.date.getMonth() - qso2.date.getMonth();
        } else {
            return qso1.date.getDate() - qso2.date.getDate();
        }
    };

    compareTime = (qso1: QSO, qso2: QSO): number => {
        const datesDiff = this.compareDate(qso1, qso2);
        if (datesDiff === 0) {
            return qso1.time.getHours() !== qso2.time.getHours() ? qso1.time.getHours() - qso2.time.getHours() : qso1.time.getMinutes() - qso2.time.getMinutes();
        } else {
            return datesDiff;
        }
    };

    private sortByCallsign = (): void => {
        this.frequencyDirection = Direction.None;
        this.frequencyImagePath = '';
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
    };

    private sortByFrequency = (): void => {
        this.callsignDirection = Direction.None;
        this.callsignImagePath = '';
        if (this.frequencyDirection === Direction.None) {
            // @ts-ignore
            this.qsos = this.qsosFromDB.sort((qso1: QSO, qso2: QSO) => {
                return parseFloat(qso1.frequency) < parseFloat(qso2.frequency) ? -1 :
                    parseFloat(qso1.frequency) > parseFloat(qso2.frequency) ? 1 :
                        this.compareDate;
            });
            this.frequencyDirection = Direction.Asc;
            this.frequencyImagePath = this.asc;
        } else if (this.frequencyDirection === Direction.Asc) {
            // @ts-ignore
            this.qsos = this.qsosFromDB.sort((qso1: QSO, qso2: QSO) => {
                return parseFloat(qso1.frequency) > parseFloat(qso2.frequency) ? -1 :
                    parseFloat(qso1.frequency) < parseFloat(qso2.frequency) ? 1 :
                        this.compareDate;
            });
            this.frequencyDirection = Direction.Desc;
            this.frequencyImagePath = this.desc;
        } else {
            this.qsos = this.qsosFromDB.sort(this.compareDate);
            this.frequencyDirection = Direction.None;
            this.frequencyImagePath = '';
        }
    };

    private filterData = (): void => {
        this.qsos = this.filter.trim().length > 0 ?
            this.qsosFromDB.filter(qso => {
                const time = qso.time.toLocaleTimeString(['en-US'], {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: 'UTC'
                });
                return this.monthNames[qso.date.getUTCMonth()].toLowerCase() === this.filter.toLowerCase() ||
                    qso.date.getUTCDate().toString() === this.filter ||
                    qso.date.getUTCFullYear().toString() === this.filter ||
                    time.split(' ')[0] === this.filter ||
                    qso.callsign.toLowerCase() === this.filter.toLowerCase() ||
                    qso.frequency.indexOf(this.filter) > -1 ||
                    qso.mode.toLowerCase() === this.filter.toLowerCase() ||
                    qso.name.toLowerCase() === this.filter.toLowerCase() ||
                    qso.qth.toLowerCase() === this.filter.toLowerCase();
            }) : this.qsosFromDB;

        this.collectionSize = this.qsos.length;
    };

    private resetManualSorting = (): void => {
        this.callsignDirection = Direction.None;
        this.callsignImagePath = '';
        this.frequencyDirection = Direction.None;
        this.frequencyImagePath = '';
    }
}
