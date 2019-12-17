import {inject, TestBed} from '@angular/core/testing';
import {QsoService} from './qso-service';
import {QsoFactory} from './qso-factory';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {LoggerConfig, NGXLogger, NGXLoggerHttpService, NGXLoggerHttpServiceMock} from 'ngx-logger';
import {QsoDate} from '../model/qso-date';
import {QsoTime} from '../model/qso-time';
import {QSO} from '../model/qso';

describe('QsoService', () => {
    let service: QsoService;
    let httpMock: HttpTestingController;

    const date = new QsoDate(2019, 12, 15);
    const time = new QsoTime(22, 0);
    const qso = new QSO(4, 'LZ4MN', date, time, '28.800', 'FM', '588', 'Dipole');

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NGXLogger, {
                provide: NGXLoggerHttpService,
                useClass: NGXLoggerHttpServiceMock
            }, LoggerConfig, QsoService],
            imports: [HttpClientTestingModule]
        });

        service = TestBed.get(QsoService);
        httpMock = TestBed.get(HttpTestingController);
    });

    it('should be created', () => {
        service = TestBed.get(QsoService);
        expect(service).toBeTruthy();
    });

    it('findAll should return an Observable', inject([NGXLogger], (logger: NGXLogger) => {
        service.findAll().subscribe(response => {
            expect(response).toBe(QsoFactory.createQsos());
        });

        const req = httpMock.expectOne('qsos');
        expect(req.request.method).toBe('GET');
    }));

    it('findByDateTimeAndCallsign should return an Observable', inject([NGXLogger], (logger: NGXLogger) => {
        service.findByDateTimeAndCallsign(date, time, 'LZ4MN').subscribe(response => {
            expect(response).toBe(QsoFactory.createQsos());
        });

        const req = httpMock.expectOne('qsos?date=2019-12-15&time=22:00&callsign=LZ4MN');
        expect(req.request.method).toBe('GET');
    }));

    it('add should return an Observable', inject([NGXLogger], (logger: NGXLogger) => {
        service.add(qso).subscribe(response => {
            expect(response).toBe(qso);
        });

        const req = httpMock.expectOne('qsos');
        expect(req.request.method).toBe('POST');
    }));

    it('delete should return an Observable', inject([NGXLogger], (logger: NGXLogger) => {
        service.delete(qso).subscribe(response => {
            expect(response).toBe(qso);
        });

        const req = httpMock.expectOne('qsos/4');
        expect(req.request.method).toBe('DELETE');
    }));
});
