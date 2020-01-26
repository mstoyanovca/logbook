import {Component} from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {NGXLogger} from 'ngx-logger';
import {Router} from "@angular/router";

@Component({
    selector: 'app-pdf',
    templateUrl: './qsl.component.html',
    styleUrls: ['./qsl.component.css']
})

export class QslComponent {
    state: { callsign: string, date: string, utc: string, frequency: string, mode: string, rst: string };

    constructor(
        private router: Router,
        private logger: NGXLogger) {
        this.state = this.router.getCurrentNavigation().extras.state ? this.router.getCurrentNavigation().extras.state as {
            callsign: string,
            date: string,
            utc: string,
            frequency: string,
            mode: string,
            rst: string
        } : {
            callsign: "",
            date: "",
            utc: "",
            frequency: "",
            mode: "",
            rst: ""
        };
    }

    download() {
        this.logger.log('Downloading pdf ...');

        html2canvas(document.getElementById('qsl')).then(canvas => {
            const pdf = new jsPDF('l', 'in', 'a6');
            pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, 6, 4);
            pdf.save('VA3AUI.pdf');
        });
    }
}
