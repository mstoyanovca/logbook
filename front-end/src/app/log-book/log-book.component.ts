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

    qsoToDelete = new QSO(null, '', '', '', '', '');

    constructor(private qsoService: QsoService) {
    }

    ngOnInit() {
        const date = new Date();
        const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes());
        this.qsoDate = {
            year: utcDate.getFullYear(),
            month: utcDate.getMonth() + 1,
            day: utcDate.getDate()
        };
        this.qsoTime = {hour: utcDate.getHours(), minute: utcDate.getMinutes()};

        this.newQso = new QSO(
            utcDate,
            '',
            '',
            'SSB',
            '');

        this.findAll();
    }

    private findAll(): void {
        this.qsoService.findAll().subscribe(result => {
            this.qsosFromDB = result;
            this.qsos = this.qsosFromDB.sort(this.compareDateTime);
            this.collectionSize = this.qsosFromDB.length;
        });
    }

    private add(qso: QSO): void {
        qso.dateTime = new Date(Date.UTC(this.qsoDate.year, this.qsoDate.month, this.qsoDate.day, this.qsoTime.hour, this.qsoTime.minute));
        this.qsoService.add(qso).subscribe(result => {
            this.qsosFromDB.push(result);
            this.qsos = this.qsosFromDB.sort(this.compareDateTime);
            this.collectionSize = this.qsosFromDB.length;
            this.resetManualSorting();
        });
    }

    private delete(qso: QSO): void {
        this.qsoService.delete(qso).subscribe(result => {
            this.qsosFromDB = this.qsosFromDB.filter(q => q !== qso);
            this.qsos = this.qsosFromDB.sort(this.compareDateTime);
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

    compareDateTime = (qso1: QSO, qso2: QSO): number => {
        if (qso1.dateTime.getFullYear() !== qso2.dateTime.getFullYear()) {
            return qso1.dateTime.getFullYear() - qso2.dateTime.getFullYear();
        } else if (qso1.dateTime.getMonth() !== qso2.dateTime.getMonth()) {
            return qso1.dateTime.getMonth() - qso2.dateTime.getMonth();
        } else if (qso1.dateTime.getDate() !== qso2.dateTime.getDate()) {
            return qso1.dateTime.getDate() - qso2.dateTime.getDate();
        } else if (qso1.dateTime.getHours() !== qso2.dateTime.getHours()) {
            return qso1.dateTime.getHours() - qso2.dateTime.getHours();
        } else {
            return qso1.dateTime.getMinutes() - qso2.dateTime.getMinutes();
        }
    };

    private sortByCallsign = (): void => {
        this.frequencyDirection = Direction.None;
        this.frequencyImagePath = '';
        if (this.callsignDirection === Direction.None) {
            // @ts-ignore
            this.qsos = this.qsosFromDB.sort((qso1: QSO, qso2: QSO) => {
                return qso1.callsign < qso2.callsign ? -1 : qso1.callsign > qso2.callsign ? 1 : this.compareDateTime;
            });
            this.callsignDirection = Direction.Asc;
            this.callsignImagePath = this.asc;
        } else if (this.callsignDirection === Direction.Asc) {
            // @ts-ignore
            this.qsos = this.qsosFromDB.sort((qso1: QSO, qso2: QSO) => {
                return qso1.callsign > qso2.callsign ? -1 : qso1.callsign < qso2.callsign ? 1 : this.compareDateTime;
            });
            this.callsignDirection = Direction.Desc;
            this.callsignImagePath = this.desc;
        } else {
            this.qsos = this.qsosFromDB.sort(this.compareDateTime);
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
                        this.compareDateTime;
            });
            this.frequencyDirection = Direction.Asc;
            this.frequencyImagePath = this.asc;
        } else if (this.frequencyDirection === Direction.Asc) {
            // @ts-ignore
            this.qsos = this.qsosFromDB.sort((qso1: QSO, qso2: QSO) => {
                return parseFloat(qso1.frequency) > parseFloat(qso2.frequency) ? -1 :
                    parseFloat(qso1.frequency) < parseFloat(qso2.frequency) ? 1 :
                        this.compareDateTime;
            });
            this.frequencyDirection = Direction.Desc;
            this.frequencyImagePath = this.desc;
        } else {
            this.qsos = this.qsosFromDB.sort(this.compareDateTime);
            this.frequencyDirection = Direction.None;
            this.frequencyImagePath = '';
        }
    };

    private filterData = (): void => {
        this.qsos = this.filter.trim().length > 0 ?
            this.qsosFromDB.filter(qso => {
                const time = qso.dateTime.toLocaleTimeString(['en-US'], {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: 'UTC'
                });
                return this.monthNames[qso.dateTime.getUTCMonth()].toLowerCase() === this.filter.toLowerCase() ||
                    qso.dateTime.getUTCDate().toString() === this.filter ||
                    qso.dateTime.getUTCFullYear().toString() === this.filter ||
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
