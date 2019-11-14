import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {QslComponent} from './qsl.component';
import {NGXLogger, NGXLoggerHttpService, NGXLoggerHttpServiceMock, LoggerConfig} from 'ngx-logger';

describe('PdfComponent', () => {
  let component: QslComponent;
  let fixture: ComponentFixture<QslComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QslComponent],
      providers: [NGXLogger, {provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock}, LoggerConfig]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QslComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have <nav>', () => {
    expect(fixture.nativeElement.querySelector('nav')).toBeTruthy();
  });

  it('should have <div>', () => {
    expect(fixture.nativeElement.querySelector('#qsl')).toBeTruthy();
  });
});
