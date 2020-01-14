import {Component, OnInit} from '@angular/core';
import {QSO} from '../model/qso';
import {QsoService} from '../service/qso-service';
import {Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';

@Component({
    selector: 'app-qsl',
    templateUrl: './request-qsl.component.html',
    styleUrls: ['./request-qsl.component.css']
})

export class RequestQslComponent implements OnInit {
    qso = new QSO(null, '', '', '', '');

    constructor(
        private qsoService: QsoService,
        private router: Router,
        private logger: NGXLogger) {
    }

    ngOnInit() {
    }

    onSubmit() {
        this.logger.log('Requesting a QSL card:');
        this.logger.log('dateTime=' + JSON.stringify(this.qso.dateTime));
        this.logger.log('callsign=' + this.qso.callsign);

        this.qsoService.findByDateTimeAndCallsign(this.qso.dateTime, this.qso.callsign).subscribe(result => {
            this.qso = result[0];

            this.logger.log('Found a QSO:');
            this.logger.log(this.qso);
            this.logger.log('Generating pdf ...');

            this.router.navigateByUrl('qsl');
        });
    }
}
