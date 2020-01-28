import {TestBed} from '@angular/core/testing';
import {QsoService} from './qso-service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {LoggerConfig, LoggerTestingModule, NGXLogger} from 'ngx-logger';
import {QSO} from '../model/qso';

describe('QsoService', () => {
    let service: QsoService;
    let httpMock: HttpTestingController;

    const dateTime1 = new Date(2019, 12, 15, 22, 0);
    const dateTime2 = new Date(2019, 12, 16, 20, 52);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                LoggerTestingModule,
                HttpClientTestingModule
            ],
            providers: [
                NGXLogger,
                LoggerConfig,
                QsoService
            ]
        });
        service = TestBed.get(QsoService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', async () => {
        expect(service).toBeTruthy();
    });

    it('findAll() should return an Observable', async () => {
        let qso1 = new QSO(dateTime1, 'LZ2VA', '144.000', 'FM', 'Kiro', 'Karlovo');
        qso1.id = 1;
        let qso2 = new QSO(dateTime2, 'LZ1YY', '3.560', 'SSB', 'Pesho', 'Shumen');
        qso2.id = 2;
        const qsos = [qso1, qso2];

        service.findAll().subscribe(response => {
            expect(response.length).toBe(2);
            expect(response).toEqual(qsos);
        });

        const req = httpMock.expectOne('qso');
        expect(req.request.method).toBe('GET');
        req.flush(qsos);
    });

    it('findByDateTimeAndCallsign() should return an Observable', async () => {
        let qso1 = new QSO(dateTime1, 'LZ2VA', '144.000', 'FM', 'Kiro', 'Karlovo');
        qso1.id = 1;

        const dateTime = new Date(Date.UTC(
            dateTime1.getFullYear(),
            dateTime1.getMonth() - 1,
            dateTime1.getDate(),
            dateTime1.getHours(),
            dateTime1.getMinutes()));

        service.findByDateTimeAndCallsign(dateTime.toISOString(), 'LZ2VA').subscribe(response => {
            response[0].dateTime = new Date(response[0].dateTime);
            expect(response.length).toBe(1);
            expect(response[0]).toBe(qso1);
        });

        const req = httpMock.expectOne(`qso/requestQsl?dateTime=${dateTime.toISOString()}&callsign=LZ2VA`);
        expect(req.request.method).toBe('GET');
        req.flush(qso1);
    });

    it('add() should return an Observable', async () => {
        let qso1 = new QSO(dateTime1, 'LZ2VA', '144.000', 'FM', 'Kiro', 'Karlovo');
        qso1.id = 1;

        service.add(qso1).subscribe(response => {
            expect(response).toBe(qso1);
        });

        const req = httpMock.expectOne('qso');
        expect(req.request.method).toBe('POST');
        req.flush(qso1);
    });

    it('delete() should return an Observable', async () => {
        let qso1 = new QSO(dateTime1, 'LZ2VA', '144.000', 'FM', 'Kiro', 'Karlovo');
        qso1.id = 1;

        service.delete(qso1).subscribe();

        const req = httpMock.expectOne('qso/1');
        expect(req.request.method).toBe('DELETE');
        req.flush(qso1);
    });
});
