import {Component, OnInit} from '@angular/core';
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
        const date = new Date(2019, 12, 15, 22, 0);
        const time: Date = new Date(22, 0);
        this.qso = new QSO(2,  date, time, 'LZ1KVY','3.564', 'SSB', 'Ivan', 'Varna');
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
