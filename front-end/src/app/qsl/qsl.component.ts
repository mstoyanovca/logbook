import {Component, OnInit} from '@angular/core';
import {QsoDate} from '../model/qso-date';
import {QsoTime} from '../model/qso-time';
import {QSO} from '../model/qso';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {NGXLogger} from 'ngx-logger';

@Component({
    selector: 'app-pdf',
    templateUrl: './qsl.component.html',
    styleUrls: ['./qsl.component.css']
})

export class QslComponent implements OnInit {
    qso: QSO;

    constructor(private logger: NGXLogger) {
    }

    ngOnInit() {
        const date = new QsoDate(2019, 12, 15);
        const time = new QsoTime(22, 0);
        this.qso = new QSO(2, 'LZ1KVY', date, time, '3.564', 'SSB', '588', 'Ivan');
    }

    download() {
        this.logger.log('Generating pdf ...');

        html2canvas(document.getElementById('qsl')).then(canvas => {
            const pdf = new jsPDF('l', 'in', 'a6');
            pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, 6, 4);
            pdf.save('VA3AUI.pdf');
        });
    }
}
