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
  qso = new QSO(0, null, null, '', '', '', '', '', '', '');

  constructor(
    private qsoService: QsoService,
    private router: Router,
    private logger: NGXLogger) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.logger.log('Requesting a QSL card:');
    this.logger.log('date=' + JSON.stringify(this.qso.date));
    this.logger.log('time=' + JSON.stringify(this.qso.time));
    this.logger.log('callsign=' + this.qso.callsign);

    this.qsoService.findByDateTimeAndCallsign(this.qso.date, this.qso.time, this.qso.callsign).subscribe(result => {
      this.qso = result[0];

      this.logger.log('Found a QSO:');
      this.logger.log(this.qso);
      this.logger.log('Generating pdf ...');

      this.router.navigateByUrl('qsl');
    });
  }
}
