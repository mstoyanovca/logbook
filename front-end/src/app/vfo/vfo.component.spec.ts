import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {VfoComponent} from './vfo.component';

describe('VfoComponent', () => {
    let component: VfoComponent;
    let fixture: ComponentFixture<VfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VfoComponent]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(VfoComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('should create', async () => {
        expect(component).toBeTruthy();
    });

    it('should have <h5> with "DDS VFO"', async () => {
        const bannerElement: HTMLElement = fixture.nativeElement;
        const h5 = bannerElement.querySelector('h5');
        expect(h5.textContent.trim()).toEqual('DDS VFO');
    });

    it('should have <p>', async () => {
        const bannerElement: HTMLElement = fixture.nativeElement;
        const p = bannerElement.querySelector('p');
        expect(p).toBeDefined();
    });

    it('should have <ul>', async () => {
        const bannerElement: HTMLElement = fixture.nativeElement;
        const ul = bannerElement.querySelector('ul');
        expect(ul).toBeDefined();
        expect(ul.childElementCount).toBe(6);
    });
});
