import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SignalGeneratorComponent} from './signal-generator.component';

describe('SignalGeneratorComponent', () => {
  let component: SignalGeneratorComponent;
  let fixture: ComponentFixture<SignalGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignalGeneratorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have <h5> with "DDS Signal Generator"', () => {
    const bannerElement: HTMLElement = fixture.nativeElement;
    const h5 = bannerElement.querySelector('h5');
    expect(h5.textContent.trim()).toEqual('DDS Signal Generator');
  });

  it('should have <p> with "A signal generator for a home lab:"', () => {
    const bannerElement: HTMLElement = fixture.nativeElement;
    const p = bannerElement.querySelector('p');
    expect(p.textContent.trim()).toEqual('A signal generator for a home lab:');
  });

  it('should have <ul>', () => {
    const bannerElement: HTMLElement = fixture.nativeElement;
    const ul = bannerElement.querySelector('ul');
    expect(ul).toBeDefined();
    expect(ul.childElementCount).toBe(7);
  });
});
