import {Component, OnInit} from '@angular/core';
import {QSO} from '../model/qso';
import {Direction} from '../model/direction';
import {QsoService} from '../service/qso-service';

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
    frequencyDirection = Direction.None;
    asc = '..\\..\\assets\\up-icon.png';
    desc = '..\\..\\assets\\down-icon.png';
    callsignImagePath = '';
    frequencyImagePath = '';

    filter = '';

    page = 1;
    pageSize = 10;
    collectionSize = 0;

    qsoToDelete = new QSO(0, '', null, null, '', '', '', '');

    constructor(private qsoService: QsoService) {
    }

    ngOnInit() {
        const date = new Date();
        this.newQso = new QSO(
            0,
            '',
            new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()),
            new Date(0, 0, 0, date.getHours(), date.getMinutes()),
            '',
            'SSB',
            '',
            '');

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
        if (qso1.date.getFullYear() !== qso2.date.getFullYear()) {
            return qso1.date.getFullYear() - qso2.date.getFullYear();
        } else if (qso1.date.getMonth() !== qso2.date.getMonth()) {
            return qso1.date.getMonth() - qso2.date.getMonth();
        } else {
            return qso1.date.getDay() - qso2.date.getDay();
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
                return qso1.frequency < qso2.frequency ? -1 : qso1.frequency > qso2.frequency ? 1 : this.compareDate;
            });
            this.frequencyDirection = Direction.Asc;
            this.frequencyImagePath = this.asc;
        } else if (this.frequencyDirection === Direction.Asc) {
            // @ts-ignore
            this.qsos = this.qsosFromDB.sort((qso1: QSO, qso2: QSO) => {
                return qso1.frequency > qso2.frequency ? -1 : qso1.frequency < qso2.frequency ? 1 : this.compareDate;
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
        this.qsos = this.qsosFromDB.filter(qso =>
            (qso.date.getFullYear() + '-' + qso.date.getMonth() + '-' + qso.date.getDay()).indexOf(this.filter) > -1 ||
            (qso.time.getHours() + ':' + qso.time.getMinutes()).indexOf(this.filter) > -1 ||
            qso.callsign.indexOf(this.filter.toUpperCase()) > -1 ||
            qso.frequency.toLowerCase().indexOf(this.filter) > -1);
        this.collectionSize = this.qsos.length;
    };

    private resetManualSorting = (): void => {
        this.callsignDirection = Direction.None;
        this.callsignImagePath = '';
        this.frequencyDirection = Direction.None;
        this.frequencyImagePath = '';
    }
}
