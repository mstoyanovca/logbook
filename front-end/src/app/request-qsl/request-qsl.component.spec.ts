import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {RequestQslComponent} from './request-qsl.component';
import {FormsModule} from '@angular/forms';
import {LoggerConfig, NGXLogger, NGXLoggerHttpService, NGXLoggerHttpServiceMock} from 'ngx-logger';
import {NgbDatepickerModule, NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';

describe('QslComponent', () => {
  let component: RequestQslComponent;
  let fixture: ComponentFixture<RequestQslComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestQslComponent],
      imports: [FormsModule, NgbTimepickerModule, NgbDatepickerModule, HttpClientTestingModule, RouterTestingModule],
      providers: [NGXLogger, {provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock}, LoggerConfig]
    });

    fixture = TestBed.createComponent(RequestQslComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have <h6> with "Please fill in the form, if you are in my log book, a QSL card will be generated for download:"', () => {
    const bannerElement: HTMLElement = fixture.nativeElement;
    const h6 = bannerElement.querySelector('h6');
    expect(h6.textContent.trim()).toEqual('Please fill in the form, if you are in my log book, a QSL card will be generated for download:');
  });

  it('should have <p> with "Please fill in the form, if you are in my log book, a QSL card will be generated for download:"', () => {
    const bannerElement: HTMLElement = fixture.nativeElement;
    const p = bannerElement.querySelector('p');
    expect(p.textContent.trim()).toEqual('(time has to be within 15 minutes of my log record)');
  });

  it('should have <form>', () => {
    const form = fixture.nativeElement.querySelector('form');
    expect(form).toBeDefined();

    const dateInput = fixture.nativeElement.querySelector('#date');
    expect(dateInput).toBeDefined();

    const timeInput = fixture.nativeElement.querySelector('#time');
    expect(timeInput).toBeDefined();

    const callsignInput = fixture.nativeElement.querySelector('#callsign');
    expect(callsignInput).toBeDefined();

    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeDefined();
  });

  it('should validate <form>', () => {
    fakeAsync(() => {
      const form = fixture.nativeElement.querySelector('form');
      expect(form.$valid).toBeFalsy();

      expect(fixture.debugElement.query(By.css('#dateError'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#timeError'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#csReq'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#csInv'))).toBeNull();

      const callsignInput = fixture.debugElement.query(By.css('#callsign')).nativeElement;
      callsignInput.click();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(fixture.debugElement.query(By.css('#dateError')).nativeElement).toBeDefined();
        expect(fixture.debugElement.query(By.css('#timeError')).nativeElement).toBeDefined();
        expect(fixture.debugElement.query(By.css('#csReq')).nativeElement).toBeDefined();
        expect(fixture.debugElement.query(By.css('#csInv'))).toBeNull();
      });

      callsignInput.value = 'LZ4MN';
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(fixture.debugElement.query(By.css('#csInv')).nativeElement).toBeDefined();
      });
    });
  });
});
