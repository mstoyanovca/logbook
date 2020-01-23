import {Component} from '@angular/core';
import {QSO} from '../model/qso';
import {QsoService} from '../service/qso-service';
import {Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import {QsoDate} from "../model/qso-date";
import {QsoTime} from "../model/qso-time";

@Component({
    selector: 'app-qsl',
    templateUrl: './request-qsl.component.html',
    styleUrls: ['./request-qsl.component.css']
})

export class RequestQslComponent {
    qso = new QSO(null, '', '', '', '');
    qsoDate: QsoDate;
    qsoTime: QsoTime;

    constructor(
        private qsoService: QsoService,
        private router: Router,
        private logger: NGXLogger) {
    }

    onSubmit() {
        this.logger.log('Requesting a QSL card:');
        this.logger.log('date = ' + JSON.stringify(this.qsoDate));
        this.logger.log('time = ' + JSON.stringify(this.qsoTime));
        this.logger.log('callsign = ' + this.qso.callsign);

        const dateTime = new Date(this.qsoDate.year,
            this.qsoDate.month - 1,
            this.qsoDate.day,
            this.qsoTime.hour,
            this.qsoTime.minute)
            .toLocaleString("en-US", {hour12: false});

        this.qsoService.findByDateTimeAndCallsign(dateTime, this.qso.callsign).subscribe(result => {
            this.qso = result[0];

            this.logger.log(`Found a QSO: ${JSON.stringify(this.qso)}`);
            this.logger.log('Generating pdf ...');

            this.router.navigateByUrl('qsl');
        }, error => this.logger.log("error = " + error));
    }
}
