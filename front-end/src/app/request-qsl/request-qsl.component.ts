import {Component, OnInit} from '@angular/core';
import {QSO} from '../model/qso';
import {QsoService} from '../service/qso-service';
import {NavigationExtras, Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import {QsoDate} from "../model/qso-date";
import {QsoTime} from "../model/qso-time";

@Component({
    selector: 'app-qsl',
    templateUrl: './request-qsl.component.html',
    styleUrls: ['./request-qsl.component.css']
})

export class RequestQslComponent implements OnInit {
    qso: QSO;
    qsoDate: QsoDate;
    qsoTime: QsoTime;
    qsoNotFound: boolean;
    navigationExtras: NavigationExtras;

    constructor(
        private qsoService: QsoService,
        private router: Router,
        private logger: NGXLogger) {
    }

    ngOnInit() {
        this.qso = new QSO(null, '', '', '', '');
        this.qsoNotFound = false;
    }

    onSubmit() {
        this.logger.log('Requesting a QSL card:');
        this.logger.log('date = ' + JSON.stringify(this.qsoDate));
        this.logger.log('time = ' + JSON.stringify(this.qsoTime));
        this.logger.log('callsign = ' + this.qso.callsign);

        const dateTime = new Date(Date.UTC(this.qsoDate.year, this.qsoDate.month - 1, this.qsoDate.day, this.qsoTime.hour, this.qsoTime.minute));

        this.qsoService.findByDateTimeAndCallsign(dateTime.toISOString(), this.qso.callsign).subscribe(result => {
            if (result.length == 0) {
                this.logger.log("No QSO found");
                this.qsoNotFound = true;
                this.router.navigateByUrl('request-qsl');
            } else {
                this.qso = result[0];
                this.qso.dateTime = new Date(result[0].dateTime);
                this.qsoNotFound = false;

                this.logger.log(`Found a QSO: ${JSON.stringify(this.qso)}`);
                this.logger.log('Generating pdf ...');

                this.navigationExtras = {
                    state: {
                        callsign: this.qso.callsign,
                        date: this.qso.dateTime.toLocaleDateString(),
                        utc: this.qso.dateTime.toLocaleTimeString("en-US", {
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        frequency: this.qso.frequency,
                        mode: this.qso.mode,
                        rst: this.qso.rstSent
                    }
                };

                this.router.navigate(['qsl'], this.navigationExtras);
            }
        }, error => this.logger.log("error = " + error));
    }
}
