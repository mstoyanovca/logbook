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
    qsoToDelete = new QSO(null, '', '', '', '');
    qsosFromDB: QSO[] = [];
    qsos: QSO[] = [];

    callsignDirection = Direction.None;
    frequencyDirection = Direction.None;
    asc = '..\\..\\assets\\down-icon.png';
    desc = '..\\..\\assets\\up-icon.png';
    callsignImagePath = '';
    frequencyImagePath = '';

    filter = '';
    monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    page = 1;
    pageSize = 10;
    collectionSize = 0;

    constructor(private qsoService: QsoService) {
    }

    ngOnInit() {
        const date = new Date();
        this.qsoDate = {
            year: date.getUTCFullYear(),
            month: date.getUTCMonth() + 1,
            day: date.getUTCDate()
        };
        this.qsoTime = {hour: date.getUTCHours(), minute: date.getUTCMinutes()};

        this.newQso = new QSO(
            null,
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
        qso.dateTime = new Date(Date.UTC(this.qsoDate.year, this.qsoDate.month - 1, this.qsoDate.day, this.qsoTime.hour, this.qsoTime.minute));
        this.qsoService.add(qso).subscribe(result => {
            this.qsosFromDB.push(result);
            this.qsos = this.qsosFromDB.sort(this.compareDateTime);
            this.collectionSize = this.qsosFromDB.length;
            this.resetManualSorting();
            document.getElementById('logBookLink').click();
        });
    }

    private delete(qso: QSO): void {
        this.qsoService.delete(qso).subscribe(_ => {
            this.qsosFromDB = this.qsosFromDB.filter(q => q.id !== qso.id);
            this.qsos = this.qsosFromDB.sort(this.compareDateTime);
            this.collectionSize = this.qsosFromDB.length;
            this.resetManualSorting();
            document.getElementById('closeQsoModal').click();
        });
    }

    private addQso() {
        this.add(this.newQso);
    }

    // TODO: implement an edit a QSO modal

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
