import {ComponentFixture, TestBed} from '@angular/core/testing';
import {QslComponent} from './qsl.component';
import {LoggerConfig, LoggerTestingModule, NGXLogger} from 'ngx-logger';
import {RouterTestingModule} from "@angular/router/testing";
import {Router} from "@angular/router";

describe('PdfComponent', () => {
    let router: Router;
    let component: QslComponent;
    let fixture: ComponentFixture<QslComponent>;

    beforeEach(() => {
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
        });

        router = TestBed.get(Router);
        router.initialNavigation();

        fixture = TestBed.createComponent(QslComponent);
        component = fixture.componentInstance;

        spyOn(router, 'getCurrentNavigation').and.returnValues({
            'extras': {
                state: {
                    callsign: "",
                    date: "",
                    utc: "",
                    frequency: "",
                    mode: "",
                    rst: ""
                }
            }
        });

        fixture.detectChanges();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should create', async () => {
        expect(component).toBeTruthy();
    });

    it('should have <nav>', async () => {
        expect(fixture.nativeElement.querySelector('nav')).toBeTruthy();
    });

    it('should have <div>', async () => {
        expect(fixture.nativeElement.querySelector('#qsl')).toBeTruthy();
    });
});
