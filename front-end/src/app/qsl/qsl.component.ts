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
        const now = new Date();
        const dateTime = new Date(now.getFullYear(), now.getMonth(), now.getDay());
        this.qso = new QSO(dateTime, '', '', 'SSB', '');
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
