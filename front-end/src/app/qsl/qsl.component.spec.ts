import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {QslComponent} from './qsl.component';
import {LoggerConfig, LoggerTestingModule, NGXLogger} from 'ngx-logger';
import {RouterTestingModule} from "@angular/router/testing";

describe('PdfComponent', () => {
    let component: QslComponent;
    let fixture: ComponentFixture<QslComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                QslComponent
            ],
            imports: [
                LoggerTestingModule,
                RouterTestingModule
            ],
            providers: [
                NGXLogger,
                LoggerConfig
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(QslComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should create', async () => {
        let state = {callsign: "", date: "", utc: "", frequency: "", mode: "", rst: ""};
        expect(component).toBeTruthy();
    });

    it('should have <nav>', async () => {
        expect(fixture.nativeElement.querySelector('nav')).toBeTruthy();
    });

    it('should have <div>', async () => {
        expect(fixture.nativeElement.querySelector('#qsl')).toBeTruthy();
    });
});
