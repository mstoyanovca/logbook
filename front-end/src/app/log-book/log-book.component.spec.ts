import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LogBookComponent} from './log-book.component';
import {FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgbDatepickerModule, NgbPaginationModule, NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {LoggerConfig, NGXLogger, NGXLoggerHttpService, NGXLoggerHttpServiceMock} from 'ngx-logger';
import {By} from '@angular/platform-browser';
import {QsoDate} from '../model/qso-date';
import {QsoTime} from '../model/qso-time';
import {QSO} from '../model/qso';

describe('LogBookComponent', () => {
    let component: LogBookComponent;
    let fixture: ComponentFixture<LogBookComponent>;

    const date1 = new QsoDate(2019, 12, 15);
    const date2 = new QsoDate(2019, 12, 16);

    const time1 = new QsoTime(22, 0);
    const time2 = new QsoTime(20, 52);

    const qso1 = new QSO(2, 'LZ1KVY', date1, time1, '3.564', 'SSB', '588', 'Dipole');
    const qso2 = new QSO(3, 'LZ2KVV', date2, time2, '446.100', 'FM', '599', '5W');

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LogBookComponent],
            imports: [FormsModule, NgbTimepickerModule, NgbDatepickerModule, NgbPaginationModule, HttpClientTestingModule],
            providers: [NGXLogger, {provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock}, LoggerConfig]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LogBookComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have <nav>', () => {
        expect(fixture.nativeElement.querySelector('nav')).toBeDefined();
    });

    it('should have <form> with an id "searchForm"', () => {
        expect(fixture.nativeElement.querySelector('hr')).toBeDefined();
        expect(fixture.nativeElement.querySelector('#searchForm')).toBeDefined();
    });

    it('should have <div> with an id "accordion"', () => {
        expect(fixture.nativeElement.querySelector('#accordionHeader')).toBeDefined();
        expect(fixture.nativeElement.querySelector('#accordion')).toBeDefined();
    });

    it('should have <ngb-pagination>', () => {
        expect(fixture.nativeElement.querySelector('ngb-pagination')).toBeDefined();
    });

    it('should not display the "deleteQsoModal"', () => {
        expect(fixture.debugElement.query(By.css('#deleteQsoModal')).nativeElement.height).toBeUndefined();
    });

    it('should compare date', () => {
        expect(component.compareDate(qso1, qso2)).toBeLessThan(0);
    });

    it('should compare time', () => {
        expect(component.compareTime(qso1, qso2)).toBeLessThan(0);
    });

    /*it('should compare bands ascending', () => {
        expect(component.compareBandAsc(qso1, qso2)).toBeLessThan(0);
    });

    it('should compare bands descending', () => {
        expect(component.compareBandDesc(qso1, qso2)).toBeGreaterThan(0);
    });*/
});
